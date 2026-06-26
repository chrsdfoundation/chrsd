import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { contentItems } from "../../../../drizzle/schema/content";
import { eq, desc } from "drizzle-orm";
import { hasPermission } from "../../../lib/rbac";
import { writeAuditLog } from "../../../lib/audit";

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.user) return new Response("Unauthorized", { status: 401 });

  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");

  let query = db.select().from(contentItems).orderBy(desc(contentItems.updatedAt));

  const items = await query;

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "content.draft")) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await request.json();
  const { type, title, slug, excerpt, bodyContent, bodyMd, tags } = body;

  if (!type || !title || !slug) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const [item] = await db.insert(contentItems).values({
    type,
    title,
    slug,
    excerpt,
    body: bodyContent,
    bodyMd,
    tags,
    authorId: locals.user.id,
  }).returning();

  await writeAuditLog({
    action: "content.create",
    userId: locals.user.id,
    resourceType: "content_item",
    resourceId: item.id,
  });

  return new Response(JSON.stringify(item), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
