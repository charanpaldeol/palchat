import { getApiUrl } from "@/lib/api";

const SESSION_COOKIE_NAME = "sid";

export async function onRequest(context: import("astro").APIContext, next: () => Promise<Response>) {
  const apiUrl = getApiUrl();
  const sessionId = context.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!apiUrl || !sessionId) {
    context.locals.user = undefined;
    return next();
  }

  try {
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${sessionId}` },
    });
    if (res.ok) {
      const data = await res.json();
      context.locals.user = data.user;
    } else {
      context.locals.user = undefined;
    }
  } catch {
    context.locals.user = undefined;
  }
  return next();
}
