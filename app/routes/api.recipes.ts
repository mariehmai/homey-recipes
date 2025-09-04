import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  getAllRecipes,
  createRecipe,
} from "~/services/recipe.server";
import type { CreateRecipeFormData } from "~/utils/validation.server";

export const loader: LoaderFunction = async () => {
  const recipes = await getAllRecipes();
  return json(recipes);
};

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;

  switch (method) {
    case "POST": {
      const recipeData: CreateRecipeFormData = await request.json();
      const newRecipe = await createRecipe(recipeData);
      return json(newRecipe, { status: 201 });
    }

    default:
      return json({ error: "Method not allowed" }, { status: 405 });
  }
};
