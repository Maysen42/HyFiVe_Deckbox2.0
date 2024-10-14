import type { NextApiRequest, NextApiResponse } from "next";

import { InsertNewSensor, SensorService } from "../../../src/backend/services/database/SensorService";
import { DatabaseError, SensorDBTableData } from "../../../src/backend/types";

const sensorService = new SensorService();

/**
 * Handles the insertion of a new sensor.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<InsertNewSensor | DatabaseError>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<InsertNewSensor | DatabaseError>) {
  const data = JSON.parse(req.body) as SensorDBTableData;

  try {
    const dpResponse = await sensorService.insertNewSensor(data);
    res.status(200).json(dpResponse);
  } catch (error) {
    console.error("Error here:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
