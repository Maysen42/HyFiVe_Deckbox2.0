import { db } from "../../db";

/**
 * Service class for managing operations related to Sensor Types.
 */
export class SensorTypeService {
  /**
   * Retrieves all sensor type records.
   * @returns {Promise<any[]>} - Array of sensor type records.
   */
  async getAll() {
    const result = await db.selectFrom("SensorType").selectAll().execute();
    return result;
  }
}
