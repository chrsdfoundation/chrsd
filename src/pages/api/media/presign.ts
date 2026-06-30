import type { APIRoute } from "astro";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { db } from "../../../lib/db";
import { mediaAssets } from "../../../../drizzle/schema/media";
import { r2 } from "../../../lib/r2";

const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_SIZE = 20 * 1024 * 1024;

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return new Response("Unauthorized", { status: 401 });

  const { fileName, mimeType, sizeBytes, access = "PUBLIC", resourceType, resourceId } =
    await request.json();

  if (!ALLOWED_TYPES.has(mimeType)) {
    return new Response(JSON.stringify({ error: "File type not allowed" }), { status: 400 });
  }
  if (sizeBytes > MAX_SIZE) {
    return new Response(JSON.stringify({ error: "File exceeds 20 MB limit" }), { status: 400 });
  }

  if (access === "PRIVATE" && !["SUPER_ADMIN", "PROGRAM_MANAGER", "VOLUNTEER_COORDINATOR"].includes(locals.user.role)) {
    return new Response("Forbidden", { status: 403 });
  }

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const uniqueKey = `${access.toLowerCase()}/${resourceType ?? "misc"}/${nanoid()}/${Date.now()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: import.meta.env.R2_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: mimeType,
    ContentLength: sizeBytes,
  });

  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

  const [asset] = await db.insert(mediaAssets).values({
    r2Key: uniqueKey,
    fileName,
    mimeType,
    sizeBytes,
    access,
    uploadedById: locals.user.id,
    associatedResourceType: resourceType,
    associatedResourceId: resourceId,
  }).returning();

  return new Response(JSON.stringify({ presignedUrl, assetId: asset.id, key: uniqueKey }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
