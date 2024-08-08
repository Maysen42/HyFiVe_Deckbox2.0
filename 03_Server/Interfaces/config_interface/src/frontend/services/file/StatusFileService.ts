const apiPath = "api/status/";

/**
 * Service class for managing status files.
 */
export class StatusFileService {
  /**
   * Retrieves a specific status file.
   * @param {string} path - The path of the status file.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async getStatusFile(path: string) {
    return await fetch(apiPath + "getStatusFile?path=" + path).then((res) => res.json());
  }

  /**
   * Retrieves the newest status file for a specific logger.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async getNewestStatusFileByLogger(logger_id: number) {
    return await fetch(apiPath + "getNewestStatusFileByLogger?logger_id=" + logger_id).then((res) => res.json());
  }

  /**
   * Retrieves all status files.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async getStatusFiles() {
    return await fetch(apiPath + "getStatusFiles").then((res) => res.json());
  }

  /**
   * Retrieves positions from all status files.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async getPositionsFromStatusFiles() {
    return await fetch(apiPath + "getPositionsFromStatusFiles").then((res) => res.json());
  }
}
