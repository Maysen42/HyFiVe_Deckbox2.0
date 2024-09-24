import type { NextApiRequest, NextApiResponse } from "next";
import { Vessel } from "../../../src/backend/entities";
import { VesselService } from "../../../src/backend/services/database/VesselService";

const vesselService: VesselService = new VesselService();

/**
 * Retrieves all vessels from the database.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Vessel[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<Vessel[]>) {
  const dpResponse = await vesselService.selectAll();
  res.status(200).json(dpResponse);
}
