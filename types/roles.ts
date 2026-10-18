export type UserRole = "ADMIN" | "HR" | "SUPERVISOR" | "EMPLOYEE";

export const ROLE_PANEL_MAP: Record<UserRole, string> = {
  ADMIN: "/admin-panel",
  HR: "/hr-panel",
  SUPERVISOR: "/supervisor-panel",
  EMPLOYEE: "/employee-panel",
};

export const PANEL_PREFIXES = [
  "/admin-panel",
  "/hr-panel",
  "/supervisor-panel",
  "/employee-panel",
];
