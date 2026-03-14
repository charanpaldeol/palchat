import { listBlogPosts } from "../../src/lib/repositories/blogRepository.js";

export async function GET(): Promise<Response> {
  try {
    const posts = await listBlogPosts();
    const json = posts.map((p) => ({
      id: p.id,
      author_user_id: p.author_user_id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      content_html: p.content_html,
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at?.toISOString() ?? null,
    }));
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
