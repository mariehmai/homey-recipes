import {
  CommentSchema,
  RatingSchema,
  RecipeSchema,
  RecipeInputSchema,
} from "~/models";

import { queries, initializeDatabase, db } from "./db.server";
import type { Recipe, RecipeComment } from "./recipes";
import { seedDefaultRecipes } from "./seed.server";
import { toTitleCase } from "./stringExtensions";
import {
  getRecipeTags,
  setRecipeTags,
  getAllTags,
  createTag,
} from "./tag-storage.server";

// Initialize database on first import
let isInitialized = false;

function ensureInitialized() {
  if (!isInitialized) {
    initializeDatabase();
    seedDefaultRecipes();
    isInitialized = true;
  }
}

interface DatabaseRow {
  slug: string;
  title: string;
  summary: string;
  emoji: string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  user_id: string | null;
  author: string;
  tags: string;
  ingredients: string;
  instructions: string;
  is_default?: boolean;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
  average_rating: number;
  rating_count: number;
  comment_count: number;
}

// Helper function to get or create tag IDs from tag names
function getOrCreateTagIds(tagNames: string[]): number[] {
  const allTags = getAllTags();
  const tagIds: number[] = [];

  for (const tagName of tagNames) {
    const normalizedName = tagName.toLowerCase().trim();
    if (!normalizedName) continue;

    let existingTag = allTags.find((t) => t.name === normalizedName);

    if (!existingTag) {
      // Create new tag with proper title-cased display name
      const displayName = toTitleCase(tagName.trim());
      existingTag = createTag(normalizedName, displayName) || undefined;
    }

    if (existingTag) {
      tagIds.push(existingTag.id);
    }
  }

  return tagIds;
}

// Convert database row to Recipe object
function dbRowToRecipe(row: DatabaseRow): Recipe {
  const recipeTags = getRecipeTags(row.slug);

  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    emoji: row.emoji || undefined,
    time: row.prep_time
      ? {
          min: row.prep_time,
          max: row.cook_time || undefined,
        }
      : undefined,
    servings: row.servings || undefined,
    author: row.author,
    userId: row.user_id || undefined,
    tags: recipeTags.map((tag) => tag.name),
    ingredients: JSON.parse(row.ingredients),
    instructions: JSON.parse(row.instructions),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    averageRating: row.average_rating,
    ratingCount: row.rating_count,
    commentCount: row.comment_count,
    isDefault: row.is_default || false,
    isPublic: row.is_public !== undefined ? Boolean(row.is_public) : true,
  };
}

export function getAllRecipes(userId?: string): Recipe[] {
  ensureInitialized();

  if (!queries) {
    console.error("Database not initialized");
    return [];
  }

  try {
    // If no user is provided, only show public recipes
    // If user is provided, show public recipes + user's private recipes
    let query;
    let params: string[] = [];

    if (userId) {
      query = db.prepare(`
        SELECT r.*,
          COALESCE(AVG(rt.rating), 0) as average_rating,
          COUNT(rt.rating) as rating_count,
          COUNT(c.id) as comment_count
        FROM recipes r
        LEFT JOIN recipe_ratings rt ON r.slug = rt.recipe_slug
        LEFT JOIN recipe_comments c ON r.slug = c.recipe_slug
        WHERE r.is_public = 1 OR r.user_id = ?
        GROUP BY r.id
        ORDER BY r.is_default DESC, r.created_at DESC
      `);
      params = [userId];
    } else {
      query = db.prepare(`
        SELECT r.*,
          COALESCE(AVG(rt.rating), 0) as average_rating,
          COUNT(rt.rating) as rating_count,
          COUNT(c.id) as comment_count
        FROM recipes r
        LEFT JOIN recipe_ratings rt ON r.slug = rt.recipe_slug
        LEFT JOIN recipe_comments c ON r.slug = c.recipe_slug
        WHERE r.is_public = 1
        GROUP BY r.id
        ORDER BY r.is_default DESC, r.created_at DESC
      `);
    }

    const rows = query.all(...params) as DatabaseRow[];
    return rows.map(dbRowToRecipe);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  ensureInitialized();

  if (!queries) {
    console.error("Database not initialized");
    return undefined;
  }

  try {
    const query = db.prepare(`
      SELECT r.*,
        COALESCE(AVG(rt.rating), 0) as average_rating,
        COUNT(rt.rating) as rating_count,
        COUNT(c.id) as comment_count
      FROM recipes r
      LEFT JOIN recipe_ratings rt ON r.slug = rt.recipe_slug
      LEFT JOIN recipe_comments c ON r.slug = c.recipe_slug
      WHERE r.slug = ?
      GROUP BY r.id
    `);

    const row = query.get(slug) as DatabaseRow | undefined;
    return row ? dbRowToRecipe(row) : undefined;
  } catch (error) {
    console.error(`Error fetching recipe ${slug}:`, error);
    return undefined;
  }
}

export function addRecipe(recipe: Recipe): Recipe {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

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

    while (queries.recipeExists.get(uniqueSlug)) {
      uniqueSlug = `${recipe.slug}-${counter}`;
      counter++;
    }

    const finalRecipe = { ...recipe, slug: uniqueSlug };

    queries.insertRecipe.run(
      finalRecipe.slug,
      finalRecipe.title,
      finalRecipe.summary || "",
      finalRecipe.emoji || null,
      finalRecipe.time?.min || null,
      finalRecipe.time?.max || null,
      finalRecipe.servings || null,
      finalRecipe.userId || null,
      "[]", // Empty JSON array for backward compatibility
      JSON.stringify(finalRecipe.ingredients),
      JSON.stringify(finalRecipe.instructions),
      finalRecipe.author || "Anonymous",
      0, // is_default = false (user recipe)
      finalRecipe.isPublic !== undefined ? (finalRecipe.isPublic ? 1 : 0) : 1 // Default to public
    );

    // Add tags to the recipe
    const tagIds = getOrCreateTagIds(finalRecipe.tags);
    setRecipeTags(finalRecipe.slug, tagIds);

    console.log(`✅ Recipe ${finalRecipe.slug} added successfully`);
    return finalRecipe;
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw new Error("Failed to add recipe");
  }
}

export function updateRecipe(
  slug: string,
  updatedRecipe: Omit<Recipe, "slug">
): Recipe | null {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  const validation = RecipeInputSchema.safeParse(updatedRecipe);
  if (!validation.success) {
    throw new Error(
      `Invalid recipe update data: ${JSON.stringify(validation.error.format())}`
    );
  }

  try {
    const existingRecipe = queries.getRecipeBySlug.get(slug) as
      | DatabaseRow
      | undefined;
    if (!existingRecipe) {
      return null;
    }

    // Don't allow updating default recipes
    if (existingRecipe.is_default) {
      throw new Error("Cannot update default recipes");
    }

    const result = queries.updateRecipe.run(
      updatedRecipe.title,
      updatedRecipe.summary || "",
      updatedRecipe.emoji || null,
      updatedRecipe.time?.min || null,
      updatedRecipe.time?.max || null,
      updatedRecipe.servings || null,
      "[]", // Empty JSON array for backward compatibility
      JSON.stringify(updatedRecipe.ingredients),
      JSON.stringify(updatedRecipe.instructions),
      updatedRecipe.author || "Anonymous",
      slug
    );

    if (result.changes === 0) {
      return null;
    }

    // Update tags for the recipe
    const tagIds = getOrCreateTagIds(updatedRecipe.tags);
    setRecipeTags(slug, tagIds);

    console.log(`✅ Recipe ${slug} updated successfully`);
    return { ...updatedRecipe, slug };
  } catch (error) {
    console.error(`Error updating recipe ${slug}:`, error);
    return null;
  }
}

export function deleteRecipe(slug: string): boolean {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const result = queries.deleteRecipe.run(slug);
    const success = result.changes > 0;

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
export function getCustomRecipes(): Recipe[] {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const rows = queries.getAllRecipes.all() as DatabaseRow[];
    return rows.filter((row) => !row.is_default).map(dbRowToRecipe);
  } catch (error) {
    console.error("Error fetching custom recipes:", error);
    return [];
  }
}

export function getDefaultRecipes(): Recipe[] {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const rows = queries.getAllRecipes.all() as DatabaseRow[];
    return rows.filter((row) => row.is_default).map(dbRowToRecipe);
  } catch (error) {
    console.error("Error fetching default recipes:", error);
    return [];
  }
}

export function getRecipeStats() {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const all = queries.getAllRecipes.all() as DatabaseRow[];
    const defaultCount = all.filter((row) => row.is_default).length;
    const customCount = all.filter((row) => !row.is_default).length;

    return {
      total: all.length,
      default: defaultCount,
      custom: customCount,
    };
  } catch (error) {
    console.error("Error fetching recipe stats:", error);
    return { total: 0, default: 0, custom: 0 };
  }
}

// Rating functions
export function getUserRating(
  recipeSlug: string,
  userIp: string
): number | null {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const result = queries.getUserRating.get(recipeSlug, userIp) as
      | { rating: number }
      | undefined;
    return result ? result.rating : null;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
  }
}

export function addOrUpdateRating(
  recipeSlug: string,
  rating: number,
  userIp: string
): boolean {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const existingRating = getUserRating(recipeSlug, userIp);

    if (existingRating !== null) {
      // Update existing rating
      const result = queries.updateRating.run(rating, recipeSlug, userIp);
      return result.changes > 0;
    } else {
      // Insert new rating
      const result = queries.insertRating.run(recipeSlug, rating, userIp);
      return result.changes > 0;
    }
  } catch (error) {
    console.error("Error adding/updating rating:", error);
    return false;
  }
}

// Comment functions

export function getRecipeComments(recipeSlug: string): RecipeComment[] {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const rows = queries.getRecipeComments.all(recipeSlug) as Array<{
      id: number;
      author_name: string;
      comment: string;
      created_at: string;
      user_id: string | null;
    }>;

    return rows.map((row) => ({
      id: row.id,
      authorName: row.author_name,
      comment: row.comment,
      createdAt: row.created_at,
      userId: row.user_id || undefined,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export function addComment(
  recipeSlug: string,
  authorName: string,
  comment: string,
  userIp: string,
  userId?: string
): boolean {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  const validation = CommentSchema.safeParse({ authorName, comment });
  if (!validation.success) {
    throw new Error(
      `Invalid comment data: ${JSON.stringify(validation.error.format())}`
    );
  }

  try {
    const result = queries.insertComment.run(
      recipeSlug,
      authorName,
      comment,
      userIp,
      userId || null
    );
    return result.changes > 0;
  } catch (error) {
    console.error("Error adding comment:", error);
    return false;
  }
}

export function updateComment(
  commentId: number,
  newComment: string,
  userId: string
): boolean {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    const result = queries.updateComment.run(newComment, commentId, userId);
    return result.changes > 0;
  } catch (error) {
    console.error("Error updating comment:", error);
    return false;
  }
}

// Get latest recipes (newest first)
export function getLatestRecipes(limit: number = 10): Recipe[] {
  ensureInitialized();

  if (!queries) {
    console.error("Database not initialized");
    return [];
  }

  try {
    const query = db.prepare(`
      SELECT r.*,
        COALESCE(AVG(rt.rating), 0) as average_rating,
        COUNT(rt.rating) as rating_count,
        COUNT(c.id) as comment_count
      FROM recipes r
      LEFT JOIN recipe_ratings rt ON r.slug = rt.recipe_slug
      LEFT JOIN recipe_comments c ON r.slug = c.recipe_slug
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT ?
    `);

    const rows = query.all(limit) as DatabaseRow[];
    return rows.map(dbRowToRecipe);
  } catch (error) {
    console.error("Error fetching latest recipes:", error);
    return [];
  }
}

// Get trendy recipes (highest rated with minimum ratings)
export function getTrendyRecipes(
  limit: number = 10,
  minRatings: number = 3
): Recipe[] {
  ensureInitialized();

  if (!queries) {
    console.error("Database not initialized");
    return [];
  }

  try {
    const query = db.prepare(`
      SELECT r.*,
        AVG(rt.rating) as average_rating,
        COUNT(rt.rating) as rating_count,
        COUNT(c.id) as comment_count
      FROM recipes r
      LEFT JOIN recipe_ratings rt ON r.slug = rt.recipe_slug
      LEFT JOIN recipe_comments c ON r.slug = c.recipe_slug
      GROUP BY r.id
      HAVING COUNT(rt.rating) >= ? AND AVG(rt.rating) >= 4.0
      ORDER BY AVG(rt.rating) DESC, COUNT(rt.rating) DESC
      LIMIT ?
    `);

    const rows = query.all(minRatings, limit) as DatabaseRow[];
    return rows.map(dbRowToRecipe);
  } catch (error) {
    console.error("Error fetching trendy recipes:", error);
    return [];
  }
}

export function updateRecipeRating(
  recipeSlug: string,
  rating: number,
  userIp?: string
): boolean {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  const validation = RatingSchema.safeParse({ rating });
  if (!validation.success) {
    throw new Error(
      `Invalid rating data: ${JSON.stringify(validation.error.format())}`
    );
  }

  try {
    // Use a simple user identification for now (in production, use proper user auth)
    const userId = userIp || "anonymous";

    const success = addOrUpdateRating(recipeSlug, rating, userId);

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
