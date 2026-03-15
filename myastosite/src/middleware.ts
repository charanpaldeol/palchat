import { getApiUrl } from "@/lib/api";
import { getSessionUser, getSessionCookieName } from "@/lib/auth";

export async function onRequest(context: import("astro").APIContext, next: () => Promise<Response>) {
  const apiUrl = getApiUrl();
  const sessionId = context.cookies.get(getSessionCookieName())?.value;

  if (apiUrl && sessionId) {
    try {
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        headers: { cookie: `${getSessionCookieName()}=${sessionId}` },
      });
      if (res.ok) {
        const data = await res.json();
        context.locals.user = data.user;
        return next();
      }
    } catch {
      /* fall through to local */
    }
  }

  if (sessionId) {
    try {
      context.locals.user = (await getSessionUser(sessionId)) ?? undefined;
    } catch {
      context.locals.user = undefined;
    }
  } else {
    context.locals.user = undefined;
  }
  return next();
}
