import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  getRecipeBySlug,
  updateRecipe,
  deleteRecipe,
} from "~/utils/recipe-storage.server";
import type { Recipe } from "~/utils/recipes";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug is required" }, { status: 400 });
  }

  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    return json({ error: "Recipe not found" }, { status: 404 });
  }

  return json(recipe);
};

export const action: ActionFunction = async ({ request, params }) => {
  const { slug } = params;
  const method = request.method;

  if (!slug) {
    return json({ error: "Recipe slug is required" }, { status: 400 });
  }

  switch (method) {
    case "PUT": {
      const updatedRecipeData: Omit<Recipe, "slug"> = await request.json();
      const updatedRecipe = updateRecipe(slug, updatedRecipeData);

      if (!updatedRecipe) {
        return json({ error: "Recipe not found" }, { status: 404 });
      }

      return json(updatedRecipe);
    }

    case "DELETE": {
      const deleted = deleteRecipe(slug);

      if (!deleted) {
        return json({ error: "Recipe not found" }, { status: 404 });
      }

      return json({ success: true });
    }

    default:
      return json({ error: "Method not allowed" }, { status: 405 });
  }
};
