import bcrypt from "bcrypt";
import { createUserRecord, deleteUserRecord, getUserByUsername } from "./repositories/userRepository.js";
import {
  createSessionRecord,
  deleteSessionRecord,
  deleteSessionsForUserRecord,
  getSessionUserRecord,
} from "./repositories/sessionRepository.js";

const SALT_ROUNDS = 10;
const SESSION_COOKIE = "sid";
const SESSION_DAYS = 7;

export type User = { id: number; username: string };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  return createSessionRecord(userId, expiresAt);
}

export async function getSessionUser(sessionId: string | undefined): Promise<User | null> {
  if (!sessionId) return null;
  const sessionUser = await getSessionUserRecord(sessionId);
  if (!sessionUser) return null;
  return { id: sessionUser.userId, username: sessionUser.username };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await deleteSessionRecord(sessionId);
}

export async function deleteSessionsForUser(userId: number): Promise<void> {
  await deleteSessionsForUserRecord(userId);
}

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

export async function findUserByUsername(username: string): Promise<{ id: number; username: string; password_hash: string } | null> {
  return getUserByUsername(username);
}

export async function createUser(username: string, passwordHash: string): Promise<User> {
  const user = await createUserRecord(username, passwordHash);
  return { id: user.id, username: user.username };
}

export async function deleteUser(userId: number): Promise<void> {
  await deleteUserRecord(userId);
}
