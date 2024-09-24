import { CalibrationCoefficientService } from "../../../src/backend/services/database/CalibrationCoefficientService";
import { NextApiRequest, NextApiResponse } from "next";
import { ServiceError } from "../../../src/backend/types";
import { CalibrationCoefficient } from "../../../src/backend/entities";

const fileService = new CalibrationCoefficientService();

/**
 * Handles the insertion of new calibration coefficients into the database.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<CalibrationCoefficient[] | ServiceError>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalibrationCoefficient[] | ServiceError>
): Promise<void> {
  // Parse the request body, assuming it contains JSON data representing CalibrationCoefficient objects.
  const data = JSON.parse(req.body) as CalibrationCoefficient[];

  try {
    const dbResponse = await fileService.insertNewCalibrationCoefficien(data);

    res.status(200).json(dbResponse);
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}
