import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

function countWords(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const redirectParam = url.searchParams.get('redirect') || '/add-comment';
  const redirectBase = redirectParam.startsWith('/') ? redirectParam : '/add-comment';

  try {
    const form = await request.formData();
    const rawComment = form.get('comment');
    const comment = (typeof rawComment === 'string' ? rawComment : String(rawComment ?? '')).trim();

    const words = countWords(comment);
    if (!comment || words === 0 || words > 50) {
      // Invalid input – redirect back to the originating page with an error flag.
      return new Response(null, {
        status: 303,
        headers: {
          Location: `${redirectBase}?error=1`,
        },
      });
    }

    await query('INSERT INTO comments (comment) VALUES ($1)', [comment]);

    return new Response(null, {
      status: 303,
      headers: {
        Location: `${redirectBase}?success=1`,
      },
    });
  } catch (error) {
    // On unexpected errors, send the user back to the originating page.
    return new Response(null, {
      status: 303,
      headers: {
        Location: `${redirectBase}?error=1`,
      },
    });
  }
};


