import { db } from "../../db";

/**
 * Service class for managing operations related to Vessels.
 */
export class VesselService {
  /**
   * Retrieves all vessel records.
   * @returns {Promise<any[]>} - Array of vessel records.
   */
  async selectAll() {
    const result = await db.selectFrom("Vessel").selectAll().execute();
    return result;
  }
}
