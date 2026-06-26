import { db } from "./db";
import { auditLog } from "../../drizzle/schema/auth";

interface AuditEntry {
  action: string;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: object;
  ipAddress?: string;
}

export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLog).values({
      action: entry.action,
      userId: entry.userId,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
      ipAddress: entry.ipAddress,
    });
  } catch (err) {
    console.error("Audit log write failed:", err);
  }
}
