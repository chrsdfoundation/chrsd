import { pgTable, text, timestamp, pgEnum, boolean, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "PROGRAM_MANAGER",
  "EDITOR",
  "VOLUNTEER_COORDINATOR",
  "VIEWER",
]);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  fullName: text("full_name").notNull(),
  role: roleEnum("role").notNull().default("VIEWER"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => adminUsers.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  metadata: text("metadata"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
