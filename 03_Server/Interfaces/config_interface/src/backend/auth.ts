import { SignJWT, jwtVerify } from "jose";
import { JwtPayload } from "jsonwebtoken";
import { env } from "process";

/**
 * Interface for the payload of the JWT token.
 */
interface TokenPayload {
  username: string;
  access: string;
}

export const AUTH_COOKIE = "auth";
export const SESSION_DURATION = 86400 * Number(env.EXPARATION_DAY_COUNT); //Duration of the session in seconds.
export const secret = env.JWT_SECRET!; //Secret key for signing and verifying JWT tokens.

// Array of user objects with username, password, and access level.
export const users = [
  {
    username: env.NORMAL_USER_NAME!,
    password: env.NORMAL_USER_PASSWORD!,
    access: "readonly",
  },
  {
    username: env.EXPERT_USER_NAME!,
    password: env.EXPERT_USER_PASSWORD!,
    access: "write",
  },
];

/**
 * Checks user credentials against the predefined list of users.
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @returns {Object | undefined} - User object if credentials are valid, undefined otherwise.
 */
export function checkUserCredentials(username: string, password: string) {
  return users.find((u) => u.username === username && u.password === password);
}

/**
 * Signs a JSON Web Token (JWT) with the given username and access level.
 * @param {string} username - User's username.
 * @param {string} access - User's access level.
 * @returns {string} - Signed JWT token.
 */
export function signJsonWebToken(username: string, access: string) {
  const payload: TokenPayload = { username, access };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_DURATION;

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

/**
 * Verifies a JSON Web Token (JWT) and returns the payload if successful.
 * @param {string} token - JWT token to verify.
 * @returns {Promise<JwtPayload & TokenPayload>} - Promise resolving to the verified payload.
 */
export async function verifyJsonWebToken(token: string): Promise<JwtPayload & TokenPayload> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

  return payload as JwtPayload & TokenPayload;
}
