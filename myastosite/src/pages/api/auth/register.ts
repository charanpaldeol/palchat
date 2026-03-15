import type { APIRoute } from "astro";
import {
  hashPassword,
  createUser,
  findUserByUsername,
  createSession,
  sessionCookieOptions,
  getSessionCookieName,
} from "@/lib/auth";
import { isAllowedOrigin } from "@/lib/origin";

function isValidUsername(username: string): boolean {
  const trimmed = username.trim();
  if (trimmed.length < 2 || trimmed.length > 64) return false;
  return /^[a-zA-Z0-9_]+$/.test(trimmed);
}

function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAllowedOrigin(request)) {
    return new Response(JSON.stringify({ error: "Invalid origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const form = await request.formData();
    const username = (form.get("username") ?? "").toString().trim();
    const password = (form.get("password") ?? "").toString();

    if (!isValidUsername(username)) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/signup?error=username" },
      });
    }
    if (!isValidPassword(password)) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/signup?error=password" },
      });
    }

    const existing = await findUserByUsername(username);
    if (existing) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/signup?error=exists" },
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(username, passwordHash);
    const sessionId = await createSession(user.id);
    const opts = sessionCookieOptions(url.host);
    cookies.set(getSessionCookieName(), sessionId, opts);

    return new Response(null, {
      status: 303,
      headers: { Location: "/my-account" },
    });
  } catch (err) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/signup?error=1" },
    });
  }
};
