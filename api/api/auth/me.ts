import { getSessionUser, getSessionCookieName } from "../../src/lib/auth.js";
import { parseCookies } from "../../src/lib/helpers.js";

export async function GET(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = parseCookies(cookieHeader);
  const sessionId = cookies[getSessionCookieName()];
  const user = await getSessionUser(sessionId);

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ user: { id: user.id, username: user.username } }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
