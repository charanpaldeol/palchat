/**
 * Dynamic sitemap for crawlers. Only includes public, indexable routes.
 * Excludes login, signup, and my-account (noindex in Layout).
 */
export const prerender = true;

const SITE = import.meta.env.SITE ?? 'https://www.reclaim.org';
const base = SITE.endsWith('/') ? SITE.slice(0, -1) : SITE;

const publicRoutes: { path: string; changefreq?: string; priority?: string }[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.9' },
  { path: '/tech-stack', changefreq: 'monthly', priority: '0.8' },
  { path: '/comments', changefreq: 'weekly', priority: '0.8' },
  { path: '/millet-guide', changefreq: 'monthly', priority: '0.8' },
];

export async function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = publicRoutes
    .map(
      (r) =>
        `  <url>\n    <loc>${base}${r.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq ?? 'monthly'}</changefreq>\n    <priority>${r.priority ?? '0.5'}</priority>\n  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
