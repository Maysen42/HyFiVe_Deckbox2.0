import { StatusFileService } from "../../../src/backend/services/file/StatusFileService";
import { NextApiRequest, NextApiResponse } from "next";

const fileService = new StatusFileService();

/**
 * Retrieves the list of status files.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<string[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
  const statusFileData = await fileService.getStatusFiles();
  res.status(200).json(statusFileData);
}
