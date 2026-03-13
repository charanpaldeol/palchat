import type { APIRoute } from "astro";
import {
  getSessionUser,
  getSessionCookieName,
  deleteUser,
} from "@/lib/auth";

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const sessionId = cookies.get(getSessionCookieName())?.value;
  const user = sessionId ? await getSessionUser(sessionId) : null;

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
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
    await deleteUser(user.id);
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to delete account" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.delete(getSessionCookieName(), { path: "/" });
  return new Response(null, {
    status: 303,
    headers: { Location: "/" },
  });
};
