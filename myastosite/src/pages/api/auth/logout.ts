import type { APIRoute } from "astro";
import { deleteSession, getSessionCookieName } from "@/lib/auth";

export const POST: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get(getSessionCookieName())?.value;
  if (sessionId) {
    await deleteSession(sessionId);
  }
  cookies.delete(getSessionCookieName(), { path: "/" });
  return new Response(null, {
    status: 303,
    headers: { Location: "/" },
  });
};
