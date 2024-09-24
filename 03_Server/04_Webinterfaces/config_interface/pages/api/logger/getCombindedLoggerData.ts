// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { CombinedLoggerData, LoggerService } from "../../../src/backend/services/database/LoggerService";

const loggerService = new LoggerService();

/**
 * Handles the retrieval of combined logger data.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<CombinedLoggerData[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<CombinedLoggerData[]>) {
  const dpResponse = await loggerService.getCombindedLoggerData();
  res.status(200).json(dpResponse);
}
