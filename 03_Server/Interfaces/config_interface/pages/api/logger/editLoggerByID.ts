import type { NextApiRequest, NextApiResponse } from "next";

import { EditLoggerByID, LoggerService } from "../../../src/backend/services/database/LoggerService";
import { DatabaseError, LoggerDBTableData } from "../../../src/backend/types";

const loggerService = new LoggerService();

/**
 * Handles the editing of logger data by logger ID.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<EditLoggerByID | DatabaseError>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<EditLoggerByID | DatabaseError>) {
  const logger_id = Number(req.query.logger_id);
  const data = JSON.parse(req.body) as LoggerDBTableData;

  try {
    const dpResponse = await loggerService.editLoggerByID(logger_id, data);
    res.status(200).json(dpResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
