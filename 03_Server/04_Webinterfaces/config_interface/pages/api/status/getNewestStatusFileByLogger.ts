import { StatusFileService } from "../../../src/backend/services/file/StatusFileService";
import { Status } from "../../../src/backend/types";
import { NextApiRequest, NextApiResponse } from "next";

const fileService = new StatusFileService();

/**
 * Handles the retrieval of the newest status file for a specific logger.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Status | {}>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<Status | {}>) {
  const logger_id = req.query.logger_id;
  const statusFileData = await fileService.getNewestStatusFileByLogger(Number(logger_id));
  res.status(200).json(statusFileData);
}
