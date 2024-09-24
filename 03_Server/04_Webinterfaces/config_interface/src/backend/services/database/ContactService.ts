import { db } from "../../db";

/**
 * Service class for handling Contact-related operations.
 */ export class ContactService {
  /**
   * Retrieves all Contact records from the database.
   * @returns {Promise<Object[]>} - Array of Contact records.
   */
  async selectAll() {
    const result = await db.selectFrom("Contact").selectAll().execute();
    return result;
  }
}
