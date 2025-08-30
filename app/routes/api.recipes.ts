import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getAllRecipes, addRecipe } from "~/utils/recipe-storage.server";
import type { Recipe } from "~/utils/recipes";

export const loader: LoaderFunction = async () => {
  const recipes = getAllRecipes();
  return json(recipes);
};

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;

  switch (method) {
    case "POST": {
      const recipe: Recipe = await request.json();
      const newRecipe = addRecipe(recipe);
      return json(newRecipe, { status: 201 });
    }

    default:
      return json({ error: "Method not allowed" }, { status: 405 });
  }
};