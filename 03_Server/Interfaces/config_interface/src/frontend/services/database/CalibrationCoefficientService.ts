import { CalibrationCoefficient } from "../../../backend/entities";

const apiPath: string = "/api/calibration/";

/**
 * Service class for managing calibration coefficients.
 */
export class CalibrationCoefficientService {
  /**
   * Retrieves all calibration coefficients.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    return await fetch(apiPath + "selectAll").then((data) => data.json());
  }

  /**
   * Inserts new calibration coefficients.
   * @param {CalibrationCoefficient[]} obj - Array of calibration coefficients to insert.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async insertNewCalibrationCoefficien(obj: CalibrationCoefficient[]) {
    const res = await fetch(apiPath + "insertNewCalibrationCoefficien", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj, null, 2),
    }).then((data) => data.json());
    return res;
  }
}
