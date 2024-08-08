import type { NextApiRequest, NextApiResponse } from "next";

import { SensorDetails, SensorService } from "../../../src/backend/services/database/SensorService";
import { DatabaseError, SensorDBTableData } from "../../../src/backend/types";

const sensorService = new SensorService();

/**
 * Handles the editing of a sensor by its ID.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<SensorDetails | DatabaseError>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<SensorDetails | DatabaseError>) {
  const sensor_id = Number(req.query.sensor_id);
  const data = JSON.parse(req.body) as SensorDBTableData;

  try {
    const dpResponse = await sensorService.editSensorByID(sensor_id, data);
    res.status(200).json(dpResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
