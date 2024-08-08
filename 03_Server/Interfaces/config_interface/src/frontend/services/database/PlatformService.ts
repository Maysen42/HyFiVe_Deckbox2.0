const apiPath: string = "/api/platform/";

/**
 * Service class for managing platform data.
 */
export class PlatformService {
  /**
   * Retrieves all platform data.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    const res = await fetch(apiPath + "selectAll").then((data) => data.json());
    return res;
  }
}
