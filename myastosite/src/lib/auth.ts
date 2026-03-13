import bcrypt from "bcrypt";
import { query } from "./db";
import { createUserRecord, deleteUserRecord, getUserByUsername } from "./repositories/userRepository";
import {
  createSessionRecord,
  deleteSessionRecord,
  deleteSessionsForUserRecord,
  getSessionUserRecord,
} from "./repositories/sessionRepository";

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
  return createSessionRecord(userId, expiresAt);
}

/** Get user from session id if valid and not expired. */
export async function getSessionUser(sessionId: string | undefined): Promise<User | null> {
  if (!sessionId) return null;
  const sessionUser = await getSessionUserRecord(sessionId);
  if (!sessionUser) return null;
  return { id: sessionUser.userId, username: sessionUser.username };
}

/** Delete a session by id. */
export async function deleteSession(sessionId: string): Promise<void> {
  await deleteSessionRecord(sessionId);
}

/** Delete all sessions for a user (e.g. on password change). */
export async function deleteSessionsForUser(userId: number): Promise<void> {
  await deleteSessionsForUserRecord(userId);
}

/** Cookie options for session cookie. */
export function sessionCookieOptions(host: string): { path: string; httpOnly: boolean; secure: boolean; sameSite: "lax" | "strict"; maxAge: number } {
  const isProd = host.includes("reclaim.org") || host.includes("palchat.org") || host.includes("vercel.app");
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
  return getUserByUsername(username);
}

/** Create user; returns new user or throws (e.g. duplicate username). */
export async function createUser(username: string, passwordHash: string): Promise<User> {
  const user = await createUserRecord(username, passwordHash);
  return { id: user.id, username: user.username };
}

/** Permanently delete a user and all their sessions (sessions CASCADE on user delete). */
export async function deleteUser(userId: number): Promise<void> {
  await deleteUserRecord(userId);
}
