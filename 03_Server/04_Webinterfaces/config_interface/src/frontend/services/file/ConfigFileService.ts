import { LoggerConfigFileData } from "../../../backend/types";

const apiPath = "api/config/";

/**
 * Service class for managing configuration files.
 */
export class ConfigFileService {
  /**
   * Retrieves a specific configuration file.
   * @param {string} path - The path of the configuration file.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async getConfigFile(path: string) {
    return await fetch(apiPath + "api/config/getConfigFile?path=" + path).then((res) => res.json());
  }

  /**
   * Retrieves all configuration files.
   * @returns {Promise<any[]>} - A promise that resolves to the result of the API call.
   */
  async getConfigFiles() {
    return await fetch(apiPath + "getConfigFiles").then((res) => res.json());
  }

  /**
   * Retrieves the newest configuration file for a specific logger.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async getNewestConfigFile(logger_id: number) {
    return await fetch(apiPath + "getNewestConfigFile?logger_id=" + logger_id).then((res) => res.json());
  }

  /**
   * Adds a new configuration file.
   * @param {LoggerConfigFileData} obj - The configuration file data.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async addNewConfig(obj: LoggerConfigFileData) {
    const res = await fetch(apiPath + "addNewConfig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj, null, 2),
    }).then((data) => data.json());
    return res;
  }
}
