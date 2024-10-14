import type { NextApiRequest, NextApiResponse } from "next";

import { LoggerService } from "../../../src/backend/services/database/LoggerService";
import { LoggerDBTableData } from "../../../src/backend/types";

const loggerService = new LoggerService();

/**
 * Handles the retrieval of logger data by logger ID.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<LoggerDBTableData>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoggerDBTableData>) {
  const dpResponse = await loggerService.findByID(Number(req.query.logger_id));
  res.status(200).json(dpResponse);
}
