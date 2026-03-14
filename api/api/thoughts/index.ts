import { listThoughts } from "../../src/lib/repositories/thoughtsRepository.js";

export async function GET(): Promise<Response> {
  try {
    const rows = await listThoughts();
    const json = rows.map((r) => ({
      id: r.id,
      comment: r.comment,
      created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
    }));
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
