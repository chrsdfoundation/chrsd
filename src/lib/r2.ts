import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${import.meta.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
  },
});
