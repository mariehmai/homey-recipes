import { z } from "zod";

export const TagSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, "Tag name is required").max(50, "Tag name too long"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name too long"),
  isDefault: z.boolean().optional(),
});

export type ValidatedTag = z.infer<typeof TagSchema>;
