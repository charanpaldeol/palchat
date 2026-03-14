import { deleteSession, getSessionCookieName } from "../../src/lib/auth.js";
import { parseCookies } from "../../src/lib/helpers.js";

/** Clear session cookie (value empty, max-age 0). */
function clearCookieHeader(name: string): string {
  return `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=lax`;
}

export async function POST(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = parseCookies(cookieHeader);
  const sessionId = cookies[getSessionCookieName()];
  if (sessionId) {
    await deleteSession(sessionId);
  }
  const setCookie = clearCookieHeader(getSessionCookieName());
  return new Response(null, {
    status: 303,
    headers: { Location: "/", "Set-Cookie": setCookie },
  });
}
