import { db } from "~/utils/db.server";

export type RecipeComment = {
  id: string;
  authorName: string;
  comment: string;
  userIp: string;
  authorId?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export async function getRecipeComments(
  recipeSlug: string
): Promise<RecipeComment[]> {
  try {
    const recipe = await db.recipe.findUnique({
      where: { slug: recipeSlug },
    });

    if (!recipe) return [];

    const comments = await db.recipeComment.findMany({
      where: {
        recipeId: recipe.id,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return comments.map((comment) => ({
      id: comment.id,
      authorName: comment.authorName,
      comment: comment.comment,
      userIp: comment.userIp,
      authorId: comment.authorId || undefined,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt || undefined,
      deletedAt: comment.deletedAt || undefined,
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
): Promise<RecipeComment | null> {
  try {
    const recipe = await db.recipe.findUnique({
      where: { slug: recipeSlug },
    });

    if (!recipe) return null;

    const newComment = await db.recipeComment.create({
      data: {
        recipeId: recipe.id,
        authorName,
        comment,
        userIp,
        authorId: userId || null,
      },
    });

    return {
      id: newComment.id,
      authorName: newComment.authorName,
      comment: newComment.comment,
      userIp: newComment.userIp,
      authorId: newComment.authorId || undefined,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt || undefined,
      deletedAt: newComment.deletedAt || undefined,
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
}

export async function updateComment(
  commentId: string,
  newComment: string,
  userId: string
): Promise<boolean> {
  try {
    const result = await db.recipeComment.updateMany({
      where: {
        id: commentId,
        authorId: userId,
        deletedAt: null,
      },
      data: { comment: newComment },
    });

    return result.count > 0;
  } catch (error) {
    console.error("Error updating comment:", error);
    return false;
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    await db.recipeComment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}
