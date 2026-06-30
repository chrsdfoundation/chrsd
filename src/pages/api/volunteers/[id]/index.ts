import type { APIRoute } from "astro";
import { db } from "../../../../lib/db";
import { volunteers } from "../../../../../drizzle/schema/people";
import { eq } from "drizzle-orm";
import { hasPermission } from "../../../../lib/rbac";
import { writeAuditLog } from "../../../../lib/audit";

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "volunteer.manage")) {
    return new Response("Forbidden", { status: 403 });
  }

  const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, params.id!)).limit(1);
  if (!volunteer) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(volunteer), {
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "volunteer.manage")) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await request.json();
  const {
    fullName, email, phone, gender, address, district,
    skills, languages, availability, educationLevel, occupation,
    isActive, notes,
  } = body;

  const [volunteer] = await db
    .update(volunteers)
    .set({
      fullName,
      email,
      phone,
      gender,
      address,
      district,
      skills,
      languages,
      availability,
      educationLevel,
      occupation,
      isActive,
      notes,
      updatedAt: new Date(),
    })
    .where(eq(volunteers.id, params.id!))
    .returning();

  await writeAuditLog({
    action: "volunteer.update",
    userId: locals.user.id,
    resourceType: "volunteer",
    resourceId: params.id,
  });

  return new Response(JSON.stringify(volunteer), {
    headers: { "Content-Type": "application/json" },
  });
};
