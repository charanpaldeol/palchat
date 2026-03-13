import bcrypt from "bcrypt";
import { query } from "./db";

const SALT_ROUNDS = 10;
const SESSION_COOKIE = "sid";
const SESSION_DAYS = 7;

export type User = { id: number; username: string };

/** Hash a plain password. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Verify password against hash. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a session for user and return session id. */
export async function createSession(userId: number): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  const result = await query(
    "INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id",
    [userId, expiresAt.toISOString()]
  );
  const row = result.rows[0];
  if (!row?.id) throw new Error("Failed to create session");
  return row.id;
}

/** Get user from session id if valid and not expired. */
export async function getSessionUser(sessionId: string | undefined): Promise<User | null> {
  if (!sessionId) return null;
  const result = await query(
    `SELECT u.id, u.username FROM users u
     INNER JOIN sessions s ON s.user_id = u.id
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return { id: row.id, username: row.username };
}

/** Delete a session by id. */
export async function deleteSession(sessionId: string): Promise<void> {
  await query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}

/** Delete all sessions for a user (e.g. on password change). */
export async function deleteSessionsForUser(userId: number): Promise<void> {
  await query("DELETE FROM sessions WHERE user_id = $1", [userId]);
}

/** Cookie options for session cookie. */
export function sessionCookieOptions(host: string): { path: string; httpOnly: boolean; secure: boolean; sameSite: "lax" | "strict"; maxAge: number } {
  const isProd = host.includes("palchat.org") || host.includes("vercel.app");
  return {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

/** Find user by username. */
export async function findUserByUsername(username: string): Promise<{ id: number; username: string; password_hash: string } | null> {
  const result = await query("SELECT id, username, password_hash FROM users WHERE username = $1", [username]);
  return result.rows[0] ?? null;
}

/** Create user; returns new user or throws (e.g. duplicate username). */
export async function createUser(username: string, passwordHash: string): Promise<User> {
  const result = await query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
    [username, passwordHash]
  );
  const row = result.rows[0];
  if (!row) throw new Error("Failed to create user");
  return { id: row.id, username: row.username };
}
