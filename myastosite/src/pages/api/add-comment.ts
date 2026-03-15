import type { APIRoute } from 'astro';
import { addThought } from '@/lib/repositories/thoughtsRepository';

const ALLOWED_REDIRECT_PATHS = ['/comments'] as const;

function countWords(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function getAllowedRedirect(redirectParam: string | null): string {
  if (!redirectParam || typeof redirectParam !== 'string') return '/comments';
  const path = redirectParam.split('?')[0].trim();
  return ALLOWED_REDIRECT_PATHS.includes(path as (typeof ALLOWED_REDIRECT_PATHS)[number])
    ? path
    : '/comments';
}

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const redirectBase = getAllowedRedirect(url.searchParams.get('redirect'));

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const siteOrigin = url.origin;
  const allowedOrigin = (o: string | null) =>
    o && (o === siteOrigin || o.replace(/\/$/, '') === siteOrigin.replace(/\/$/, ''));
  let refererOrigin: string | null = null;
  try {
    if (referer) refererOrigin = new URL(referer).origin;
  } catch {
    /* invalid referer */
  }
  if (!allowedOrigin(origin) && !allowedOrigin(refererOrigin)) {
    return new Response(JSON.stringify({ error: 'Invalid origin' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const form = await request.formData();
    const rawComment = form.get('comment');
    const comment = (typeof rawComment === 'string' ? rawComment : String(rawComment ?? '')).trim();

    const words = countWords(comment);
    if (!comment || words === 0 || words > 200) {
      return new Response(null, {
        status: 303,
        headers: { Location: `${redirectBase}?error=1` },
      });
    }

    await addThought(comment);

    return new Response(null, {
      status: 303,
      headers: { Location: `${redirectBase}?success=1` },
    });
  } catch (error) {
    return new Response(null, {
      status: 303,
      headers: { Location: `${redirectBase}?error=1` },
    });
  }
};
