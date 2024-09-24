import { StatusFileService } from "../../../src/backend/services/file/StatusFileService";
import { Status } from "@../../../src/backend/types";
import { NextApiRequest, NextApiResponse } from "next";

const fileService = new StatusFileService();

/**
 * Retrieves the status file based on the provided path.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Status>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<Status>) {
  const path = req.query.path;
  const statusFileData = await fileService.getStatusFile(String(path));
  res.status(200).json(statusFileData);
}
