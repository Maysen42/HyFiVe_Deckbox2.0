import { db } from "../../db";

/**
 * Service class for handling Platform-related operations.
 */
export class PlatformService {
  /**
   * Retrieves all platform records.
   * @returns {Promise<any[]>} - Array of platform records.
   */
  async selectAll() {
    const result = await db.selectFrom("Platform").selectAll().execute();
    return result;
  }
}
