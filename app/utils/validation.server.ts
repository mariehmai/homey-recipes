import { z } from "zod";

const IngredientSchema = z.object({
  quantity: z.union([z.string().min(1), z.number().positive()]),
  unit: z.enum(["g", "kg", "mL", "L", "tsp", "tbsp", "cup", "n"]),
  name: z.string().min(1, "Ingredient name cannot be empty"),
});

const InstructionSchema = z.object({
  description: z.string().min(1, "Instruction cannot be empty"),
});

export const CreateRecipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  summary: z.string().optional(),
  emoji: z.string().optional(),
  prepTime: z.number().int().positive().optional(),
  cookTime: z.number().int().positive().optional(),
  servings: z.number().int().positive().optional(),
  author: z.string().min(1, "Author is required").max(100),
  ingredients: z
    .array(IngredientSchema)
    .min(1, "At least one ingredient required"),
  instructions: z
    .array(InstructionSchema)
    .min(1, "At least one instruction required"),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string().min(1)).optional(),
});

export const UpdateRecipeSchema = CreateRecipeSchema.partial().extend({
  id: z.uuid("Invalid recipe ID"),
});

export const RateRecipeSchema = z.object({
  recipeId: z.uuid("Invalid recipe ID"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  userIp: z.string().min(1, "User IP is required"),
});

export const CreateCommentSchema = z.object({
  recipeId: z.string().uuid("Invalid recipe ID"),
  authorName: z.string().min(1, "Name is required").max(100, "Name too long"),
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long"),
  userIp: z.string().min(1, "User IP is required"),
  userId: z.string().uuid().optional(),
});

export const UpdateCommentSchema = z.object({
  id: z.string().uuid("Invalid comment ID"),
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long"),
  userId: z.string().uuid("User ID is required"),
});

export const CreateTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name too long")
    .toLowerCase(),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name too long"),
  isDefault: z.boolean().default(false),
});

export const UserProfileSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long")
    .optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

export const UpdateUserProfileSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long")
    .optional(),
});

// Form validation helpers
export type CreateRecipeFormData = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeFormData = z.infer<typeof UpdateRecipeSchema>;
export type RateRecipeFormData = z.infer<typeof RateRecipeSchema>;
export type CreateCommentFormData = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentFormData = z.infer<typeof UpdateCommentSchema>;
export type CreateTagFormData = z.infer<typeof CreateTagSchema>;
export type UserProfileFormData = z.infer<typeof UserProfileSchema>;
export type UpdateUserProfileFormData = z.infer<typeof UpdateUserProfileSchema>;

// Helper function to parse form data
export function parseFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const data = schema.parse(Object.fromEntries(formData));
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}
