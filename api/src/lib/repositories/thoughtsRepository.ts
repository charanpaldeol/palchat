import { query } from "../db.js";

export async function addThought(comment: string): Promise<void> {
  await query("INSERT INTO thoughts (comment) VALUES ($1)", [comment]);
}

export type ThoughtRow = {
  id: number;
  comment: string | null;
  created_at: string | Date | null;
};

export async function listThoughts(): Promise<ThoughtRow[]> {
  const result = await query(
    "SELECT id, comment, created_at FROM thoughts ORDER BY created_at DESC, id DESC",
  );
  return (result.rows as ThoughtRow[]) ?? [];
}
