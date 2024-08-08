const apiPath: string = "/api/unit/";

/**
 * Service class for managing unit data.
 */
export class UnitService {
  /**
   * Retrieves all units.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    return await fetch(apiPath + "selectAll").then((data) => data.json());
  }
}
