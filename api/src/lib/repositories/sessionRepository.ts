import { query, withConnection } from "../db.js";
import type { PoolClient } from "pg";

export type SessionWithUser = {
  userId: number;
  username: string;
};

export async function createSessionRecord(
  userId: number,
  expiresAt: Date,
): Promise<string> {
  const result = await query(
    "INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id",
    [userId, expiresAt.toISOString()],
  );
  const row = result.rows[0] as { id: string } | undefined;
  if (!row?.id) {
    throw new Error("Failed to create session");
  }
  return row.id;
}

export async function getSessionUserRecord(
  sessionId: string,
): Promise<SessionWithUser | null> {
  const result = await query(
    `SELECT u.id AS user_id, u.username
     FROM users u
     INNER JOIN sessions s ON s.user_id = u.id
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId],
  );
  const row = result.rows[0] as
    | { user_id: number; username: string }
    | undefined;
  if (!row) return null;
  return { userId: row.user_id, username: row.username };
}

export async function deleteSessionRecord(sessionId: string): Promise<void> {
  await query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}

export async function deleteSessionsForUserRecord(
  userId: number,
): Promise<void> {
  await query("DELETE FROM sessions WHERE user_id = $1", [userId]);
}

export async function withSessionConnection<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return withConnection(fn);
}
