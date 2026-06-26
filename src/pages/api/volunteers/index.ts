import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { volunteers } from "../../../../drizzle/schema/people";
import { eq, desc } from "drizzle-orm";
import { hasPermission } from "../../../lib/rbac";
import { writeAuditLog } from "../../../lib/audit";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "volunteer.manage")) {
    return new Response("Forbidden", { status: 403 });
  }

  const results = await db.select().from(volunteers).orderBy(desc(volunteers.createdAt));

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "volunteer.manage")) {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await request.json();
  const {
    fullName, email, phone, gender, address, district,
    skills, languages, availability, educationLevel, occupation,
  } = body;

  if (!fullName) {
    return new Response(JSON.stringify({ error: "Full name is required" }), { status: 400 });
  }

  const [volunteer] = await db.insert(volunteers).values({
    fullName,
    email,
    phone,
    gender,
    address,
    district,
    skills,
    languages,
    availability: availability ?? "ON_CALL",
    educationLevel,
    occupation,
    createdById: locals.user.id,
  }).returning();

  await writeAuditLog({
    action: "volunteer.create",
    userId: locals.user.id,
    resourceType: "volunteer",
    resourceId: volunteer.id,
  });

  return new Response(JSON.stringify(volunteer), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
