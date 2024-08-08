const apiPath: string = "/api/contact/";

/**
 * Service class for managing contact data.
 */
export class ContactService {
  /**
   * Retrieves all contact data.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    const res = await fetch(apiPath + "selectAll").then((data) => data.json());
    return res;
  }
}
