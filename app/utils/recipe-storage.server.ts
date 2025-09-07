import {
  CommentSchema,
  RatingSchema,
  RecipeSchema,
  RecipeInputSchema,
} from "~/models";

import { db } from "./db.server";
import type { Recipe, RecipeComment } from "./recipes";
import { toTitleCase } from "./stringExtensions";

// Helper function to get or create tag IDs from tag names
async function getOrCreateTagIds(tagNames: string[]): Promise<number[]> {
  const tagIds: number[] = [];

  for (const tagName of tagNames) {
    const normalizedName = tagName.toLowerCase().trim();
    if (!normalizedName) continue;

    let existingTag = await db.tag.findUnique({
      where: { name: normalizedName },
    });

    if (!existingTag) {
      // Create new tag with proper title-cased display name
      const displayName = toTitleCase(tagName.trim());
      existingTag = await db.tag.create({
        data: {
          name: normalizedName,
          displayName,
          isDefault: false,
        },
      });
    }

    tagIds.push(existingTag.id);
  }

  return tagIds;
}

// Convert Prisma result to Recipe object
function prismaToRecipe(recipe: {
  slug: string;
  title: string;
  summary: string | null;
  emoji: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  author: string;
  userId: string | null;
  ingredients: string;
  instructions: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
  isPublic: boolean;
  recipeTags: Array<{ tag: { name: string } }>;
  ratings: Array<{ rating: number }>;
  comments: Array<{ id: number }>;
}): Recipe {
  const averageRating =
    recipe.ratings.length > 0
      ? recipe.ratings.reduce(
          (sum: number, r: { rating: number }) => sum + r.rating,
          0
        ) / recipe.ratings.length
      : 0;

  return {
    slug: recipe.slug,
    title: recipe.title,
    summary: recipe.summary || undefined,
    emoji: recipe.emoji || undefined,
    time: recipe.prepTime
      ? {
          min: recipe.prepTime,
          max: recipe.cookTime || undefined,
        }
      : undefined,
    servings: recipe.servings || undefined,
    author: recipe.author,
    userId: recipe.userId || undefined,
    tags: recipe.recipeTags.map((rt) => rt.tag.name),
    ingredients: JSON.parse(recipe.ingredients),
    instructions: JSON.parse(recipe.instructions),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    averageRating,
    ratingCount: recipe.ratings.length,
    commentCount: recipe.comments.length,
    isDefault: recipe.isDefault,
    isPublic: recipe.isPublic,
  };
}

export async function getAllRecipes(userId?: string): Promise<Recipe[]> {
  try {
    const recipes = await db.recipe.findMany({
      where: userId
        ? {
            OR: [{ isPublic: true }, { userId }],
          }
        : { isPublic: true },
      include: {
        recipeTags: {
          include: {
            tag: true,
          },
        },
        ratings: true,
        comments: true,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return recipes.map(prismaToRecipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export async function getRecipeBySlug(
  slug: string
): Promise<Recipe | undefined> {
  try {
    const recipe = await db.recipe.findUnique({
      where: { slug },
      include: {
        recipeTags: {
          include: {
            tag: true,
          },
        },
        ratings: true,
        comments: true,
      },
    });

    return recipe ? prismaToRecipe(recipe) : undefined;
  } catch (error) {
    console.error(`Error fetching recipe ${slug}:`, error);
    return undefined;
  }
}

export async function addRecipe(recipe: Recipe): Promise<Recipe> {
  const validation = RecipeSchema.safeParse(recipe);
  if (!validation.success) {
    throw new Error(
      `Invalid recipe data: ${JSON.stringify(validation.error.format())}`
    );
  }

  try {
    // Check if slug already exists and modify if needed
    let uniqueSlug = recipe.slug;
    let counter = 1;

    while (await db.recipe.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${recipe.slug}-${counter}`;
      counter++;
    }

    const finalRecipe = { ...recipe, slug: uniqueSlug };

    // Create recipe
    await db.recipe.create({
      data: {
        slug: finalRecipe.slug,
        title: finalRecipe.title,
        summary: finalRecipe.summary || null,
        emoji: finalRecipe.emoji || null,
        prepTime: finalRecipe.time?.min || null,
        cookTime: finalRecipe.time?.max || null,
        servings: finalRecipe.servings || null,
        userId: finalRecipe.userId || null,
        tags: "[]", // Empty JSON array for backward compatibility
        ingredients: JSON.stringify(finalRecipe.ingredients),
        instructions: JSON.stringify(finalRecipe.instructions),
        author: finalRecipe.author || "Anonymous",
        isDefault: false,
        isPublic:
          finalRecipe.isPublic !== undefined ? finalRecipe.isPublic : true,
      },
    });

    // Add tags to the recipe
    const tagIds = await getOrCreateTagIds(finalRecipe.tags);
    await setRecipeTags(finalRecipe.slug, tagIds);

    console.log(`✅ Recipe ${finalRecipe.slug} added successfully`);
    return finalRecipe;
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw new Error("Failed to add recipe");
  }
}

export async function updateRecipe(
  slug: string,
  updatedRecipe: Omit<Recipe, "slug">
): Promise<Recipe | null> {
  const validation = RecipeInputSchema.safeParse(updatedRecipe);
  if (!validation.success) {
    throw new Error(
      `Invalid recipe update data: ${JSON.stringify(validation.error.format())}`
    );
  }

  try {
    const existingRecipe = await db.recipe.findUnique({ where: { slug } });
    if (!existingRecipe) {
      return null;
    }

    // Don't allow updating default recipes
    if (existingRecipe.isDefault) {
      throw new Error("Cannot update default recipes");
    }

    await db.recipe.update({
      where: { slug },
      data: {
        title: updatedRecipe.title,
        summary: updatedRecipe.summary || null,
        emoji: updatedRecipe.emoji || null,
        prepTime: updatedRecipe.time?.min || null,
        cookTime: updatedRecipe.time?.max || null,
        servings: updatedRecipe.servings || null,
        tags: "[]", // Empty JSON array for backward compatibility
        ingredients: JSON.stringify(updatedRecipe.ingredients),
        instructions: JSON.stringify(updatedRecipe.instructions),
        author: updatedRecipe.author || "Anonymous",
      },
    });

    // Update tags for the recipe
    const tagIds = await getOrCreateTagIds(updatedRecipe.tags);
    await setRecipeTags(slug, tagIds);

    console.log(`✅ Recipe ${slug} updated successfully`);
    return { ...updatedRecipe, slug };
  } catch (error) {
    console.error(`Error updating recipe ${slug}:`, error);
    return null;
  }
}

export async function deleteRecipe(slug: string): Promise<boolean> {
  try {
    const deleted = await db.recipe.deleteMany({
      where: {
        slug,
        isDefault: false,
      },
    });

    const success = deleted.count > 0;

    if (success) {
      console.log(`✅ Recipe ${slug} deleted successfully`);
    } else {
      console.log(`⚠️  Recipe ${slug} not found or is a default recipe`);
    }

    return success;
  } catch (error) {
    console.error(`Error deleting recipe ${slug}:`, error);
    return false;
  }
}

// Additional utility functions for the new system
export async function getCustomRecipes(): Promise<Recipe[]> {
  try {
    const recipes = await db.recipe.findMany({
      where: { isDefault: false },
      include: {
        recipeTags: {
          include: {
            tag: true,
          },
        },
        ratings: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return recipes.map(prismaToRecipe);
  } catch (error) {
    console.error("Error fetching custom recipes:", error);
    return [];
  }
}

export async function getDefaultRecipes(): Promise<Recipe[]> {
  try {
    const recipes = await db.recipe.findMany({
      where: { isDefault: true },
      include: {
        recipeTags: {
          include: {
            tag: true,
          },
        },
        ratings: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return recipes.map(prismaToRecipe);
  } catch (error) {
    console.error("Error fetching default recipes:", error);
    return [];
  }
}

export async function getRecipeStats() {
  try {
    const total = await db.recipe.count();
    const defaultCount = await db.recipe.count({
      where: { isDefault: true },
    });
    const customCount = await db.recipe.count({
      where: { isDefault: false },
    });

    return {
      total,
      default: defaultCount,
      custom: customCount,
    };
  } catch (error) {
    console.error("Error fetching recipe stats:", error);
    return { total: 0, default: 0, custom: 0 };
  }
}

// Rating functions
export async function getUserRating(
  recipeSlug: string,
  userIp: string
): Promise<number | null> {
  try {
    const rating = await db.recipeRating.findUnique({
      where: {
        recipeSlug_userIp: {
          recipeSlug,
          userIp,
        },
      },
    });

    return rating ? rating.rating : null;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
  }
}

export async function addOrUpdateRating(
  recipeSlug: string,
  rating: number,
  userIp: string
): Promise<boolean> {
  try {
    await db.recipeRating.upsert({
      where: {
        recipeSlug_userIp: {
          recipeSlug,
          userIp,
        },
      },
      update: {
        rating,
      },
      create: {
        recipeSlug,
        rating,
        userIp,
      },
    });

    return true;
  } catch (error) {
    console.error("Error adding/updating rating:", error);
    return false;
  }
}

// Comment functions
export async function getRecipeComments(
  recipeSlug: string
): Promise<RecipeComment[]> {
  try {
    const comments = await db.recipeComment.findMany({
      where: { recipeSlug },
      orderBy: { createdAt: "desc" },
    });

    return comments.map((comment) => ({
      id: comment.id,
      authorName: comment.authorName,
      comment: comment.comment,
      createdAt: comment.createdAt.toISOString(),
      userId: comment.userId || undefined,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function addComment(
  recipeSlug: string,
  authorName: string,
  comment: string,
  userIp: string,
  userId?: string
): Promise<boolean> {
  const validation = CommentSchema.safeParse({ authorName, comment });
  if (!validation.success) {
    throw new Error(
      `Invalid comment data: ${JSON.stringify(validation.error.format())}`
    );
  }

  try {
    await db.recipeComment.create({
      data: {
        recipeSlug,
        authorName,
        comment,
        userIp,
        userId: userId || null,
      },
    });

    return true;
  } catch (error) {
    console.error("Error adding comment:", error);
    return false;
  }
}

export async function updateComment(
  commentId: number,
  newComment: string,
  userId: string
): Promise<boolean> {
  try {
    const updated = await db.recipeComment.updateMany({
      where: {
        id: commentId,
        userId,
      },
      data: {
        comment: newComment,
      },
    });

    return updated.count > 0;
  } catch (error) {
    console.error("Error updating comment:", error);
    return false;
  }
}

// Get latest recipes (newest first)
export async function getLatestRecipes(limit: number = 10): Promise<Recipe[]> {
  try {
    const recipes = await db.recipe.findMany({
      include: {
        recipeTags: {
          include: {
            tag: true,
          },
        },
        ratings: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return recipes.map(prismaToRecipe);
  } catch (error) {
    console.error("Error fetching latest recipes:", error);
    return [];
  }
}

// Get trendy recipes (highest rated with minimum ratings)
export async function getTrendyRecipes(
  limit: number = 10,
  minRatings: number = 3
): Promise<Recipe[]> {
  try {
    const recipes = await db.recipe.findMany({
      include: {
        recipeTags: {
          include: {
            tag: true,
          },
        },
        ratings: true,
        comments: true,
      },
    });

    // Filter and sort in JavaScript since Prisma doesn't support complex aggregations easily
    const recipesWithRatings = recipes
      .filter((recipe) => recipe.ratings.length >= minRatings)
      .map((recipe) => ({
        recipe,
        avgRating:
          recipe.ratings.reduce((sum, r) => sum + r.rating, 0) /
          recipe.ratings.length,
      }))
      .filter((item) => item.avgRating >= 4.0)
      .sort((a, b) => {
        if (a.avgRating !== b.avgRating) return b.avgRating - a.avgRating;
        return b.recipe.ratings.length - a.recipe.ratings.length;
      })
      .slice(0, limit);

    return recipesWithRatings.map((item) => prismaToRecipe(item.recipe));
  } catch (error) {
    console.error("Error fetching trendy recipes:", error);
    return [];
  }
}

export async function updateRecipeRating(
  recipeSlug: string,
  rating: number,
  userIp?: string
): Promise<boolean> {
  const validation = RatingSchema.safeParse({ rating });
  if (!validation.success) {
    throw new Error(
      `Invalid rating data: ${JSON.stringify(validation.error.format())}`
    );
  }

  try {
    // Use a simple user identification for now (in production, use proper user auth)
    const userId = userIp || "anonymous";

    const success = await addOrUpdateRating(recipeSlug, rating, userId);

    if (success) {
      console.log(
        `✅ Rating updated for recipe ${recipeSlug}: ${rating} stars`
      );
    }

    return success;
  } catch (error) {
    console.error(`Error updating rating for recipe ${recipeSlug}:`, error);
    return false;
  }
}

// Helper function for tags (need to implement the tag functions)
async function setRecipeTags(
  recipeSlug: string,
  tagIds: number[]
): Promise<void> {
  // First, remove existing tags
  await db.recipeTag.deleteMany({
    where: { recipeSlug },
  });

  // Then add new tags
  if (tagIds.length > 0) {
    await db.recipeTag.createMany({
      data: tagIds.map((tagId) => ({
        recipeSlug,
        tagId,
      })),
    });
  }
}
