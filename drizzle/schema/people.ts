import {
  pgTable, uuid, text, date, boolean, timestamp,
  integer, jsonb, pgEnum, index,
} from "drizzle-orm/pg-core";
import { adminUsers } from "./auth";
import { contentItems } from "./content";

export const memberStatusEnum = pgEnum("member_status", [
  "ACTIVE", "INACTIVE", "LAPSED", "DECEASED",
]);

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  nationalId: text("national_id"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  district: text("district"),
  division: text("division"),
  status: memberStatusEnum("status").notNull().default("ACTIVE"),
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => adminUsers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberId: uuid("member_id").references(() => members.id, { onDelete: "restrict" }),
  amountBdt: integer("amount_bdt").notNull(),
  currency: text("currency").notNull().default("BDT"),
  paymentMethod: text("payment_method"),
  transactionRef: text("transaction_ref"),
  receiptNumber: text("receipt_number").unique(),
  programId: uuid("program_id"),
  donatedAt: timestamp("donated_at").notNull().defaultNow(),
  recordedById: uuid("recorded_by_id").references(() => adminUsers.id),
  notes: text("notes"),
});

export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").unique(),
  description: text("description"),
  contentItemId: uuid("content_item_id")
    .references(() => contentItems.id, { onDelete: "set null" }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  managerId: uuid("manager_id").references(() => adminUsers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const availabilityEnum = pgEnum("availability", [
  "FULL_TIME", "PART_TIME", "WEEKENDS_ONLY", "ON_CALL", "UNAVAILABLE",
]);

export const volunteers = pgTable("volunteers", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  nationalId: text("national_id"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  district: text("district"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  skills: text("skills").array(),
  languages: text("languages").array(),
  educationLevel: text("education_level"),
  occupation: text("occupation"),
  availability: availabilityEnum("availability").notNull().default("ON_CALL"),
  isActive: boolean("is_active").notNull().default(true),
  onboardedAt: date("onboarded_at"),
  profilePhotoKey: text("profile_photo_key"),
  documentKeys: text("document_keys").array(),
  notes: text("notes"),
  createdById: uuid("created_by_id").references(() => adminUsers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  skillsIdx: index("volunteer_skills_gin_idx").using("gin", table.skills),
}));

export const volunteerAssignments = pgTable("volunteer_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  volunteerId: uuid("volunteer_id")
    .notNull()
    .references(() => volunteers.id, { onDelete: "cascade" }),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
    .references(() => contentItems.id, { onDelete: "set null" }),
  role: text("role"),
  assignedById: uuid("assigned_by_id").references(() => adminUsers.id, { onDelete: "set null" }),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  hoursLogged: integer("hours_logged").default(0),
  performanceNote: text("performance_note"),
  certificateIssuedAt: timestamp("certificate_issued_at"),
  certificateAssetId: uuid("certificate_asset_id"),
});

export const volunteerHoursLog = pgTable("volunteer_hours_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => volunteerAssignments.id, { onDelete: "cascade" }),
  volunteerId: uuid("volunteer_id").notNull().references(() => volunteers.id),
  loggedHours: integer("logged_hours").notNull(),
  logDate: date("log_date").notNull(),
  description: text("description"),
  verifiedById: uuid("verified_by_id").references(() => adminUsers.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
