import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { adminUsers } from "../drizzle/schema/auth.ts";
import { Argon2id } from "oslo/password";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

const argon2id = new Argon2id();
const hashedPassword = await argon2id.hash("Onodire1878$#");

await db.insert(adminUsers).values({
  email: "ed@chrsd.org",
  hashedPassword,
  fullName: "Executive Director",
  role: "SUPER_ADMIN",
  isActive: true,
}).onConflictDoNothing();

console.log("✓ SUPER_ADMIN created: ed@chrsd.org");
await client.end();
