import { db } from "../../db";

/**
 * Service class for managing operations related to Units.
 */
export class UnitService {
  /**
   * Retrieves all unit records.
   * @returns {Promise<any[]>} - Array of unit records.
   */
  async getAll() {
    const result = await db.selectFrom("Unit").selectAll().execute();
    return result;
  }
}
