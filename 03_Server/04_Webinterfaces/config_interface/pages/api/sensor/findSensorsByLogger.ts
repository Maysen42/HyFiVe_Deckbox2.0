import type { NextApiRequest, NextApiResponse } from "next";

import { SensorByLogger, SensorService } from "../../../src/backend/services/database/SensorService";

const sensorService = new SensorService();

/**
 * Handles the retrieval of sensors belonging to a specific logger.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<SensorByLogger[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<SensorByLogger[]>) {
  const dpResponse = await sensorService.findSensorsByLogger(Number(req.query.logger_id));
  res.status(200).json(dpResponse);
}
