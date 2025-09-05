import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().min(1, "User ID is required").max(100, "User ID too long"),
  email: z.email("Invalid email address").max(255, "Email too long"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  username: z.string().max(50, "Username too long").optional(),
  avatar: z.string().max(500, "Avatar URL too long").optional(),
});

export type ValidatedUser = z.infer<typeof UserSchema>;
