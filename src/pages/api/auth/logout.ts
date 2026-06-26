import type { APIRoute } from "astro";
import { lucia } from "../../../lib/auth";

export const POST: APIRoute = async ({ locals, cookies }) => {
  if (!locals.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  await lucia.invalidateSession(locals.session.id);
  const blankCookie = lucia.createBlankSessionCookie();
  cookies.set(blankCookie.name, blankCookie.value, blankCookie.attributes);

  return new Response(null, { status: 302, headers: { Location: "/admin/login" } });
};
