import { NextApiRequest, NextApiResponse } from "next";
import { AUTH_COOKIE, SESSION_DURATION, checkUserCredentials, signJsonWebToken } from "../../src/backend/auth";

/**
 * Handles user authentication using POST method. It checks the provided credentials,
 * generates a JSON Web Token (JWT) if credentials are valid, and sets it as a cookie
 * for user authentication.
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves once the handling is complete.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    res.status(400); // Bad Request
    res.end();
    return;
  }

  const { username, password } = req.body;

  // Check user credentials
  const user = checkUserCredentials(username, password);
  if (!user) {
    res.status(401); // Unauthorized
    res.end();
    return;
  }

  // Sign JWT and set it as a cookie
  const jwt = await signJsonWebToken(user.username, user.access);
  res.setHeader("Set-Cookie", `${AUTH_COOKIE}=${jwt}; Path=/; SameSite=Strict; HttpOnly; Max-Age=${SESSION_DURATION};`);
  res.setHeader("Location", "/");
  res.status(301); // Redirect
  res.end();
}
