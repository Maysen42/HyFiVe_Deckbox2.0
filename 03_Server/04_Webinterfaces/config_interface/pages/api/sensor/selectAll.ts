import type { NextApiRequest, NextApiResponse } from "next";

import { SensorService } from "../../../src/backend/services/database/SensorService";
import { Sensor } from "../../../src/backend/entities";

const sensorService = new SensorService();

/**
 * Handles the retrieval of all sensors.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Sensor[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Sensor[]>) {
  const dpResponse = await sensorService.getAll();
  res.status(200).json(dpResponse);
}
