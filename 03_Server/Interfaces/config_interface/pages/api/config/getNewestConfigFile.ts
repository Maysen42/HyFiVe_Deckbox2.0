import { ConfigFileService } from "../../../src/backend/services/file/ConfigFileService";
import { NextApiRequest, NextApiResponse } from "next";
import { LoggerConfigTableData } from "../../../src/backend/types";

const fileService = new ConfigFileService();

/**
 * Handles the retrieval of the newest configuration file for a specific logger.
 * @param {NextApiRequest} req - The Next.js API request object containing the logger_id as a query parameter.
 * @param {NextApiResponse<LoggerConfigTableData>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoggerConfigTableData>) {
  const configFileData = await fileService.getConfigNewestFile(Number(req.query.logger_id));
  res.status(200).json(configFileData as LoggerConfigTableData);
}
