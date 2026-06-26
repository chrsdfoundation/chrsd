import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { adminUsers } from "./auth";

export const mediaAccessEnum = pgEnum("media_access", ["PUBLIC", "PRIVATE"]);

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  r2Key: text("r2_key").notNull().unique(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  access: mediaAccessEnum("access").notNull().default("PUBLIC"),
  width: integer("width"),
  height: integer("height"),
  blurhash: text("blurhash"),
  uploadedById: uuid("uploaded_by_id").references(() => adminUsers.id, { onDelete: "set null" }),
  associatedResourceType: text("associated_resource_type"),
  associatedResourceId: uuid("associated_resource_id"),
  description: text("description"),
  altText: text("alt_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
