import type { APIRoute } from 'astro';
import { addThought } from '@/lib/repositories/thoughtsRepository';
import { isAllowedOrigin } from '@/lib/origin';

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

/** When true, return 200 + JSON with redirect URL instead of 303 (so fetch can read it). */
function wantsJsonResponse(request: Request): boolean {
  const accept = request.headers.get('Accept') ?? '';
  return accept.includes('application/json');
}

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const redirectBase = getAllowedRedirect(url.searchParams.get('redirect'));
  const json = wantsJsonResponse(request);

  const jsonResponse = (redirect: string, status: number) =>
    new Response(JSON.stringify({ redirect }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  if (!isAllowedOrigin(request)) {
    return json
      ? jsonResponse(`${redirectBase}?error=1`, 403)
      : new Response(JSON.stringify({ error: 'Invalid origin' }), {
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
      return json
        ? jsonResponse(`${redirectBase}?error=1`, 200)
        : new Response(null, {
            status: 303,
            headers: { Location: `${redirectBase}?error=1` },
          });
    }

    await addThought(comment);

    return json
      ? jsonResponse(`${redirectBase}?success=1`, 200)
      : new Response(null, {
          status: 303,
          headers: { Location: `${redirectBase}?success=1` },
        });
  } catch (error) {
    return json
      ? jsonResponse(`${redirectBase}?error=1`, 200)
      : new Response(null, {
          status: 303,
          headers: { Location: `${redirectBase}?error=1` },
        });
  }
};
