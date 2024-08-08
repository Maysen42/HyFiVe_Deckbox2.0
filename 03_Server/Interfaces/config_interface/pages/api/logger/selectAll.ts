import type { NextApiRequest, NextApiResponse } from "next";

import { LoggerService } from "../../../src/backend/services/database/LoggerService";
import { Logger } from "../../../src/backend/entities";

const loggerService = new LoggerService();

/**
 * Handles the retrieval of all loggers.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Logger[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<Logger[]>) {
  const dpResponse = await loggerService.getAll();
  res.status(200).json(dpResponse);
}
