import { query } from "../db";

export async function addThought(comment: string): Promise<void> {
  await query("INSERT INTO thoughts (comment) VALUES ($1)", [comment]);
}

