import { ConfigFileService } from "../../../src/backend/services/file/ConfigFileService";
import { NextApiRequest, NextApiResponse } from "next";

const fileService = new ConfigFileService();

/**
 * Handles the retrieval of a specific configuration file.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<any>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const path = req.query.path;
  const configFileData = await fileService.getConfigFile(String(path));
  res.status(200).json(configFileData);
}
