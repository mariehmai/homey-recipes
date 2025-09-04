import { db } from "~/utils/db.server";

export type Tag = {
  id: string;
  name: string;
  displayName: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

function transformTag(tag: {
  id: string;
  name: string;
  displayName: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}): Tag {
  return {
    id: tag.id,
    name: tag.name,
    displayName: tag.displayName,
    isDefault: tag.isDefault,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt || undefined,
    deletedAt: tag.deletedAt || undefined,
  };
}

export async function getAllTags(): Promise<Tag[]> {
  const tags = await db.tag.findMany({
    where: { deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  return tags.map(transformTag);
}

export async function getTagByName(name: string): Promise<Tag | null> {
  const tag = await db.tag.findFirst({
    where: {
      name: name.toLowerCase(),
      deletedAt: null,
    },
  });

  return tag ? transformTag(tag) : null;
}

export async function createTag(
  name: string,
  displayName: string,
  isDefault = false
): Promise<Tag | null> {
  try {
    const tag = await db.tag.create({
      data: {
        name: name.toLowerCase(),
        displayName,
        isDefault,
      },
    });

    return transformTag(tag);
  } catch (error) {
    // Handle unique constraint violation
    return null;
  }
}

export async function getRecipeTags(recipeId: string): Promise<Tag[]> {
  const recipeTags = await db.recipeTag.findMany({
    where: {
      recipeId,
      deletedAt: null,
    },
    include: {
      tag: true,
    },
  });

  return recipeTags
    .filter((rt) => rt.tag && !rt.tag.deletedAt)
    .map((rt) => transformTag(rt.tag));
}

export async function setRecipeTags(
  recipeId: string,
  tagNames: string[]
): Promise<void> {
  // Remove existing tags
  await db.recipeTag.updateMany({
    where: { recipeId },
    data: { deletedAt: new Date() },
  });

  // Add new tags
  for (const tagName of tagNames) {
    const normalizedName = tagName.toLowerCase().trim();
    if (!normalizedName) continue;

    // Get or create tag
    let tag = await db.tag.findFirst({
      where: { name: normalizedName },
    });

    if (!tag) {
      tag = await db.tag.create({
        data: {
          name: normalizedName,
          displayName: tagName.trim(),
          isDefault: false,
        },
      });
    }

    // Create recipe-tag relation
    await db.recipeTag.create({
      data: {
        recipeId,
        tagId: tag.id,
      },
    });
  }
}
