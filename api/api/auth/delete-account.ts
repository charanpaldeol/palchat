import {
  getSessionUser,
  getSessionCookieName,
  deleteUser,
} from "../../src/lib/auth.js";
import { parseCookies, isAllowedOrigin } from "../../src/lib/helpers.js";

function clearCookieHeader(name: string): string {
  return `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=lax`;
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = parseCookies(cookieHeader);
  const sessionId = cookies[getSessionCookieName()];
  const user = sessionId ? await getSessionUser(sessionId) : null;

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isAllowedOrigin(request, url)) {
    return new Response(JSON.stringify({ error: "Invalid origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await deleteUser(user.id);
  } catch {
    return new Response(JSON.stringify({ error: "Failed to delete account" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const setCookie = clearCookieHeader(getSessionCookieName());
  return new Response(null, {
    status: 303,
    headers: { Location: "/", "Set-Cookie": setCookie },
  });
}
