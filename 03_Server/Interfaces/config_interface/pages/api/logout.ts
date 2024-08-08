import { NextApiRequest, NextApiResponse } from "next";
import { AUTH_COOKIE } from "../../src/backend/auth";

/**
 * Handles user logout by clearing the authentication cookie and redirecting to the login page.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(301); // Redirect
  res.setHeader("Set-Cookie", `${AUTH_COOKIE}=; Path=/; SameSite=Strict; HttpOnly; Max-Age=0;`);
  res.setHeader("Location", "/login");
  res.end();
}
