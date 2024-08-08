import type { NextApiRequest, NextApiResponse } from "next";

import { CombinedDeckboxData, DeckboxService } from "../../../src/backend/services/database/DeckboxService";

const deckboxService = new DeckboxService();

/**
 * Handles the retrieval of combined deckbox data from the database.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<CombinedDeckboxData[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<CombinedDeckboxData[]>) {
  const dpResponse = await deckboxService.getCombindedDeckboxData();
  res.status(200).json(dpResponse);
}
