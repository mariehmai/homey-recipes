import { TagSchema } from "~/models";

import { db } from "./db.server";

export interface Tag {
  id: number;
  name: string;
  display_name: string;
  is_default: boolean;
  created_at: string;
}

export async function getAllTags(): Promise<Tag[]> {
  try {
    const tags = await db.tag.findMany({
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      display_name: tag.displayName,
      is_default: tag.isDefault,
      created_at: tag.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getRecipeTags(recipeSlug: string): Promise<Tag[]> {
  try {
    const recipeTags = await db.recipeTag.findMany({
      where: { recipeSlug },
      include: {
        tag: true,
      },
      orderBy: {
        tag: {
          name: "asc",
        },
      },
    });

    return recipeTags.map((rt) => ({
      id: rt.tag.id,
      name: rt.tag.name,
      display_name: rt.tag.displayName,
      is_default: rt.tag.isDefault,
      created_at: rt.tag.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error(`Error fetching tags for recipe ${recipeSlug}:`, error);
    return [];
  }
}

export async function createTag(
  name: string,
  displayName?: string
): Promise<Tag | null> {
  // Always lowercase the tag name for consistency
  const normalizedName = name.toLowerCase().trim();
  // Use provided displayName or create one from normalized name
  const finalDisplayName = displayName || normalizedName;

  const validation = TagSchema.safeParse({
    name: normalizedName,
    displayName: finalDisplayName,
    isDefault: false,
  });
  if (!validation.success) {
    throw new Error(
      `Invalid tag data: ${JSON.stringify(validation.error.flatten())}`
    );
  }

  try {
    const tag = await db.tag.create({
      data: {
        name: normalizedName,
        displayName: finalDisplayName,
        isDefault: false,
      },
    });

    return {
      id: tag.id,
      name: tag.name,
      display_name: tag.displayName,
      is_default: tag.isDefault,
      created_at: tag.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  }
}

export async function findOrCreateTag(name: string): Promise<Tag | null> {
  // Always normalize tag name to lowercase
  const normalizedName = name.toLowerCase().trim();

  try {
    // Check if tag already exists
    const existingTag = await db.tag.findUnique({
      where: { name: normalizedName },
    });

    if (existingTag) {
      return {
        id: existingTag.id,
        name: existingTag.name,
        display_name: existingTag.displayName,
        is_default: existingTag.isDefault,
        created_at: existingTag.createdAt.toISOString(),
      };
    }

    // Create new tag if it doesn't exist
    return await createTag(normalizedName);
  } catch (error) {
    console.error("Error finding or creating tag:", error);
    return null;
  }
}

export async function setRecipeTags(
  recipeSlug: string,
  tagIds: number[]
): Promise<boolean> {
  try {
    // Clear existing tags
    await db.recipeTag.deleteMany({
      where: { recipeSlug },
    });

    // Add new tags
    if (tagIds.length > 0) {
      await db.recipeTag.createMany({
        data: tagIds.map((tagId) => ({
          recipeSlug,
          tagId,
        })),
      });
    }

    return true;
  } catch (error) {
    console.error(`Error setting tags for recipe ${recipeSlug}:`, error);
    return false;
  }
}
