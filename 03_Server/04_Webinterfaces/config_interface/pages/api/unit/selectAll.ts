import type { NextApiRequest, NextApiResponse } from "next";

import { UnitService } from "../../../src/backend/services/database/UnitService";
import { Unit } from "../../../src/backend/entities";

const unitService = new UnitService();

/**
 * Retrieves all units from the database.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Unit[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<Unit[]>) {
  const dpResponse = await unitService.getAll();
  res.status(200).json(dpResponse);
}
