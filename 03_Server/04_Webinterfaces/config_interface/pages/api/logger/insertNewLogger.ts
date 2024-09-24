import type { NextApiRequest, NextApiResponse } from "next";

import { InsertNewLogger, LoggerService } from "../../../src/backend/services/database/LoggerService";
import { ServiceError, LoggerDBTableData } from "../../../src/backend/types";

const loggerService = new LoggerService();

/**
 * Handles the insertion of a new logger.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<InsertNewLogger | ServiceError>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<InsertNewLogger | ServiceError>) {
  const data = JSON.parse(req.body) as LoggerDBTableData;

  try {
    const dpResponse = await loggerService.insertNewLogger(data);
    res.status(200).json(dpResponse);
  } catch (error) {
    console.error("Error here:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
