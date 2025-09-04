import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  getRecipeBySlug,
  updateRecipe,
  deleteRecipe,
} from "~/services/recipe.server";
import { authenticator } from "~/utils/auth.server";
import { UpdateRecipeSchema } from "~/utils/validation.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug required" }, { status: 400 });
  }

  try {
    const user = await authenticator.isAuthenticated(request);
    const recipe = await getRecipeBySlug(slug, user?.id);

    if (!recipe) {
      return json({ error: "Recipe not found" }, { status: 404 });
    }

    return json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return json({ error: "Failed to fetch recipe" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return json({ error: "Recipe slug required" }, { status: 400 });
  }

  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return json({ error: "Authentication required" }, { status: 401 });
  }

  if (request.method === "PUT" || request.method === "PATCH") {
    try {
      const data = await request.json();

      // Validate the data
      const parseResult = UpdateRecipeSchema.safeParse(data);
      if (!parseResult.success) {
        return json(
          { error: "Invalid data", details: parseResult.error },
          { status: 400 }
        );
      }

      // Get the recipe to check ownership
      const existingRecipe = await getRecipeBySlug(slug, user.id);
      if (!existingRecipe) {
        return json({ error: "Recipe not found" }, { status: 404 });
      }

      if (existingRecipe.authorId !== user.id && !existingRecipe.isDefault) {
        return json(
          { error: "Not authorized to edit this recipe" },
          { status: 403 }
        );
      }

      const updatedRecipe = await updateRecipe(
        existingRecipe.id,
        parseResult.data,
        user.id
      );

      if (!updatedRecipe) {
        return json({ error: "Failed to update recipe" }, { status: 500 });
      }

      return json(updatedRecipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : error
      );
      return json(
        {
          error: "Failed to update recipe",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }

  if (request.method === "DELETE") {
    try {
      // Get the recipe to check ownership
      const existingRecipe = await getRecipeBySlug(slug, user.id);
      if (!existingRecipe) {
        return json({ error: "Recipe not found" }, { status: 404 });
      }

      if (existingRecipe.authorId !== user.id) {
        return json(
          { error: "Not authorized to delete this recipe" },
          { status: 403 }
        );
      }

      if (existingRecipe.isDefault) {
        return json(
          { error: "Cannot delete default recipes" },
          { status: 403 }
        );
      }

      const success = await deleteRecipe(existingRecipe.id, user.id);

      if (!success) {
        return json({ error: "Failed to delete recipe" }, { status: 500 });
      }

      return json({ success: true });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return json({ error: "Failed to delete recipe" }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
