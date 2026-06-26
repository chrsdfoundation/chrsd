import type { APIRoute } from "astro";
import { lucia } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { adminUsers } from "../../../../drizzle/schema/auth";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { writeAuditLog } from "../../../lib/audit";

const argon2id = new Argon2id();

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const form = await request.formData();
  const email = form.get("email")?.toString().toLowerCase().trim();
  const password = form.get("password")?.toString();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (!user || !user.isActive) {
    await argon2id.verify("$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAA", "dummy");
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  const validPassword = await argon2id.verify(user.hashedPassword, password);
  if (!validPassword) {
    await writeAuditLog({ action: "auth.login.failed", userId: user.id, ipAddress: clientAddress });
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  await writeAuditLog({ action: "auth.login.success", userId: user.id, ipAddress: clientAddress });

  return new Response(null, { status: 302, headers: { Location: "/admin" } });
};
