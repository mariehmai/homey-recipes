import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { RecipeInputSchema } from "~/models";
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
      try {
        const rawData = await request.json();
        const validation = RecipeInputSchema.safeParse(rawData);

        if (!validation.success) {
          return json(
            {
              error: "Invalid recipe data",
              details: validation.error.format(),
            },
            { status: 400 }
          );
        }

        const updatedRecipeData = validation.data as Omit<Recipe, "slug">;
        const updatedRecipe = updateRecipe(slug, updatedRecipeData);

        if (!updatedRecipe) {
          return json({ error: "Recipe not found" }, { status: 404 });
        }

        return json(updatedRecipe);
      } catch (error) {
        return json({ error: "Invalid JSON data" }, { status: 400 });
      }
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
