import { z } from "zod";

export const UsernameValidation = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(20, "Username can be maximum 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const SignUpSchema = z.object({
  username: UsernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
