import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessions, adminUsers } from "../../drizzle/schema/auth";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, adminUsers);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
      sameSite: "lax",
    },
  },
  getUserAttributes: (attrs) => ({
    email: attrs.email,
    fullName: attrs.full_name,
    role: attrs.role,
    isActive: attrs.is_active,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      full_name: string;
      role: "SUPER_ADMIN" | "PROGRAM_MANAGER" | "EDITOR" | "VOLUNTEER_COORDINATOR" | "VIEWER";
      is_active: boolean;
    };
  }
}
