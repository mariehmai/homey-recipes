// Client-side rating utilities - API calls to database
export interface UserRating {
  recipeSlug: string;
  rating: number; // 1-5 stars
  timestamp: string;
}

export interface RatingStats {
  averageRating: number;
  ratingCount: number;
}

// Get user's rating for a specific recipe via API
export async function getUserRatingForRecipe(
  recipeSlug: string
): Promise<number | null> {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch(`/api/ratings/${recipeSlug}/user`);
    if (!response.ok) {
      if (response.status === 404) return null; // No rating found
      throw new Error("Failed to fetch user rating");
    }
    const data = await response.json();
    return data.rating || null;
  } catch (error) {
    console.error("Failed to load user rating:", error);
    return null;
  }
}

// Get rating statistics for a recipe via API
export async function getRatingStats(recipeSlug: string): Promise<RatingStats> {
  if (typeof window === "undefined")
    return { averageRating: 0, ratingCount: 0 };

  try {
    const response = await fetch(`/api/ratings/${recipeSlug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch rating stats");
    }
    const data = await response.json();
    return {
      averageRating: data.averageRating || 0,
      ratingCount: data.ratingCount || 0,
    };
  } catch (error) {
    console.error("Failed to load rating stats:", error);
    return { averageRating: 0, ratingCount: 0 };
  }
}

// Rate a recipe via API (updates existing rating or creates new one)
export async function rateRecipe(
  recipeSlug: string,
  rating: number
): Promise<RatingStats | null> {
  if (rating < 1 || rating > 5) {
    console.error("Rating must be between 1 and 5");
    return null;
  }

  if (typeof window === "undefined") return null;

  try {
    const response = await fetch(`/api/ratings/${recipeSlug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      throw new Error("Failed to save rating");
    }

    const data = await response.json();
    return {
      averageRating: data.averageRating || 0,
      ratingCount: data.ratingCount || 0,
    };
  } catch (error) {
    console.error("Failed to rate recipe:", error);
    return null;
  }
}

// Remove user's rating for a recipe via API
export async function removeRating(recipeSlug: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const response = await fetch(`/api/ratings/${recipeSlug}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to remove rating:", error);
    return false;
  }
}
