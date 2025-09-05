import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { RatingSchema } from "~/models";
import {
  getRecipeBySlug,
  updateRecipeRating,
} from "~/utils/recipe-storage.server";

// GET /api/ratings/:slug - Get rating stats for a recipe
export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug is required" }, { status: 400 });
  }

  try {
    const recipe = getRecipeBySlug(slug);
    if (!recipe) {
      return json({ error: "Recipe not found" }, { status: 404 });
    }

    return json({
      averageRating: recipe.averageRating || 0,
      ratingCount: recipe.ratingCount || 0,
    });
  } catch (error) {
    console.error("Failed to get rating stats:", error);
    return json({ error: "Failed to get rating stats" }, { status: 500 });
  }
};

// POST /api/ratings/:slug - Submit a rating for a recipe
export const action: ActionFunction = async ({ request, params }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug is required" }, { status: 400 });
  }

  const userIp = request.headers.get("x-forwarded-for") || "anonymous";

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const validation = RatingSchema.safeParse(body);

      if (!validation.success) {
        return json(
          { error: "Invalid rating data", details: validation.error.format() },
          { status: 400 }
        );
      }

      const { rating } = validation.data;

      const recipe = getRecipeBySlug(slug);
      if (!recipe) {
        return json({ error: "Recipe not found" }, { status: 404 });
      }

      const success = updateRecipeRating(slug, rating, userIp);

      if (!success) {
        return json({ error: "Failed to save rating" }, { status: 500 });
      }

      // Get updated recipe to return current stats
      const updatedRecipe = getRecipeBySlug(slug);

      return json({
        success: true,
        averageRating: updatedRecipe?.averageRating || 0,
        ratingCount: updatedRecipe?.ratingCount || 0,
      });
    } catch (error) {
      console.error("Failed to submit rating:", error);
      return json({ error: "Failed to submit rating" }, { status: 500 });
    }
  } else if (request.method === "DELETE") {
    // Remove rating
    try {
      // TODO: Implement removeRating function in recipe-storage.server.ts
      // For now, we'll return a not implemented error
      return json(
        { error: "Delete rating not yet implemented" },
        { status: 501 }
      );
    } catch (error) {
      console.error("Failed to delete rating:", error);
      return json({ error: "Failed to delete rating" }, { status: 500 });
    }
  } else {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
};
