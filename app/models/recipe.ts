import { z } from "zod";

export const UnitSchema = z.enum([
  "n",
  "g",
  "kg",
  "mL",
  "L",
  "tsp",
  "tbsp",
  "cup",
]);

export const IngredientSchema = z.object({
  unit: UnitSchema,
  name: z
    .string()
    .min(1, "Ingredient name is required")
    .max(100, "Ingredient name too long"),
  quantity: z.union([
    z.string().min(1, "Quantity is required"),
    z.number().positive("Quantity must be positive"),
  ]),
});

export const InstructionSchema = z.object({
  description: z
    .string()
    .min(1, "Instruction description is required")
    .max(1000, "Instruction too long"),
});

export const TimeSchema = z
  .object({
    min: z.number().int().min(1, "Minimum time must be at least 1 minute"),
    max: z.number().int().optional(),
  })
  .refine((data) => !data.max || data.max >= data.min, {
    message: "Maximum time must be greater than or equal to minimum time",
    path: ["max"],
  });

export const TagStringSchema = z
  .string()
  .min(1, "Tag cannot be empty")
  .max(50, "Tag too long");

export const RecipeSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  summary: z.string().max(500, "Summary too long").optional(),
  emoji: z.string().max(10, "Emoji too long").optional(),
  time: TimeSchema.optional(),
  servings: z
    .number()
    .int()
    .min(1, "Servings must be at least 1")
    .max(100, "Servings too high")
    .optional(),
  author: z.string().max(100, "Author name too long").optional(),
  userId: z.string().max(100, "User ID too long").optional(),
  instructions: z
    .array(InstructionSchema)
    .min(1, "At least one instruction is required")
    .max(50, "Too many instructions"),
  ingredients: z
    .array(IngredientSchema)
    .min(1, "At least one ingredient is required")
    .max(100, "Too many ingredients"),
  tags: z.array(TagStringSchema).max(20, "Too many tags"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  averageRating: z.number().min(0).max(5).optional(),
  ratingCount: z.number().int().min(0).optional(),
  commentCount: z.number().int().min(0).optional(),
  isDefault: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

export const RecipeInputSchema = RecipeSchema.omit({
  slug: true,
  createdAt: true,
  updatedAt: true,
  averageRating: true,
  ratingCount: true,
  commentCount: true,
});


export type ValidatedRecipe = z.infer<typeof RecipeSchema>;
export type ValidatedRecipeInput = z.infer<typeof RecipeInputSchema>;
export type ValidatedIngredient = z.infer<typeof IngredientSchema>;
export type ValidatedInstruction = z.infer<typeof InstructionSchema>;
