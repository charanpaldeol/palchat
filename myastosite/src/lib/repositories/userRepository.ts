import { query } from "../db";

export type DbUser = {
  id: number;
  username: string;
  password_hash: string;
};

export async function getUserByUsername(
  username: string,
): Promise<DbUser | null> {
  const result = await query(
    "SELECT id, username, password_hash FROM users WHERE username = $1",
    [username],
  );
  return (result.rows[0] as DbUser | undefined) ?? null;
}

export async function createUserRecord(
  username: string,
  passwordHash: string,
): Promise<Pick<DbUser, "id" | "username">> {
  const result = await query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
    [username, passwordHash],
  );
  const row = result.rows[0] as DbUser | undefined;
  if (!row) {
    throw new Error("Failed to create user");
  }
  return { id: row.id, username: row.username };
}

export async function deleteUserRecord(userId: number): Promise<void> {
  await query("DELETE FROM users WHERE id = $1", [userId]);
}

