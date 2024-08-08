import type { NextApiRequest, NextApiResponse } from "next";
import { CalibrationCoefficient } from "../../../src/backend/entities";
import { CalibrationCoefficientService } from "../../../src/backend/services/database/CalibrationCoefficientService";

// Create an instance of CalibrationCoefficientService.
const calibrationCoefficientService: CalibrationCoefficientService = new CalibrationCoefficientService();

/**
 * Handles the retrieval of all calibration coefficients from the database.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<CalibrationCoefficient[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<CalibrationCoefficient[]>) {
  const dbResponse = await calibrationCoefficientService.selectAll();

  res.status(200).json(dbResponse);
}
