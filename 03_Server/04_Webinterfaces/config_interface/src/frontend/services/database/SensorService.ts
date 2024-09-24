import { SensorDBTableData } from "../../../backend/types";

const apiPath: string = "/api/sensor/";

/**
 * Service class for managing sensor data.
 */
export class SensorService {
  /**
   * Retrieves all sensor data.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    return await fetch(apiPath + "selectAll").then((data) => data.json());
  }

  /**
   * Retrieves sensor data by ID.
   * @param {number} sensor_id - The ID of the sensor.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async findByID(sensor_id: number) {
    return await fetch(apiPath + `findByID?sensor_id=${sensor_id}`).then((data) => data.json());
  }

  /**
   * Retrieves sensor details by ID.
   * @param {number} sensor_id - The ID of the sensor.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async findSensorDetailsByID(sensor_id: number) {
    return await fetch(apiPath + `findSensorDetailsByID?sensor_id=${sensor_id}`).then((data) => data.json());
  }

  /**
   * Retrieves sensors associated with a logger.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async findSensorsByLogger(logger_id: number) {
    return await fetch(apiPath + `findSensorsByLogger?logger_id=${logger_id}`).then((data) => data.json());
  }

  /**
   * Edits sensor data by ID.
   * @param {number} sensor_id - The ID of the sensor.
   * @param {SensorDBTableData} obj - The updated sensor data.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async editSensorByID(sensor_id: number, obj: SensorDBTableData) {
    const res = await fetch(apiPath + `editSensorByID?sensor_id=${sensor_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj, null, 2),
    }).then((data) => data.json());
    return res;
  }

  /**
   * Inserts new sensor data.
   * @param {SensorDBTableData} obj - The new sensor data to insert.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async insertNewSensor(obj: SensorDBTableData) {
    const res = await fetch(apiPath + "insertNewSensor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj, null, 2),
    }).then((data) => data.json());
    return res;
  }
}
