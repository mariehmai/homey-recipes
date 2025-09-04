import { queries, initializeDatabase } from "./db.server";

let isInitialized = false;

function ensureInitialized() {
  if (!isInitialized) {
    initializeDatabase();
    isInitialized = true;
  }
}

export interface Tag {
  id: number;
  name: string;
  display_name: string;
  is_default: boolean;
  created_at: string;
}

export function getAllTags(): Tag[] {
  ensureInitialized();

  if (!queries) {
    console.error("Database not initialized");
    return [];
  }

  try {
    const rows = queries.getAllTags.all() as Tag[];
    return rows;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export function getRecipeTags(recipeSlug: string): Tag[] {
  ensureInitialized();

  if (!queries) {
    console.error("Database not initialized");
    return [];
  }

  try {
    const rows = queries.getRecipeTags.all(recipeSlug) as Tag[];
    return rows;
  } catch (error) {
    console.error(`Error fetching tags for recipe ${recipeSlug}:`, error);
    return [];
  }
}

export function createTag(name: string, displayName?: string): Tag | null {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    // Always lowercase the tag name for consistency
    const normalizedName = name.toLowerCase().trim();
    // Use provided displayName or create one from normalized name
    const finalDisplayName = displayName || normalizedName;

    const result = queries.insertTag.run(normalizedName, finalDisplayName, 0); // is_default = false (custom tag)

    if (result.lastInsertRowid) {
      const allTags = getAllTags();
      const newTag = allTags.find(
        (t) => t.id === Number(result.lastInsertRowid)
      );
      return newTag || null;
    }

    return null;
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  }
}

export function findOrCreateTag(name: string): Tag | null {
  ensureInitialized();

  // Always normalize tag name to lowercase
  const normalizedName = name.toLowerCase().trim();

  // Check if tag already exists
  const existingTags = getAllTags();
  const existingTag = existingTags.find((tag) => tag.name === normalizedName);

  if (existingTag) {
    return existingTag;
  }

  // Create new tag if it doesn't exist
  return createTag(normalizedName);
}

export function setRecipeTags(recipeSlug: string, tagIds: number[]): boolean {
  ensureInitialized();

  if (!queries) {
    throw new Error("Database not initialized");
  }

  try {
    // Clear existing tags
    queries.clearRecipeTags.run(recipeSlug);

    // Add new tags
    for (const tagId of tagIds) {
      queries.addTagToRecipe.run(recipeSlug, tagId);
    }

    return true;
  } catch (error) {
    console.error(`Error setting tags for recipe ${recipeSlug}:`, error);
    return false;
  }
}
