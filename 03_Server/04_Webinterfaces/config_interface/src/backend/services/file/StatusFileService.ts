import fsPromises from "fs/promises";
import fs from "fs";
import { Status } from "../../types";
import { isNotJunk } from "junk";
import { getDateFromFileName } from "../../../frontend/utils";
import { buildStatusObj } from "../../../frontend/configBuildingUtils";

const statusFilePath = process.env.CONFIG_FILE_PATH + "" + process.env.STATUS_FILE_STRUCTURE;

/**
 * Service class for managing status files.
 */
export class StatusFileService {
  /**
   * Retrieves the content of a specific status file.
   * @param {string} path - The path of the status file.
   * @returns {Promise<Status>} - The content of the status file.
   */
  async getStatusFile(path: string) {
    const jsonData = await fsPromises.readFile(statusFilePath + path, "utf8");
    const objectData: Status = JSON.parse(jsonData);
    return objectData;
  }

  /**
   * Retrieves a list of available status files.
   * @returns {Promise<string[]>} - Array of status file names.
   */
  async getStatusFiles() {
    const dirName = fs.readdirSync(statusFilePath).filter(isNotJunk);
    const filenames: string[] = [];

    dirName.map((dir) => {
      const regex = `^${dir}+\/${dir}+_status_\\d+\.json$`;
      const files = fs.readdirSync(statusFilePath + dir);

      files.map((file) => {
        const filename = dir + "/" + file;
        if (filename.match(regex)) filenames.push(filename);
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
   * Retrieves the content of the newest status file.
   * @returns {Promise<Status>} - The content of the newest status file.
   */
  async getNewestStatusFile() {
    const filenames = await this.getStatusFiles();

    const filename = filenames.sort((a, b) => Number(a.split("-")[2]) - Number(b.split("-")[2]))[0];
    const path = statusFilePath + filename;

    const jsonData = await fsPromises.readFile(path, "utf8");
    const objectData = JSON.parse(jsonData);
    objectData.logger = filename;
    return objectData;
  }

  /**
   * Retrieves the names of all status files.
   * @returns {Promise<string[]>} - Array of status file names.
   */
  async getFileNames() {
    const dirName = fs.readdirSync(statusFilePath).filter(isNotJunk);
    const filenames: string[] = [];

    dirName.map((dir) => {
      const regex = `^${dir}+\/${dir}+_status_\\d+\.json$`;
      const files = fs.readdirSync(statusFilePath + dir);

      files.map((file) => {
        const filename = dir + "/" + file;
        if (filename.match(regex)) filenames.push(filename);
      });
    });
    return filenames;
  }

  /**
   * Retrieves the content of the newest status file associated with a specific logger.
   * @param {number} logger_id - The ID of the logger.
   * @returns {Promise<Status>} - The content of the newest status file.
   */
  async getNewestStatusFileByLogger(logger_id: number) {
    const filenames = await this.getFileNames();
    const loggerDirs = filenames.filter((filename) => Number(filename.split("_")[1].split("/")[0]) === logger_id);

    if (loggerDirs.length === 0) return {};
    const sortedFilenames = loggerDirs.sort((a, b) => {
      const aDate = getDateFromFileName(a);
      const bDate = getDateFromFileName(b);
      return bDate - aDate;
    });
    const loggerDir = sortedFilenames[0];

    const jsonData = await fsPromises.readFile(statusFilePath + loggerDir, "utf8");
    const objectData: Status = buildStatusObj(JSON.parse(jsonData), logger_id);
    return objectData;
  }

  /**
   * Retrieves the content of all status files as an array of Status objects.
   * @returns {Promise<Status[]>} - Array of Status objects.
   */
  async getPositionsFromStatusFiles() {
    const filenames = await this.getStatusFiles();
    const result: Status[] = [];
    await Promise.all(
      filenames.map(async (path) => {
        const data = await fsPromises.readFile(statusFilePath + path, "utf8");
        const status: Status = JSON.parse(data);
        const statusObj = buildStatusObj(status, Number(path.split("_")[1].split("/")[0]));
        result.push(statusObj);
      })
    ).then((res) => res);

    return result;
  }
}
