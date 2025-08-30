import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import { addRecipe } from "~/utils/recipe-storage.server";
import type { Recipe, Tag } from "~/utils/recipes";

export const meta: MetaFunction = () => {
  return [{ title: "Add New Recipe" }];
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const prepTime = formData.get("prepTime") as string;
  const cookTime = formData.get("cookTime") as string;
  const servings = formData.get("servings") as string;
  const tags = formData.getAll("tags") as string[];

  // Parse ingredients
  const ingredients = [];
  const ingredientNames = formData.getAll("ingredientName");
  const ingredientQuantities = formData.getAll("ingredientQuantity");
  const ingredientUnits = formData.getAll("ingredientUnit");

  for (let i = 0; i < ingredientNames.length; i++) {
    const name = ingredientNames[i] as string;
    const quantity = ingredientQuantities[i] as string;
    const unit = ingredientUnits[i] as string;

    if (name && quantity) {
      ingredients.push({
        name: name.trim(),
        quantity: quantity.trim(),
        unit: unit as Recipe["ingredients"][0]["unit"],
      });
    }
  }

  // Parse instructions
  const instructions = [];
  const instructionDescriptions = formData.getAll("instructionDescription");

  for (const description of instructionDescriptions) {
    const desc = description as string;
    if (desc.trim()) {
      instructions.push({
        description: desc.trim(),
      });
    }
  }

  // Validation
  if (
    !title ||
    !summary ||
    !prepTime ||
    ingredients.length === 0 ||
    instructions.length === 0
  ) {
    return Response.json(
      { error: "Please fill in all required fields" },
      { status: 400 }
    );
  }

  // Create new recipe
  const newRecipe: Recipe = {
    slug: generateSlug(title),
    title: title.trim(),
    summary: summary.trim(),
    time: {
      min: parseInt(prepTime),
      max: cookTime ? parseInt(cookTime) : undefined,
    },
    servings: servings ? parseInt(servings) : undefined,
    ingredients,
    instructions,
    tags: tags as Tag[],
  };

  // Save to server storage
  const savedRecipe = addRecipe(newRecipe);
  return redirect(`/recipes/${savedRecipe.slug}`);
};

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface Instruction {
  id: string;
  description: string;
}

export default function NewRecipe() {
  const { t } = useTranslation();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "", quantity: "", unit: "g" },
  ]);

  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: "1", description: "" },
  ]);

  const availableTags = [
    "quick",
    "sweet",
    "savory",
    "soup",
    "bbq",
    "spicy",
    "dessert",
    "appetizer",
  ];

  const unitOptions = [
    { value: "g", label: t("unitG") },
    { value: "mL", label: t("unitML") },
    { value: "tsp", label: t("unitTsp") },
    { value: "tbsp", label: t("unitTbsp") },
    { value: "cup", label: t("unitCup") },
    { value: "n", label: "" },
  ];

  const addIngredient = () => {
    const newId = Date.now().toString();
    setIngredients([
      ...ingredients,
      { id: newId, name: "", quantity: "", unit: "g" },
    ]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const addInstruction = () => {
    const newId = Date.now().toString();
    setInstructions([...instructions, { id: newId, description: "" }]);
  };

  const removeInstruction = (id: string) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((inst) => inst.id !== id));
    }
  };

  const updateInstruction = (id: string, description: string) => {
    setInstructions(
      instructions.map((inst) =>
        inst.id === id ? { ...inst, description } : inst
      )
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Add New Recipe
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {actionData?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                >
                  Recipe Title *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter recipe title..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                >
                  Summary *
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  defaultValue={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Brief description of the recipe..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="prepTime"
                    className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                  >
                    Prep Time ({t("minutes")}) *
                  </label>
                  <input
                    id="prepTime"
                    type="number"
                    name="prepTime"
                    defaultValue={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="30"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                    Cook Time ({t("minutes")})
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    defaultValue={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="45"
                    min="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="servings"
                    className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                  >
                    Servings *
                  </label>
                  <input
                    id="servings"
                    type="number"
                    name="servings"
                    defaultValue={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="4"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                  Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <input key={tag} type="hidden" name="tags" value={tag} />
                  ))}
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 dark:bg-stone-700 text-gray-700 dark:text-stone-300 hover:bg-gray-300 dark:hover:bg-stone-600"
                      }`}
                    >
                      #{t(`tag${tag.charAt(0).toUpperCase() + tag.slice(1)}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("ingredients")}
              </h2>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <RiAddLine size={18} />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div
                  key={ingredient.id}
                  className="flex items-center space-x-3"
                >
                  <span className="text-sm font-medium text-gray-500 dark:text-stone-400 w-8">
                    {index + 1}.
                  </span>

                  <input
                    type="number"
                    step="0.1"
                    name="ingredientQuantity"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      updateIngredient(
                        ingredient.id,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-20 px-2 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="1"
                  />

                  <select
                    name="ingredientUnit"
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(ingredient.id, "unit", e.target.value)
                    }
                    className="w-24 px-2 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label || "—"}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="ingredientName"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(ingredient.id, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ingredient name..."
                  />

                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("instructions")}
              </h2>
              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <RiAddLine size={18} />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div
                  key={instruction.id}
                  className="flex items-start space-x-4"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    {index + 1}
                  </div>

                  <textarea
                    name="instructionDescription"
                    value={instruction.description}
                    onChange={(e) =>
                      updateInstruction(instruction.id, e.target.value)
                    }
                    rows={3}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe this step..."
                  />

                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(instruction.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 dark:border-stone-600 text-gray-700 dark:text-stone-300 rounded-lg hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
            </button>
          </div>
        </Form>
      </main>
    </div>
  );
}
