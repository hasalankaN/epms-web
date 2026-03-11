import { z } from "zod";

import { userSchema } from "./user.dto";

// For the login request form
export const loginRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional(),
});

// For the data object inside the successful API response
export const loginResponseDataSchema = z.object({
  id_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  user: userSchema,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponseData = z.infer<typeof loginResponseDataSchema>;