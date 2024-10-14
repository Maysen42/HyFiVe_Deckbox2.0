import type { NextApiRequest, NextApiResponse } from "next";

import { SensorTypeService } from "../../../src/backend/services/database/SensorTypeService";
import { SensorType } from "../../../src/backend/entities";

const sensorTypeService = new SensorTypeService();

/**
 * Handles the retrieval of all sensor types.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<SensorType[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<SensorType[]>) {
  const dpResponse = await sensorTypeService.getAll();
  res.status(200).json(dpResponse);
}
