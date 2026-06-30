import {
  pgTable, uuid, text, boolean, timestamp, integer,
  pgEnum, jsonb, index,
} from "drizzle-orm/pg-core";
import { adminUsers } from "./auth";

export const contentStatusEnum = pgEnum("content_status", [
  "DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED",
]);

export const contentTypeEnum = pgEnum("content_type", [
  "PAGE", "POST", "EVENT", "PROGRAM",
]);

export const contentItems = pgTable("content_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: contentTypeEnum("type").notNull(),
  status: contentStatusEnum("status").notNull().default("DRAFT"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  body: jsonb("body"),
  bodyMd: text("body_md"),
  featuredImageKey: text("featured_image_key"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  tags: text("tags").array(),
  eventStartAt: timestamp("event_start_at"),
  eventEndAt: timestamp("event_end_at"),
  eventLocation: text("event_location"),
  eventCapacity: integer("event_capacity"),
  authorId: uuid("author_id").references(() => adminUsers.id, { onDelete: "set null" }),
  publishedAt: timestamp("published_at"),
  publishedById: uuid("published_by_id").references(() => adminUsers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  slugIdx: index("content_slug_idx").on(table.slug),
  statusTypeIdx: index("content_status_type_idx").on(table.status, table.type),
  publishedAtIdx: index("content_published_at_idx").on(table.publishedAt),
}));

export const contentRevisions = pgTable("content_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentId: uuid("content_id")
    .notNull()
    .references(() => contentItems.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  body: jsonb("body").notNull(),
  bodyMd: text("body_md"),
  changedById: uuid("changed_by_id").references(() => adminUsers.id, { onDelete: "set null" }),
  changeNote: text("change_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
