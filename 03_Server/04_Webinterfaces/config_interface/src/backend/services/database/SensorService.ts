import { db } from "../../db";
import { SensorDBTableData } from "../../types";

/**
 * Service class for handling Sensor-related operations.
 */
export class SensorService {
  /**
   * Retrieves all sensor records.
   * @returns {Promise<any[]>} - Array of sensor records.
   */
  async getAll() {
    const result = await db.selectFrom("Sensor").selectAll().execute();
    return result;
  }

  /**
   * Finds a sensor by its ID.
   * @param {number} sensor_id - ID of the sensor.
   * @returns {Promise<any[]>} - Array containing the sensor record.
   */
  async findByID(sensor_id: number) {
    const result = await db.selectFrom("Sensor").selectAll().where("sensor_id", "=", sensor_id).execute();
    return result;
  }

  /**
   * Finds sensor details by its ID, including information from related tables.
   * @param {number} sensor_id - ID of the sensor.
   * @returns {Promise<any>} - Object containing sensor details.
   */
  async findSensorDetailsByID(sensor_id: number) {
    const result = await db
      .selectFrom("Sensor")
      .where("Sensor.sensor_id", "=", sensor_id)
      .leftJoin("SensorType", "Sensor.sensor_type_id", "SensorType.sensor_type_id")
      .leftJoin("Unit", "Unit.unit_id", "SensorType.unit_id")
      .leftJoin("LoggerContainsSensor", (join) =>
        join
          .onRef("LoggerContainsSensor.sensor_id", "=", "Sensor.sensor_id")
          .on("LoggerContainsSensor.time_end", "is", null)
      )
      .select([
        "Sensor.sensor_id",
        "Sensor.serial_number",
        "Sensor.date_manufactoring",
        "LoggerContainsSensor.bus_address",
        "LoggerContainsSensor.logger_id",
        "Sensor.sensor_type_id",
        "SensorType.manufacturer",
        "SensorType.model",
        "SensorType.parameter",
        "SensorType.parameter_no",
        "SensorType.resolution",
        "SensorType.unit_id",
        "SensorType.long_name",
        "SensorType.accuracy",
        "SensorType.long_name",
        "SensorType.no_of_calibration_coefficients",
        "SensorType.digits_calibration_coefficients",
        "Unit.unit",
      ])

      .executeTakeFirst();

    return result;
  }

  /**
   * Finds sensors associated with a specific logger.
   * @param {number} logger_id - ID of the logger.
   * @returns {Promise<any[]>} - Array of sensors associated with the logger.
   */
  async findSensorsByLogger(logger_id: number) {
    const result = await db
      .selectFrom("LoggerContainsSensor")
      .where("LoggerContainsSensor.logger_id", "=", logger_id)
      .where("LoggerContainsSensor.time_end", "is", null)
      .leftJoin("Sensor", "LoggerContainsSensor.sensor_id", "Sensor.sensor_id")
      .leftJoin("SensorType", "SensorType.sensor_type_id", "Sensor.sensor_type_id")
      .selectAll()
      .execute();
    return result;
  }

  /**
   * Inserts a new sensor into the database.
   * @param {SensorDBTableData} data - Data for the new sensor.
   * @returns {Promise<any>} - Object containing details of the inserted sensor.
   */
  async insertNewSensor(data: SensorDBTableData) {
    const sensor = await db
      .insertInto("Sensor")
      .values({
        sensor_type_id: data.sensor_type_id,
        serial_number: data.serial_number,
        date_manufactoring: data.date_manufactoring,
        date_first_deployed: null,
        date_last_deployed: null,
      })
      .executeTakeFirst();
    const sensor_id = Number(sensor.insertId);
    if (data.logger_id && sensor_id) {
      const loggerContainsSensorUpdate = await db
        .updateTable("LoggerContainsSensor")
        .set({ time_end: new Date() })
        .where("LoggerContainsSensor.sensor_id", "=", sensor_id)
        .where("LoggerContainsSensor.time_end", "is", null)
        .executeTakeFirst();

      const loggerContainsSensorInsert = await db
        .insertInto("LoggerContainsSensor")
        .values({
          time_end: null,
          time_start: new Date(),
          sensor_id: sensor_id,
          logger_id: data.logger_id,
          bus_address: data.bus_address,
        })
        .executeTakeFirst();
    }
    const res = await this.findSensorDetailsByID(Number(sensor_id));

    return res;
  }

  /**
   * Edits an existing sensor's details in the database.
   * @param {number} sensor_id - ID of the sensor to be edited.
   * @param {SensorDBTableData} data - Updated data for the sensor.
   * @returns {Promise<any>} - Object containing details of the edited sensor.
   */
  async editSensorByID(sensor_id: number, data: SensorDBTableData) {
    const sensor = await db
      .updateTable("Sensor")
      .set({ sensor_type_id: data.sensor_type_id })
      .where("Sensor.sensor_id", "=", sensor_id)
      .executeTakeFirst();

    const loggerContainsSensorUpdate = await db
      .updateTable("LoggerContainsSensor")
      .set({ time_end: new Date() })
      .where("LoggerContainsSensor.sensor_id", "=", sensor_id)
      .where("LoggerContainsSensor.time_end", "is", null)
      .executeTakeFirst();

    if (data.logger_id && data.logger_id > -1) {
      const loggerContainsSensorInsert = await db
        .insertInto("LoggerContainsSensor")
        .values({
          time_end: null,
          time_start: new Date(),
          sensor_id: sensor_id,
          logger_id: data.logger_id,
          bus_address: Number(data.bus_address),
        })
        .executeTakeFirst();
    }

    const res = await this.findSensorDetailsByID(Number(sensor_id));
    return res;
  }
}

export type SensorByLogger = Awaited<ReturnType<SensorService["findSensorsByLogger"]>>[number];
export type SensorDetails = Awaited<ReturnType<SensorService["findSensorDetailsByID"]>>;
export type EditSensorByID = Awaited<ReturnType<SensorService["editSensorByID"]>>;
export type InsertNewSensor = Awaited<ReturnType<SensorService["insertNewSensor"]>>;
