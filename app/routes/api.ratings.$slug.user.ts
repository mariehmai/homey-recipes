import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { slug } = params;
  
  if (!slug) {
    return json({ error: "Recipe slug required" }, { status: 400 });
  }

  try {
    // Get user IP for anonymous rating tracking
    const userIp = request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   "127.0.0.1";

    // Get recipe by slug
    const recipe = await db.recipe.findUnique({
      where: { slug, deletedAt: null },
    });

    if (!recipe) {
      return json({ error: "Recipe not found" }, { status: 404 });
    }

    // Find user's rating by IP (works for both anonymous and authenticated users)
    const userRating = await db.recipeRating.findFirst({
      where: {
        recipeId: recipe.id,
        userIp: userIp,
        deletedAt: null,
      },
      select: { rating: true }
    });

    return json({ rating: userRating?.rating || null });
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return json(null, { status: 500 });
  }
};