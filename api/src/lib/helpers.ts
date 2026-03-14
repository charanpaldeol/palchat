/** Parse Cookie header into a record. */
export function parseCookies(cookieHeader: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const [key, ...v] = part.trim().split("=");
    if (key) out[key] = decodeURIComponent(v.join("=").trim());
  }
  return out;
}

/** Build Set-Cookie value for session. */
export function sessionCookieHeader(
  name: string,
  value: string,
  opts: { path: string; httpOnly: boolean; secure: boolean; sameSite: "lax" | "strict"; maxAge: number },
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${opts.path}`,
    `Max-Age=${opts.maxAge}`,
    `SameSite=${opts.sameSite}`,
  ];
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

/** Check Origin/Referer against allowed list (env ALLOWED_ORIGINS). */
export function isAllowedOrigin(request: Request, requestUrl: URL): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowed = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const siteOrigin = requestUrl.origin;
  const normalized = siteOrigin.replace(/\/$/, "");
  const allowedSet = new Set([...allowed, siteOrigin, normalized]);
  const check = (o: string | null): boolean =>
    !!(o && allowedSet.has(o.replace(/\/$/, "")));
  if (check(origin)) return true;
  let refererOrigin: string | null = null;
  try {
    if (referer) refererOrigin = new URL(referer).origin;
  } catch {
    /* */
  }
  return check(refererOrigin);
}
