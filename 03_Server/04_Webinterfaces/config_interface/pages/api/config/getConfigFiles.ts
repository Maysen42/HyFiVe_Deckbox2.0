import { ConfigFileService } from "../../../src/backend/services/file/ConfigFileService";
import { NextApiRequest, NextApiResponse } from "next";

const fileService = new ConfigFileService();

/**
 * Handles the retrieval of all configuration files.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<any>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const configFileData = await fileService.getConfigFiles();
  res.status(200).json(configFileData);
}
