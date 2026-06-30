import type { APIRoute } from "astro";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../../../lib/db";
import { volunteers, volunteerAssignments, programs } from "../../../../drizzle/schema/people";
import { mediaAssets } from "../../../../drizzle/schema/media";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { r2 } from "../../../lib/r2";
import { hasPermission } from "../../../lib/rbac";

function runCertWorker(templateType: string, data: object): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      fileURLToPath(new URL("../../../lib/certificates/worker.ts", import.meta.url)),
      { workerData: { templateType, data } }
    );
    worker.on("message", ({ pdfBuffer, error }: { pdfBuffer?: Buffer; error?: string }) => {
      if (error) return reject(new Error(error));
      resolve(pdfBuffer!);
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user || !hasPermission(locals.user.role, "certificate.generate")) {
    return new Response("Forbidden", { status: 403 });
  }

  const { volunteerId, assignmentId, templateType = "appreciation" } = await request.json();

  if (!volunteerId || !assignmentId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, volunteerId)).limit(1);
  const [assignment] = await db
    .select({ assignment: volunteerAssignments, program: programs })
    .from(volunteerAssignments)
    .innerJoin(programs, eq(volunteerAssignments.programId, programs.id))
    .where(and(eq(volunteerAssignments.id, assignmentId), eq(volunteerAssignments.volunteerId, volunteerId)))
    .limit(1);

  if (!volunteer || !assignment) {
    return new Response(JSON.stringify({ error: "Volunteer or assignment not found" }), { status: 404 });
  }

  const certId = nanoid(12).toUpperCase();

  const certData = {
    recipientName: volunteer.fullName,
    programName: assignment.program.name,
    role: assignment.assignment.role ?? "Volunteer",
    hoursContributed: assignment.assignment.hoursLogged ?? 0,
    issuedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    signatoryName: import.meta.env.CERT_SIGNATORY_NAME ?? "Executive Director",
    signatoryTitle: import.meta.env.CERT_SIGNATORY_TITLE ?? "CHRSD Foundation",
    certificateId: certId,
    logoBase64: import.meta.env.CHRSD_LOGO_BASE64 ?? "",
  };

  const pdfBuffer = await runCertWorker(templateType, certData);

  const r2Key = `private/certificates/${certId}/${volunteer.id}.pdf`;
  await r2.send(new PutObjectCommand({
    Bucket: import.meta.env.R2_BUCKET_NAME,
    Key: r2Key,
    Body: pdfBuffer,
    ContentType: "application/pdf",
    Metadata: { volunteerId, assignmentId, certId },
  }));

  const [asset] = await db.insert(mediaAssets).values({
    r2Key,
    fileName: `Certificate_${certId}.pdf`,
    mimeType: "application/pdf",
    sizeBytes: pdfBuffer.length,
    access: "PRIVATE",
    uploadedById: locals.user.id,
    associatedResourceType: "volunteer_assignment",
    associatedResourceId: assignmentId,
    description: `${templateType} certificate for ${volunteer.fullName}`,
  }).returning();

  await db.update(volunteerAssignments).set({
    certificateIssuedAt: new Date(),
    certificateAssetId: asset.id,
  }).where(eq(volunteerAssignments.id, assignmentId));

  const downloadUrl = await getSignedUrl(r2, new GetObjectCommand({
    Bucket: import.meta.env.R2_BUCKET_NAME,
    Key: r2Key,
    ResponseContentDisposition: `attachment; filename="CHRSD_Certificate_${certId}.pdf"`,
  }), { expiresIn: 3600 });

  return new Response(JSON.stringify({ downloadUrl, certId, assetId: asset.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
