import { queries, initializeDatabase } from "./db.server";
import type { Recipe } from "./recipes";
import { seedDefaultRecipes } from "./seed.server";

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
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  tags: string;
  ingredients: string;
  instructions: string;
  is_default?: boolean;
}

// Convert database row to Recipe object
function dbRowToRecipe(row: DatabaseRow): Recipe {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    time: row.prep_time
      ? {
          min: row.prep_time,
          max: row.cook_time || undefined,
        }
      : undefined,
    servings: row.servings || undefined,
    tags: JSON.parse(row.tags || "[]"),
    ingredients: JSON.parse(row.ingredients),
    instructions: JSON.parse(row.instructions),
  };
}

export function getAllRecipes(): Recipe[] {
  ensureInitialized();

  if (!queries) {
    console.error("Database not initialized");
    return [];
  }

  try {
    const rows = queries.getAllRecipes.all() as DatabaseRow[];
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
    const row = queries.getRecipeBySlug.get(slug) as DatabaseRow | undefined;
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
      finalRecipe.time?.min || null,
      finalRecipe.time?.max || null,
      finalRecipe.servings || null,
      JSON.stringify(finalRecipe.tags),
      JSON.stringify(finalRecipe.ingredients),
      JSON.stringify(finalRecipe.instructions),
      0 // is_default = false (user recipe)
    );

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
      updatedRecipe.time?.min || null,
      updatedRecipe.time?.max || null,
      updatedRecipe.servings || null,
      JSON.stringify(updatedRecipe.tags),
      JSON.stringify(updatedRecipe.ingredients),
      JSON.stringify(updatedRecipe.instructions),
      slug
    );

    if (result.changes === 0) {
      return null;
    }

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
