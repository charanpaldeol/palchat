import { getSessionUser, getSessionCookieName } from "@/lib/auth";

export async function onRequest(context: import("astro").APIContext, next: () => Promise<Response>) {
  const sessionId = context.cookies.get(getSessionCookieName())?.value;
  context.locals.user = (await getSessionUser(sessionId)) ?? undefined;
  return next();
}
