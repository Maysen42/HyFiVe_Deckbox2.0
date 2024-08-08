import { CombinedLoggerData } from "../../../backend/services/database/LoggerService";
import { LoggerDBTableData } from "../../../backend/types";

const apiPath: string = "/api/logger/";
/**
 * Service class for managing logger data.
 */
export class LoggerService {
  /**
   * Retrieves all logger data.
   * @returns {Promise<LoggerTableData[]>} - A promise that resolves to the result of the API call.
   */
  async selectAll() {
    const res = await fetch(apiPath + "selectAll").then((data) => data.json());
    return res;
  }
  /**
   * Retrieves logger data by ID.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<LoggerByID>} - A promise that resolves to the result of the API call.
   */
  async findByID(logger_id: number) {
    const res = await fetch(apiPath + "findByID?logger_id=" + logger_id).then((data) => data.json());
    return res;
  }
  /**
   * Retrieves combined logger data.
   * @returns {Promise<CombinedLoggerData[]>} - A promise that resolves to the result of the API call.
   */
  async getCombindedLoggerData() {
    const res = await fetch(apiPath + "getCombindedLoggerData").then((data) => data.json());
    const reducedArray = res.reduce((accumulator: CombinedLoggerData[], current: CombinedLoggerData) => {
      if (!accumulator.find((item) => item.logger_id === current.logger_id)) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);

    reducedArray.sort((a: CombinedLoggerData, b: CombinedLoggerData) => {
      if (a.logger_id && b.logger_id) return a.logger_id - b.logger_id;
    });

    return reducedArray;
  }
  /**
   * Edits logger data by ID.
   * @param {number} logger_id - The ID of the logger to edit.
   * @param {LoggerDBTableData} obj - The updated data for the logger.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async editLoggerByID(logger_id: number, obj: LoggerDBTableData) {
    const res = await fetch(apiPath + "editLoggerByID?logger_id=" + logger_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj, null, 2),
    }).then((data) => data.json());
    return res;
  }
  /**
   * Inserts new logger data.
   * @param {LoggerDBTableData} obj - The data for the new logger.
   * @returns {Promise<any>} - A promise that resolves to the result of the API call.
   */
  async insertNewLogger(obj: LoggerDBTableData) {
    const res = await fetch(apiPath + "insertNewLogger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj, null, 2),
    }).then((data) => data.json());
    return res;
  }
}
