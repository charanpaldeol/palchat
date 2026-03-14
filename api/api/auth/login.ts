import {
  findUserByUsername,
  verifyPassword,
  createSession,
  sessionCookieOptions,
  getSessionCookieName,
} from "../../src/lib/auth.js";
import { parseCookies, sessionCookieHeader, isAllowedOrigin } from "../../src/lib/helpers.js";

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (!isAllowedOrigin(request, url)) {
    return new Response(JSON.stringify({ error: "Invalid origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const form = await request.formData();
    const username = (form.get("username") ?? "").toString().trim();
    const password = (form.get("password") ?? "").toString();

    if (!username || !password) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login?error=missing" },
      });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login?error=invalid" },
      });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login?error=invalid" },
      });
    }

    const sessionId = await createSession(user.id);
    const opts = sessionCookieOptions(url.host);
    const setCookie = sessionCookieHeader(getSessionCookieName(), sessionId, opts);

    const redirectTo = url.searchParams.get("redirect") || "/my-account";
    const safeRedirect =
      redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/my-account";

    return new Response(null, {
      status: 303,
      headers: { Location: safeRedirect, "Set-Cookie": setCookie },
    });
  } catch {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login?error=1" },
    });
  }
}
