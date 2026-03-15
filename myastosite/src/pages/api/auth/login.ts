import type { APIRoute } from "astro";
import {
  findUserByUsername,
  verifyPassword,
  createSession,
  sessionCookieOptions,
  getSessionCookieName,
} from "@/lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const url = new URL(request.url);
  const siteOrigin = url.origin;
  const allowed = (o: string | null) =>
    o && (o === siteOrigin || o.replace(/\/$/, "") === siteOrigin.replace(/\/$/, ""));
  let refererOrigin: string | null = null;
  try {
    if (referer) refererOrigin = new URL(referer).origin;
  } catch {
    /* */
  }
  if (!allowed(origin) && !allowed(refererOrigin)) {
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
    cookies.set(getSessionCookieName(), sessionId, opts);

    const redirectTo = url.searchParams.get("redirect") || "/my-account";
    const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/my-account";

    return new Response(null, {
      status: 303,
      headers: { Location: safeRedirect },
    });
  } catch (err) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login?error=1" },
    });
  }
};
