import type { APIRoute } from "astro";
import { db } from "../../../../lib/db";
import { contentItems, contentRevisions } from "../../../../../drizzle/schema/content";
import { eq, sql } from "drizzle-orm";
import { writeAuditLog } from "../../../../lib/audit";
import { hasPermission } from "../../../../lib/rbac";

export const POST: APIRoute = async ({ params, locals }) => {
  const user = locals.user;
  if (!user || !hasPermission(user.role, "content.publish")) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = params;
  const [item] = await db
    .select()
    .from(contentItems)
    .where(eq(contentItems.id, id!))
    .limit(1);

  if (!item) return new Response("Not found", { status: 404 });
  if (item.status === "PUBLISHED") {
    return new Response(JSON.stringify({ error: "Already published" }), { status: 409 });
  }

  const [{ max }] = await db
    .select({ max: sql<number>`COALESCE(MAX(revision_number), 0)` })
    .from(contentRevisions)
    .where(eq(contentRevisions.contentId, id!));

  const nextRevision = (max ?? 0) + 1;

  await db.transaction(async (tx) => {
    await tx.insert(contentRevisions).values({
      contentId: item.id,
      revisionNumber: nextRevision,
      body: item.body ?? {},
      bodyMd: item.bodyMd,
      changedById: user.id,
      changeNote: "Published",
    });

    await tx
      .update(contentItems)
      .set({
        status: "PUBLISHED",
        publishedAt: new Date(),
        publishedById: user.id,
        updatedAt: new Date(),
      })
      .where(eq(contentItems.id, id!));
  });

  await writeAuditLog({
    action: "content.publish",
    userId: user.id,
    resourceType: "content_item",
    resourceId: id,
  });

  return new Response(JSON.stringify({ success: true, revisionNumber: nextRevision }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
