import type { APIRoute } from "astro";
import { db } from "../../../../lib/db";
import { contentItems } from "../../../../../drizzle/schema/content";
import { eq } from "drizzle-orm";
import { hasPermission } from "../../../../lib/rbac";
import { writeAuditLog } from "../../../../lib/audit";

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user) return new Response("Unauthorized", { status: 401 });

  const [item] = await db.select().from(contentItems).where(eq(contentItems.id, params.id!)).limit(1);
  if (!item) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(item), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "content.draft")) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await request.json();
  const { title, excerpt, bodyContent, bodyMd, tags, metaTitle, metaDescription } = body;

  const [item] = await db
    .update(contentItems)
    .set({
      title,
      excerpt,
      body: bodyContent,
      bodyMd,
      tags,
      metaTitle,
      metaDescription,
      updatedAt: new Date(),
    })
    .where(eq(contentItems.id, params.id!))
    .returning();

  await writeAuditLog({
    action: "content.update",
    userId: locals.user.id,
    resourceType: "content_item",
    resourceId: params.id,
  });

  return new Response(JSON.stringify(item), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user || locals.user.role !== "SUPER_ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  await db.delete(contentItems).where(eq(contentItems.id, params.id!));

  await writeAuditLog({
    action: "content.delete",
    userId: locals.user.id,
    resourceType: "content_item",
    resourceId: params.id,
  });

  return new Response(null, { status: 204 });
};
