import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug required" }, { status: 400 });
  }

  try {
    // Get recipe by slug
    const recipe = await db.recipe.findUnique({
      where: { slug, deletedAt: null },
    });

    if (!recipe) {
      return json({ error: "Recipe not found" }, { status: 404 });
    }

    // Get rating stats
    const ratings = await db.recipeRating.findMany({
      where: {
        recipeId: recipe.id,
        deletedAt: null,
      },
      select: { rating: true },
    });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return json({
      averageRating,
      ratingCount: ratings.length,
    });
  } catch (error) {
    console.error("Error fetching rating stats:", error);
    return json({ error: "Failed to fetch rating stats" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug required" }, { status: 400 });
  }

  if (request.method === "POST") {
    try {
      const { rating } = await request.json();

      if (!rating || rating < 1 || rating > 5) {
        return json(
          { error: "Rating must be between 1 and 5" },
          { status: 400 }
        );
      }

      // Get recipe by slug
      const recipe = await db.recipe.findUnique({
        where: { slug, deletedAt: null },
      });

      if (!recipe) {
        return json({ error: "Recipe not found" }, { status: 404 });
      }

      // Get user IP for anonymous rating tracking
      const userIp =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";

      // Check if authenticated user
      const user = await authenticator.isAuthenticated(request);

      // Create or update rating
      await db.recipeRating.upsert({
        where: {
          recipeId_userIp: {
            recipeId: recipe.id,
            userIp: userIp,
          },
        },
        update: {
          rating,
          authorId: user?.id,
        },
        create: {
          recipeId: recipe.id,
          rating,
          userIp,
          authorId: user?.id,
        },
      });

      // Get updated rating stats
      const ratings = await db.recipeRating.findMany({
        where: {
          recipeId: recipe.id,
          deletedAt: null,
        },
        select: { rating: true },
      });

      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return json({
        averageRating,
        ratingCount: ratings.length,
      });
    } catch (error) {
      console.error("Error saving rating:", error);
      return json({ error: "Failed to save rating" }, { status: 500 });
    }
  }

  if (request.method === "DELETE") {
    try {
      // Get user IP for anonymous rating tracking
      const userIp =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";

      // Get recipe by slug
      const recipe = await db.recipe.findUnique({
        where: { slug, deletedAt: null },
      });

      if (!recipe) {
        return json({ error: "Recipe not found" }, { status: 404 });
      }

      // Soft delete rating
      await db.recipeRating.updateMany({
        where: {
          recipeId: recipe.id,
          userIp: userIp,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return json({ success: true });
    } catch (error) {
      console.error("Error removing rating:", error);
      return json({ error: "Failed to remove rating" }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
