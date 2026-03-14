import { getBlogPostBySlug } from "../../src/lib/repositories/blogRepository.js";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 1];
  if (!slug) {
    return new Response(null, { status: 404 });
  }
  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return new Response(null, { status: 404 });
    }
    const json = {
      id: post.id,
      author_user_id: post.author_user_id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      content_html: post.content_html,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at?.toISOString() ?? null,
    };
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(null, { status: 500 });
  }
}
