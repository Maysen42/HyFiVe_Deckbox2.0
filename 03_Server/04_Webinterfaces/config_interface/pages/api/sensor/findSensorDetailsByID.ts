import type { NextApiRequest, NextApiResponse } from "next";

import { SensorDetails, SensorService } from "../../../src/backend/services/database/SensorService";

const sensorService = new SensorService();

/**
 * Handles the retrieval of detailed sensor information by its ID.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<SensorDetails>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<SensorDetails>) {
  const dpResponse = await sensorService.findSensorDetailsByID(Number(req.query.sensor_id));
  res.status(200).json(dpResponse);
}
