import type { APIRoute } from "astro";
import { db } from "../../../../lib/db";
import { contentItems } from "../../../../../drizzle/schema/content";
import { eq } from "drizzle-orm";
import { hasPermission } from "../../../../lib/rbac";

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "content.draft")) {
    return new Response("Forbidden", { status: 403 });
  }

  const { body } = await request.json();

  await db
    .update(contentItems)
    .set({ body, updatedAt: new Date() })
    .where(eq(contentItems.id, params.id!));

  return new Response(JSON.stringify({ saved: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
