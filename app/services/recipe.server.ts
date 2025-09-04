import type {
  Recipe as PrismaRecipe,
  Tag as PrismaTag,
  User as PrismaUser,
} from "@prisma/client";
import { z } from "zod";

import { db } from "~/utils/db.server";
import type { Unit } from "~/utils/unit-converter";
import {
  CreateRecipeSchema,
  UpdateRecipeSchema,
} from "~/utils/validation.server";

type RecipeWithRelations = PrismaRecipe & {
  user: PrismaUser | null;
  ratings: { rating: number }[];
  comments: { id: string }[];
  recipeTags: { tag: PrismaTag }[];
};

export type Ingredient = {
  quantity: string | number;
  unit: Unit;
  name: string;
};

export type Instruction = {
  description: string;
};

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  emoji?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  author: string;
  authorId?: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  isDefault: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  tags: string[];
  averageRating: number;
  ratingCount: number;
  commentCount: number;
  time?: {
    min: number;
    max?: number;
  };
};

// Client-side Recipe type (for JSON serialized data from loaders)
export type ClientRecipe = Omit<
  Recipe,
  "createdAt" | "updatedAt" | "deletedAt"
> & {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

function transformRecipe(recipe: RecipeWithRelations): Recipe {
  const ratings = recipe.ratings.map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  return {
    id: recipe.id,
    slug: recipe.slug,
    title: recipe.title,
    summary: recipe.summary || undefined,
    emoji: recipe.emoji || undefined,
    prepTime: recipe.prepTime || undefined,
    cookTime: recipe.cookTime || undefined,
    servings: recipe.servings || undefined,
    author: recipe.author,
    authorId: recipe.authorId || undefined,
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((ing) => {
          // Handle legacy string ingredients
          if (typeof ing === "string") {
            return {
              quantity: "",
              unit: "n" as const,
              name: ing,
            };
          }
          // Handle new structured ingredients
          return ing as Ingredient;
        })
      : [],
    instructions: Array.isArray(recipe.instructions)
      ? recipe.instructions.map((inst) => {
          // Handle legacy string instructions
          if (typeof inst === "string") {
            return {
              description: inst,
            };
          }
          // Handle new structured instructions
          return inst as Instruction;
        })
      : [],
    isDefault: recipe.isDefault,
    isPublic: recipe.isPublic,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt || undefined,
    deletedAt: recipe.deletedAt || undefined,
    tags: recipe.recipeTags.map((rt) => rt.tag.name),
    averageRating,
    ratingCount: ratings.length,
    commentCount: recipe.comments.length,
    time: recipe.prepTime
      ? {
          min: recipe.prepTime,
          max: recipe.cookTime || undefined,
        }
      : undefined,
  };
}

export async function getAllRecipes(userId?: string): Promise<Recipe[]> {
  const recipes = await db.recipe.findMany({
    where: {
      deletedAt: null,
      OR: [{ isPublic: true }, { authorId: userId }],
    },
    include: {
      user: true,
      ratings: {
        where: { deletedAt: null },
        select: { rating: true },
      },
      comments: {
        where: { deletedAt: null },
        select: { id: true },
      },
      recipeTags: {
        where: { deletedAt: null },
        include: { tag: true },
      },
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return recipes.map(transformRecipe);
}

export async function getRecipeBySlug(
  slug: string,
  userId?: string
): Promise<Recipe | null> {
  const recipe = await db.recipe.findFirst({
    where: {
      slug,
      deletedAt: null,
      OR: [{ isPublic: true }, { authorId: userId }],
    },
    include: {
      user: true,
      ratings: {
        where: { deletedAt: null },
        select: { rating: true },
      },
      comments: {
        where: { deletedAt: null },
        select: { id: true },
      },
      recipeTags: {
        where: { deletedAt: null },
        include: { tag: true },
      },
    },
  });

  return recipe ? transformRecipe(recipe) : null;
}

export async function createRecipe(
  data: z.infer<typeof CreateRecipeSchema>,
  userId?: string
): Promise<Recipe> {
  const validatedData = CreateRecipeSchema.parse(data);

  const recipe = await db.recipe.create({
    data: {
      slug: generateSlug(validatedData.title),
      title: validatedData.title,
      summary: validatedData.summary,
      emoji: validatedData.emoji,
      prepTime: validatedData.prepTime,
      cookTime: validatedData.cookTime,
      servings: validatedData.servings,
      author: validatedData.author,
      authorId: userId,
      ingredients: validatedData.ingredients,
      instructions: validatedData.instructions,
      isPublic: validatedData.isPublic,
      isDefault: false,
    },
  });

  // Handle tags if provided
  if (validatedData.tags && validatedData.tags.length > 0) {
    for (const tagName of validatedData.tags) {
      // Create tag if it doesn't exist
      const tag = await db.tag.upsert({
        where: { name: tagName },
        update: {},
        create: {
          name: tagName,
          displayName: tagName.charAt(0).toUpperCase() + tagName.slice(1),
          isDefault: false,
          authorId: userId || null,
        },
      });

      // Create recipe-tag relationship
      await db.recipeTag.create({
        data: {
          recipeId: recipe.id,
          tagId: tag.id,
          authorId: userId || null,
        },
      });
    }
  }

  // Get the recipe with all relationships for the response
  const recipeWithRelations = await db.recipe.findUnique({
    where: { id: recipe.id },
    include: {
      user: true,
      ratings: {
        where: { deletedAt: null },
        select: { rating: true },
      },
      comments: {
        where: { deletedAt: null },
        select: { id: true },
      },
      recipeTags: {
        where: { deletedAt: null },
        include: { tag: true },
      },
    },
  });

  if (!recipeWithRelations) {
    throw new Error("Failed to create recipe");
  }

  return transformRecipe(recipeWithRelations);
}

export async function updateRecipe(
  id: string,
  data: Omit<z.infer<typeof UpdateRecipeSchema>, "id">,
  userId?: string
): Promise<Recipe | null> {
  const validatedData = UpdateRecipeSchema.omit({ id: true }).parse(data);

  const recipe = await db.recipe.findFirst({
    where: {
      id,
      deletedAt: null,
      OR: [{ authorId: userId }, { isDefault: false }],
    },
  });

  if (!recipe) return null;

  const updatedRecipe = await db.recipe.update({
    where: { id },
    data: {
      title: validatedData.title,
      summary: validatedData.summary,
      emoji: validatedData.emoji,
      prepTime: validatedData.prepTime,
      cookTime: validatedData.cookTime,
      servings: validatedData.servings,
      author: validatedData.author,
      ingredients: validatedData.ingredients,
      instructions: validatedData.instructions,
      isPublic: validatedData.isPublic,
    },
    include: {
      user: true,
      ratings: {
        where: { deletedAt: null },
        select: { rating: true },
      },
      comments: {
        where: { deletedAt: null },
        select: { id: true },
      },
      recipeTags: {
        where: { deletedAt: null },
        include: { tag: true },
      },
    },
  });

  return transformRecipe(updatedRecipe);
}

export async function deleteRecipe(
  id: string,
  userId?: string
): Promise<boolean> {
  const recipe = await db.recipe.findFirst({
    where: {
      id,
      deletedAt: null,
      authorId: userId,
      isDefault: false, // Can't delete default recipes
    },
  });

  if (!recipe) return false;

  await db.recipe.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}
