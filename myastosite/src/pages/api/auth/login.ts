import type { APIRoute } from "astro";
import {
  findUserByUsername,
  verifyPassword,
  createSession,
  sessionCookieOptions,
  getSessionCookieName,
} from "@/lib/auth";
import { isAllowedOrigin } from "@/lib/origin";

function wantsJsonResponse(request: Request): boolean {
  const accept = request.headers.get("Accept") ?? "";
  return accept.includes("application/json");
}

const jsonRedirect = (redirect: string, status: number) =>
  new Response(JSON.stringify({ redirect }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  const json = wantsJsonResponse(request);

  if (!isAllowedOrigin(request)) {
    return json
      ? jsonRedirect("/login?error=1", 403)
      : new Response(JSON.stringify({ error: "Invalid origin" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
  }

  const url = new URL(request.url);

  try {
    const form = await request.formData();
    const username = (form.get("username") ?? "").toString().trim();
    const password = (form.get("password") ?? "").toString();
    const redirectTo = (form.get("redirect") ?? url.searchParams.get("redirect") ?? "/my-account").toString().trim();

    if (!username || !password) {
      return json
        ? jsonRedirect("/login?error=missing", 200)
        : new Response(null, {
            status: 303,
            headers: { Location: "/login?error=missing" },
          });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return json
        ? jsonRedirect("/login?error=invalid", 200)
        : new Response(null, {
            status: 303,
            headers: { Location: "/login?error=invalid" },
          });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return json
        ? jsonRedirect("/login?error=invalid", 200)
        : new Response(null, {
            status: 303,
            headers: { Location: "/login?error=invalid" },
          });
    }

    const sessionId = await createSession(user.id);
    const opts = sessionCookieOptions(url.host);
    cookies.set(getSessionCookieName(), sessionId, opts);

    const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/my-account";

    return json
      ? jsonRedirect(safeRedirect, 200)
      : new Response(null, {
          status: 303,
          headers: { Location: safeRedirect },
        });
  } catch (err) {
    return json
      ? jsonRedirect("/login?error=1", 200)
      : new Response(null, {
          status: 303,
          headers: { Location: "/login?error=1" },
        });
  }
};
