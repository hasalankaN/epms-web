import { z } from "zod";

export const UserRole = {
  ADMIN: "ADMIN",
  HR: "HR",
  SUPERVISOR: "SUPERVISOR",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const userRoleSchema = z.enum(["ADMIN", "HR", "SUPERVISOR", "EMPLOYEE"]);

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: userRoleSchema,
  status: z.string().default("ACTIVE"),
});

export type User = z.infer<typeof userSchema>;