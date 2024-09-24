import { ConfigFileService } from "../../../src/backend/services/file/ConfigFileService";
import { NextApiRequest, NextApiResponse } from "next";
import { LoggerConfigFileData, ServiceError } from "../../../src/backend/types";

const fileService = new ConfigFileService();

/**
 * Handles the addition of a new configuration file.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<LoggerConfigFileData | ServiceError>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<LoggerConfigFileData | ServiceError>) {
  const data = JSON.parse(req.body) as LoggerConfigFileData;

  try {
    const fileResponse = await fileService.addNewConfig(data);
    res.status(200).json(fileResponse.configFileData);
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}
