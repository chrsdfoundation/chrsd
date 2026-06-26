import { defineMiddleware, sequence } from "astro:middleware";
import { lucia } from "../lib/auth";

type Role = "SUPER_ADMIN" | "PROGRAM_MANAGER" | "EDITOR" | "VOLUNTEER_COORDINATOR" | "VIEWER";

const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/admin/users": ["SUPER_ADMIN"],
  "/admin/settings": ["SUPER_ADMIN"],
  "/admin/audit": ["SUPER_ADMIN"],
  "/admin/content": ["SUPER_ADMIN", "PROGRAM_MANAGER", "EDITOR"],
  "/admin/volunteers": ["SUPER_ADMIN", "PROGRAM_MANAGER", "VOLUNTEER_COORDINATOR"],
  "/admin/media": ["SUPER_ADMIN", "PROGRAM_MANAGER", "EDITOR", "VOLUNTEER_COORDINATOR"],
  "/admin/certificates": ["SUPER_ADMIN", "PROGRAM_MANAGER", "VOLUNTEER_COORDINATOR"],
  "/admin": ["SUPER_ADMIN", "PROGRAM_MANAGER", "EDITOR", "VOLUNTEER_COORDINATOR", "VIEWER"],
};

const authMiddleware = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session?.fresh) {
    const cookie = lucia.createSessionCookie(session.id);
    context.cookies.set(cookie.name, cookie.value, cookie.attributes);
  }

  if (!session) {
    const blankCookie = lucia.createBlankSessionCookie();
    context.cookies.set(blankCookie.name, blankCookie.value, blankCookie.attributes);
  }

  context.locals.user = user;
  context.locals.session = session;
  return next();
});

const guardMiddleware = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);

  if (!pathname.startsWith("/admin")) return next();
  if (pathname === "/admin/login") return next();

  const user = context.locals.user;

  if (!user || !user.isActive) {
    return context.redirect("/admin/login?reason=unauthenticated");
  }

  const matchedRoute = Object.keys(ROUTE_PERMISSIONS)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  if (matchedRoute) {
    const allowed = ROUTE_PERMISSIONS[matchedRoute];
    if (!allowed.includes(user.role as Role)) {
      return context.redirect("/admin?error=forbidden");
    }
  }

  return next();
});

export const onRequest = sequence(authMiddleware, guardMiddleware);
