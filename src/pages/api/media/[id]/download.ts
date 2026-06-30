import type { APIRoute } from "astro";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "../../../../lib/db";
import { mediaAssets } from "../../../../../drizzle/schema/media";
import { eq } from "drizzle-orm";
import { r2 } from "../../../../lib/r2";

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.user) return new Response("Unauthorized", { status: 401 });

  const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, params.id!)).limit(1);
  if (!asset) return new Response("Not found", { status: 404 });

  if (asset.access === "PRIVATE") {
    const allowed = ["SUPER_ADMIN", "PROGRAM_MANAGER", "VOLUNTEER_COORDINATOR"];
    if (!allowed.includes(locals.user.role)) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  const command = new GetObjectCommand({
    Bucket: import.meta.env.R2_BUCKET_NAME,
    Key: asset.r2Key,
    ResponseContentDisposition: `attachment; filename="${asset.fileName}"`,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

  return new Response(null, { status: 302, headers: { Location: signedUrl } });
};
