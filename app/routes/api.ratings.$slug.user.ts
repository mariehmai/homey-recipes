import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getUserRating } from "~/utils/recipe-storage.server";

// GET /api/ratings/:slug/user - Get user's rating for a recipe
export const loader: LoaderFunction = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug is required" }, { status: 400 });
  }

  try {
    // Get user IP for simple user identification (in production, use proper user auth)
    const userIp = request.headers.get("x-forwarded-for") || "anonymous";

    const rating = getUserRating(slug, userIp);

    if (rating === null) {
      return json({ error: "No rating found" }, { status: 404 });
    }

    return json({ rating });
  } catch (error) {
    console.error("Failed to get user rating:", error);
    return json({ error: "Failed to get user rating" }, { status: 500 });
  }
};
