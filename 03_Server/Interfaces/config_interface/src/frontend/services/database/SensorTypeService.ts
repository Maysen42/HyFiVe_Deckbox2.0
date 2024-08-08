const apiPath: string = "/api/sensortype/";

/**
 * Service class for managing sensor type data.
 */
export class SensorTypeService {
  /**
   * Retrieves all sensor types.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    return await fetch(apiPath + "selectAll").then((data) => data.json());
  }
}
