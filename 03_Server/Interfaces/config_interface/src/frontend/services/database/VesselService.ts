const apiPath: string = "/api/vessel/";

/**
 * Service class for managing vessel data.
 */
export class VesselService {
  /**
   * Retrieves all vessels.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    const res = await fetch(apiPath + "selectAll").then((data) => data.json());
    return res;
  }
}
