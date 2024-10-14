import { format } from "date-fns";
import { db } from "../../db";
import { CalibrationCoefficient } from "../../entities";
import { Insertable } from "kysely";

/**
 * Service class for handling Calibration Coefficient -related operations.
 */ export class CalibrationCoefficientService {
  /**
   * Retrieves all Calibration Coefficient records from the database.
   * @returns {Promise<Object[]>} - Array of Calibration Coefficient records.
   */
  async selectAll() {
    const result = await db
      .selectFrom("CalibrationCoefficient")
      .selectAll()
      .orderBy("CalibrationCoefficient.sensor_id")
      .execute();
    return result;
  }

  /**
   * Inserts new Calibration Coefficient records into the database.
   * @param {CalibrationCoefficient[]} calCoefficients - Array of Calibration Coefficient objects to insert.
   * @returns {Promise<CalibrationCoefficient[]>} - Array of inserted Calibration Coefficient objects.
   */
  async insertNewCalibrationCoefficien(obj: CalibrationCoefficient[]) {
    const result = Object.values(obj).map(async (calcoeff: CalibrationCoefficient) => {
      const input: Insertable<CalibrationCoefficient> = {
        ...calcoeff,
        time_calibration: new Date(format(new Date(calcoeff.time_calibration), "yyyy-MM-dd HH:mm:ss")),
      };
      await db.insertInto("CalibrationCoefficient").values(input).executeTakeFirst();
    });
    return obj;
  }
}
