/**
 * Returns true if the request's Origin or Referer is allowed (CSRF).
 * On Vercel, request.url may be the deployment host (*.vercel.app) while
 * the browser sends Origin: https://www.palchat.org, so we allow the Host
 * header origin and ALLOWED_ORIGINS in addition to request.url.origin.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const url = new URL(request.url);
  const host = request.headers.get("host") ?? url.host;

  const allowed = new Set<string>();
  allowed.add(url.origin);
  allowed.add(`https://${host}`);
  allowed.add(`http://${host}`);
  const normalized = (o: string) => o.replace(/\/$/, "");
  allowed.add(normalized(url.origin));
  allowed.add(normalized(`https://${host}`));
  allowed.add(normalized(`http://${host}`));

  const fromEnv = (import.meta.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);
  fromEnv.forEach((o) => {
    allowed.add(o);
    allowed.add(normalized(o));
  });

  const check = (o: string | null) => o && allowed.has(normalized(o));
  if (check(origin)) return true;
  let refererOrigin: string | null = null;
  try {
    if (referer) refererOrigin = new URL(referer).origin;
  } catch {
    /* */
  }
  return check(refererOrigin) ?? false;
}
