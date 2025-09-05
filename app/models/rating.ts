import { z } from "zod";

export const RatingSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
});

export type ValidatedRating = z.infer<typeof RatingSchema>;
