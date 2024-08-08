import type { NextApiRequest, NextApiResponse } from "next";
import { Contact } from "../../../src/backend/entities";
import { ContactService } from "../../../src/backend/services/database/ContactService";

const contactService: ContactService = new ContactService();

/**
 * Handles the retrieval of all contacts from the database.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse<Contact[]>} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Contact[]>) {
  const dpResponse = await contactService.selectAll();
  res.status(200).json(dpResponse);
}
