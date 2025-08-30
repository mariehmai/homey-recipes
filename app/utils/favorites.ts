// Favorites management utilities using localStorage

const FAVORITES_KEY = "homey-recipes-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
}

export function addToFavorites(recipeSlug: string): void {
  if (typeof window === "undefined") return;

  try {
    const favorites = getFavorites();
    if (!favorites.includes(recipeSlug)) {
      const newFavorites = [...favorites, recipeSlug];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
  }
}

export function removeFromFavorites(recipeSlug: string): void {
  if (typeof window === "undefined") return;

  try {
    const favorites = getFavorites();
    const newFavorites = favorites.filter((slug) => slug !== recipeSlug);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error("Error removing from favorites:", error);
  }
}

export function isFavorite(recipeSlug: string): boolean {
  if (typeof window === "undefined") return false;

  const favorites = getFavorites();
  return favorites.includes(recipeSlug);
}

export function toggleFavorite(recipeSlug: string): boolean {
  const isCurrentlyFavorite = isFavorite(recipeSlug);

  if (isCurrentlyFavorite) {
    removeFromFavorites(recipeSlug);
    return false;
  } else {
    addToFavorites(recipeSlug);
    return true;
  }
}
