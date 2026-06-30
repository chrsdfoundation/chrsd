import type { APIRoute } from "astro";
import { db } from "../../../../lib/db";
import { volunteerHoursLog, volunteerAssignments } from "../../../../../drizzle/schema/people";
import { eq } from "drizzle-orm";
import { hasPermission } from "../../../../lib/rbac";

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "volunteer.manage")) {
    return new Response("Forbidden", { status: 403 });
  }

  const { assignmentId, loggedHours, logDate, description } = await request.json();

  if (!assignmentId || !loggedHours || !logDate) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const [entry] = await db.insert(volunteerHoursLog).values({
    assignmentId,
    volunteerId: params.id!,
    loggedHours,
    logDate,
    description,
  }).returning();

  return new Response(JSON.stringify(entry), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
