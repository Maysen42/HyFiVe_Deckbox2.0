import fsPromises from "fs/promises";
import fs from "fs";
import { isNotJunk } from "junk";
import { getDateFromFileName } from "../../../frontend/utils";
import { LoggerConfigFileData, LoggerConfigTableData } from "../../types";

const configFilePath = process.env.CONFIG_FILE_PATH + "" + process.env.CONFIG_FILE_STRUCTURE;
const statusFilePath = process.env.CONFIG_FILE_PATH + "" + process.env.STATUS_FILE_STRUCTURE;

/**
 * Service class for managing configuration files.
 */
export class ConfigFileService {
  /**
   * Retrieves the content of a specific configuration file.
   * @param {string} path - The path of the configuration file.
   * @returns {Promise<any>} - The content of the configuration file.
   */
  async getConfigFile(path: string) {
    const jsonData = await fsPromises.readFile(configFilePath + path, "utf8");
    const objectData = JSON.parse(jsonData);

    return objectData;
  }

  /**
   * Retrieves a list of available configuration files.
   * @returns {Promise<string[]>} - Array of configuration file names.
   */
  async getConfigFiles() {
    const dirName = fs.readdirSync(configFilePath).filter(isNotJunk);

    const filenames: string[] = [];

    dirName.map((dir) => {
      const files = fs.readdirSync(configFilePath + dir);
      files.map((file) => {
        const filename = dir + "/" + file;
        filenames.push(filename);
      });
    });

    const sortedFilenames = filenames.sort((a, b) => {
      const aDate = getDateFromFileName(a);
      const bDate = getDateFromFileName(b);
      return bDate - aDate;
    });
    const reducedFilenames = sortedFilenames.reduce((accumulator: string[], current: string) => {
      if (
        !accumulator.find((item) => item.split("/")[0] === current.split("/")[0]) &&
        isNotJunk(current.split("/")[1])
      ) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);

    return reducedFilenames;
  }

  /**
   * Retrieves a list of configuration files associated with a specific logger.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<string[]>} - Array of configuration file names.
   */
  async getConfigFilesByLogger(logger_id: number) {
    const dirName = fs.readdirSync(configFilePath).filter(isNotJunk);

    const filenames: string[] = [];

    dirName.map((dir) => {
      const files = fs.readdirSync(configFilePath + dir);
      files.map((file) => {
        const filename = dir + "/" + file;
        filenames.push(filename);
      });
    });

    const loggerId = logger_id.toString().length === 1 ? "0" + logger_id : logger_id;
    const regex = `^logger_${loggerId}+\/logger_${loggerId}+_config_\\d+\.json$`;
    const filteredFileNames = filenames.filter((filename) => {
      return Number(filename.split("_")[1].split("/")[0]) === logger_id && filename.match(regex);
    });

    const sortedFilenames = filteredFileNames.sort((a, b) => {
      const aDate = getDateFromFileName(a);
      const bDate = getDateFromFileName(b);
      return bDate - aDate;
    });

    return sortedFilenames;
  }

  /**
   * Retrieves the content of the newest configuration file associated with a specific logger.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<LoggerConfigTableData>} - The content of the newest configuration file.
   */
  async getConfigNewestFile(logger_id: number) {
    const filenames = await this.getConfigFilesByLogger(logger_id);

    if (filenames.length === 0) return {};
    const jsonData = await fsPromises.readFile(configFilePath + filenames[0], "utf8");

    const objectData: LoggerConfigTableData = JSON.parse(jsonData);
    objectData.logger_id = logger_id;
    return objectData;
  }

  /**
   * Adds a new configuration file for a specific logger.
   * @param {LoggerConfigFileData} configFileData - The configuration data to be saved.
   * @returns {Promise<{ success: number | false; error?: string; configFileData?: LoggerConfigFileData }>} - The result of the operation.
   */
  async addNewConfig(configFileData: LoggerConfigFileData) {
    const logger_id: string = String(configFileData.logger_id);
    if (Number(logger_id) === -1) return;

    const loggerDir = "logger_" + (logger_id.length === 1 ? "0" + logger_id : logger_id);
    const directoryPath = configFilePath + loggerDir;
    const statusDirectoryPath = statusFilePath + loggerDir;

    const writeDate = new Date();
    const year = writeDate.getFullYear().toString();
    const month = (writeDate.getMonth() + 1).toString().padStart(2, "0");
    const day = writeDate.getDate().toString().padStart(2, "0");
    const hours = writeDate.getHours().toString().padStart(2, "0");
    const minutes = writeDate.getMinutes().toString().padStart(2, "0");

    const date = `${year}${month}${day}${hours}${minutes}`;
    const filename = loggerDir + "_config_" + date;
    const writeFilePath = directoryPath + "/" + filename + ".json";
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    if (!fs.existsSync(statusDirectoryPath)) {
      fs.mkdirSync(statusDirectoryPath, { recursive: true });
    }

    try {
      fsPromises.writeFile(writeFilePath, JSON.stringify(configFileData, null, 2), "utf8");
      return { success: 200, configFileData };
    } catch (error) {
      return { success: false, error: "Error writing file:" };
    }
  }
}
