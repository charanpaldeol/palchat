import { query } from "../db";

export type DbBlogPost = {
  id: number;
  author_user_id: number;
  slug: string;
  title: string;
  description: string;
  content_html: string;
  created_at: Date;
  updated_at: Date | null;
};

type DbBlogRow = {
  id: number;
  author_user_id: number;
  slug: string;
  title: string;
  description: string;
  content_html: string;
  created_at: string | Date;
  updated_at: string | Date | null;
};

function mapRow(row: DbBlogRow): DbBlogPost {
  return {
    id: row.id,
    author_user_id: row.author_user_id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content_html: row.content_html,
    created_at: new Date(row.created_at),
    updated_at: row.updated_at ? new Date(row.updated_at) : null,
  };
}

export async function createBlogPost(params: {
  authorUserId: number;
  slug: string;
  title: string;
  description: string;
  contentHtml: string;
}): Promise<DbBlogPost> {
  const result = await query(
    `
      INSERT INTO blog_posts (author_user_id, slug, title, description, content_html)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, author_user_id, slug, title, description, content_html, created_at, updated_at
    `,
    [
      params.authorUserId,
      params.slug,
      params.title,
      params.description,
      params.contentHtml,
    ],
  );

  const row = result.rows[0] as DbBlogRow | undefined;
  if (!row) {
    throw new Error("Failed to create blog post");
  }

  return mapRow(row);
}

export async function getBlogPostBySlug(slug: string): Promise<DbBlogPost | null> {
  const result = await query(
    `
      SELECT id, author_user_id, slug, title, description, content_html, created_at, updated_at
      FROM blog_posts
      WHERE slug = $1
      LIMIT 1
    `,
    [slug],
  );

  const row = result.rows[0] as DbBlogRow | undefined;
  return row ? mapRow(row) : null;
}

export async function listBlogPosts(): Promise<DbBlogPost[]> {
  const result = await query(
    `
      SELECT id, author_user_id, slug, title, description, content_html, created_at, updated_at
      FROM blog_posts
      ORDER BY created_at DESC
    `,
  );

  return (result.rows as DbBlogRow[]).map(mapRow);
}

