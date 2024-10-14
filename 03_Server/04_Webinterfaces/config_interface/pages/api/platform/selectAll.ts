import type { NextApiRequest, NextApiResponse } from "next";
import { Platform } from "../../../src/backend/entities";
import { PlatformService } from "../../../src/backend/services/database/PlatformService";

const platformService: PlatformService = new PlatformService();

/**
 * Handles the retrieval of all platforms.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Platform[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<Platform[]>) {
  const dpResponse = await platformService.selectAll();
  res.status(200).json(dpResponse);
}
