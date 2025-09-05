import { z } from "zod";

export const CommentSchema = z.object({
  authorName: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name too long"),
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment too long"),
});

export type ValidatedComment = z.infer<typeof CommentSchema>;
