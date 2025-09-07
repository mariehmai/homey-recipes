import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { RecipeInputSchema } from "~/models";
import { getAllRecipes, addRecipe } from "~/utils/recipe-storage.server";
import type { Recipe } from "~/utils/recipes";

export const loader: LoaderFunction = async () => {
  const recipes = await getAllRecipes();
  return json(recipes);
};

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;

  switch (method) {
    case "POST": {
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

        const recipe = validation.data as Recipe;
        const newRecipe = await addRecipe(recipe);
        return json(newRecipe, { status: 201 });
      } catch (error) {
        return json({ error: "Invalid JSON data" }, { status: 400 });
      }
    }

    default:
      return json({ error: "Method not allowed" }, { status: 405 });
  }
};
