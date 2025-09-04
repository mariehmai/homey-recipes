import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getAllRecipes } from "~/utils/recipe-storage.server";
import { getAllTags } from "~/utils/tag-storage.server";

export const loader: LoaderFunction = async () => {
  try {
    const tags = getAllTags();
    const recipes = getAllRecipes();

    // Popular recipe categories commonly found on recipe websites
    const popularTagNames = [
      "quick",
      "sweet",
      "savory",
      "soup",
      "dessert",
      "appetizer",
      "vegan",
      "spicy",
      "bbq",
    ];

    // Get popular categories with recipe counts
    const popularCategories = tags
      .filter((tag) => popularTagNames.includes(tag.name))
      .map((tag) => ({
        id: tag.name,
        name: tag.display_name,
        count: recipes.filter((r) => r.tags.includes(tag.name)).length,
      }))
      .filter((category) => category.count > 0) // Only show categories that have recipes
      .sort((a, b) => b.count - a.count) // Sort by recipe count descending
      .slice(0, 6); // Limit to 6 for footer

    return json(popularCategories);
  } catch (error) {
    console.error("Error fetching popular categories:", error);
    return json([]);
  }
};
