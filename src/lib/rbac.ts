type Role = "SUPER_ADMIN" | "PROGRAM_MANAGER" | "EDITOR" | "VOLUNTEER_COORDINATOR" | "VIEWER";

const PERMISSIONS: Record<string, Role[]> = {
  "user.manage": ["SUPER_ADMIN"],
  "content.publish": ["SUPER_ADMIN", "PROGRAM_MANAGER", "EDITOR"],
  "content.draft": ["SUPER_ADMIN", "PROGRAM_MANAGER", "EDITOR"],
  "volunteer.manage": ["SUPER_ADMIN", "PROGRAM_MANAGER", "VOLUNTEER_COORDINATOR"],
  "certificate.generate": ["SUPER_ADMIN", "PROGRAM_MANAGER", "VOLUNTEER_COORDINATOR"],
  "media.upload": ["SUPER_ADMIN", "PROGRAM_MANAGER", "EDITOR", "VOLUNTEER_COORDINATOR"],
  "audit.view": ["SUPER_ADMIN"],
  "settings.manage": ["SUPER_ADMIN"],
};

export function hasPermission(role: string, permission: string): boolean {
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(role as Role);
}
