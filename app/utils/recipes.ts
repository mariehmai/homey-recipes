export type Tag =
  | "sweet"
  | "dessert"
  | "savory"
  | "bbq"
  | "soup"
  | "quick"
  | "spicy"
  | "appetizer";

type Ingredient = {
  unit: "n" | "g" | "kg" | "mL" | "L" | "tsp" | "tbsp" | "cup";
  name: string;
  quantity: string | number;
};

type Instruction = {
  description: string;
};

type Time = {
  min: number;
  max?: number;
};

export type Recipe = {
  slug: string;
  title: string;
  summary?: string;
  emoji?: string;
  time?: Time;
  servings?: number;
  author?: string;
  instructions: Instruction[];
  ingredients: Ingredient[];
  tags: Tag[];
  createdAt?: string;
  updatedAt?: string;
  averageRating?: number;
  ratingCount?: number;
  commentCount?: number;
  isDefault?: boolean;
};

export type RecipeComment = {
  id: number;
  authorName: string;
  comment: string;
  createdAt: string;
};

export type RecipeRating = {
  rating: number;
  averageRating: number;
  ratingCount: number;
};

// Client-side recipe utilities
export async function getAllRecipes(): Promise<Recipe[]> {
  if (typeof window === "undefined") {
    // Server-side: import from server storage
    const { getAllRecipes } = await import("~/utils/recipe-storage.server");
    return getAllRecipes();
  }

  // Client-side: fetch from API
  try {
    const response = await fetch("/api/recipes");
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }
}

export async function saveCustomRecipe(recipe: Recipe): Promise<Recipe | null> {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      throw new Error("Failed to save recipe");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to save recipe:", error);
    return null;
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  if (typeof window === "undefined") {
    // Server-side: import from server storage
    const { getRecipeBySlug } = await import("~/utils/recipe-storage.server");
    return getRecipeBySlug(slug) || null;
  }

  // Client-side: fetch from API
  try {
    const response = await fetch(`/api/recipes/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch recipe");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    return null;
  }
}

export async function updateRecipe(
  slug: string,
  recipe: Omit<Recipe, "slug">
): Promise<Recipe | null> {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch(`/api/recipes/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      throw new Error("Failed to update recipe");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update recipe:", error);
    return null;
  }
}

export async function deleteRecipe(slug: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const response = await fetch(`/api/recipes/${slug}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to delete recipe:", error);
    return false;
  }
}
