import { query } from "../src/lib/db.js";

export async function GET(): Promise<Response> {
  try {
    const result = await query("select now() as now");
    const now = result.rows[0]?.now ?? null;
    return new Response(
      JSON.stringify({ ok: true, now }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
