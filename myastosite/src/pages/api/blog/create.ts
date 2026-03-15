import type { APIRoute } from "astro";
import {
  getSessionCookieName,
  getSessionUser,
} from "@/lib/auth";
import { createBlogPost } from "@/lib/repositories/blogRepository";
import { isAllowedOrigin } from "@/lib/origin";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionId = cookies.get(getSessionCookieName())?.value;
  const user = await getSessionUser(sessionId);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isAllowedOrigin(request)) {
    return new Response(JSON.stringify({ error: "Invalid origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rawTitle = (body as Record<string, unknown>).title ?? "";
    const rawDescription = (body as Record<string, unknown>).description ?? "";
    const rawContentHtml = (body as Record<string, unknown>).contentHtml ?? "";

    const title = String(rawTitle).trim();
    const description = String(rawDescription).trim();
    const contentHtml = String(rawContentHtml).trim();

    if (!title || !description || !contentHtml) {
      return new Response(
        JSON.stringify({ error: "Title, description, and content are required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (title.length > 200) {
      return new Response(
        JSON.stringify({ error: "Title is too long (max 200 characters)." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (description.length > 400) {
      return new Response(
        JSON.stringify({ error: "Description is too long (max 400 characters)." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (contentHtml.length > 20000) {
      return new Response(
        JSON.stringify({ error: "Content is too long (max ~20k characters)." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const baseSlug = slugify(title) || "post";
    const uniqueSuffix = Math.random().toString(36).slice(2, 8);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const post = await createBlogPost({
      authorUserId: user.id,
      slug,
      title,
      description,
      contentHtml,
    });

    return new Response(
      JSON.stringify({
        id: post.id,
        slug: post.slug,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create post. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
