import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { RiAddLine, RiDeleteBinLine, RiDragMoveLine } from "@remixicon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import i18next from "~/i18next.server";
import { createRecipe } from "~/services/recipe.server";
import type { Recipe } from "~/services/recipe.server";
import { getAllTags } from "~/services/tag.server";
import { authenticator } from "~/utils/auth.server";
import { buildI18nUrl } from "~/utils/i18n-redirect";
import { toTitleCase } from "~/utils/stringExtensions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    const locale = await i18next.getLocale(request);
    const loginUrl = locale === "fr" ? "/login" : `/${locale}/login`;
    return redirect(loginUrl);
  }

  const locale = await i18next.getLocale(request);
  const availableTags = await getAllTags();
  return json({ locale, availableTags, user });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locale = data?.locale || "fr";

  const titles: Record<string, string> = {
    fr: "Ajouter une nouvelle recette",
    en: "Add New Recipe",
    es: "Añadir nueva receta",
    pt: "Adicionar nova receita",
    he: "הוסף מתכון חדש",
  };

  return [{ title: titles[locale] || titles.fr }];
};

export const handle = {
  i18n: "common",
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  // Redirect to login if user is not authenticated
  if (!user) {
    const locale = await i18next.getLocale(request);
    const loginUrl = locale === "fr" ? "/login" : `/${locale}/login`;
    return redirect(loginUrl);
  }

  const formData = await request.formData();
  const locale = await i18next.getLocale(request);

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const emoji = formData.get("emoji") as string;
  const author = formData.get("author") as string;
  const prepTime = formData.get("prepTime") as string;
  const cookTime = formData.get("cookTime") as string;
  const servings = formData.get("servings") as string;
  const isPublic = formData.get("isPublic") === "on";
  
  // Parse tags
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
    !prepTime ||
    ingredients.length === 0 ||
    instructions.length === 0
  ) {
    return Response.json(
      { error: "fillAllRequiredFields" }, // Will be translated on frontend
      { status: 400 }
    );
  }

  // Create new recipe data
  const newRecipeData = {
    title: title.trim(),
    summary: summary.trim(),
    emoji: emoji?.trim() || undefined,
    author: user?.name || author?.trim() || "Anonymous",
    prepTime: prepTime ? parseInt(prepTime) : undefined,
    cookTime: cookTime ? parseInt(cookTime) : undefined,
    servings: servings ? parseInt(servings) : undefined,
    ingredients,
    instructions,
    isPublic,
    tags,
  };

  // Save to server storage
  const savedRecipe = await createRecipe(newRecipeData, user?.id);

  // Build redirect URL with proper language prefix
  const redirectUrl = buildI18nUrl(`/recipes/${savedRecipe.slug}`, locale);

  return redirect(redirectUrl);
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

interface SortableIngredientProps {
  ingredient: Ingredient;
  onUpdate: (id: string, field: keyof Ingredient, value: string) => void;
  onRemove: (id: string) => void;
  unitOptions: Array<{ value: string; label: string }>;
  canRemove: boolean;
  t: (key: string) => string;
}

function SortableIngredient({
  ingredient,
  onUpdate,
  onRemove,
  unitOptions,
  canRemove,
  t,
}: SortableIngredientProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: ingredient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 dark:bg-stone-700 rounded-lg p-4 border border-gray-200 dark:border-stone-600"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 dark:text-stone-400 dark:hover:text-stone-300 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <RiDragMoveLine size={16} />
        </button>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              name="ingredientQuantity"
              value={ingredient.quantity}
              onChange={(e) =>
                onUpdate(ingredient.id, "quantity", e.target.value)
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-stone-500 rounded-lg bg-white dark:bg-stone-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t("quantityPlaceholder")}
              required
            />
          </div>

          <div className="md:col-span-2">
            <select
              name="ingredientUnit"
              value={ingredient.unit}
              onChange={(e) => onUpdate(ingredient.id, "unit", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-stone-500 rounded-lg bg-white dark:bg-stone-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {unitOptions.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label || unit.value}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-6">
            <input
              type="text"
              name="ingredientName"
              value={ingredient.name}
              onChange={(e) => onUpdate(ingredient.id, "name", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-stone-500 rounded-lg bg-white dark:bg-stone-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={t("ingredientNamePlaceholder")}
              required
            />
          </div>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(ingredient.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <RiDeleteBinLine size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

interface SortableInstructionProps {
  instruction: Instruction;
  index: number;
  onUpdate: (id: string, description: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  t: (key: string) => string;
}

function SortableInstruction({
  instruction,
  index,
  onUpdate,
  onRemove,
  canRemove,
  t,
}: SortableInstructionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: instruction.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 dark:bg-stone-700 rounded-lg p-4 border border-gray-200 dark:border-stone-600"
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 dark:text-stone-400 dark:hover:text-stone-300 cursor-grab active:cursor-grabbing mt-2"
          {...attributes}
          {...listeners}
        >
          <RiDragMoveLine size={16} />
        </button>

        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white text-sm font-bold rounded-full flex items-center justify-center mt-2">
          {index + 1}
        </div>

        <div className="flex-1">
          <textarea
            name="instructionDescription"
            value={instruction.description}
            onChange={(e) => onUpdate(instruction.id, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-stone-500 rounded-lg bg-white dark:bg-stone-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder={t("stepDescriptionPlaceholder")}
            required
          />
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(instruction.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-2"
          >
            <RiDeleteBinLine size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function NewRecipe() {
  const { t } = useTranslation();
  const { availableTags } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [emoji, setEmoji] = useState("");
  const [author, setAuthor] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "", quantity: "", unit: "g" },
  ]);

  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: "1", description: "" },
  ]);

  const presetTags = availableTags.filter((tag) => tag.isDefault);
  const [newTagInput, setNewTagInput] = useState("");

  const unitOptions = [
    { value: "g", label: t("unitG") },
    { value: "kg", label: t("unitKg") },
    { value: "mL", label: t("unitML") },
    { value: "L", label: t("unitL") },
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

  const addCustomTag = () => {
    const trimmedTag = newTagInput.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag]);
      setNewTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  };

  const handleIngredientDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setIngredients((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleInstructionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setInstructions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {t("addNewRecipe")}
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {actionData?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {t(actionData.error)}
          </div>
        )}

        <Form method="post" className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {t("basicInformation")}
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                >
                  {t("recipeTitle")} *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t("recipeTitlePlaceholder", {
                    defaultValue: "",
                  })}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                >
                  {t("summary")}
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  defaultValue={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t("recipeDescriptionPlaceholder", {
                    defaultValue: "",
                  })}
                />
              </div>

              <div>
                <label
                  htmlFor="emoji"
                  className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                >
                  Emoji
                </label>
                <input
                  id="emoji"
                  type="text"
                  name="emoji"
                  defaultValue={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="🍽️"
                />
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                >
                  {t("author")}
                </label>
                <input
                  id="author"
                  type="text"
                  name="author"
                  defaultValue={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t("authorPlaceholder")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="prepTime"
                    className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                  >
                    {t("prepTime")} ({t("minutes")}) *
                  </label>
                  <input
                    id="prepTime"
                    type="number"
                    name="prepTime"
                    defaultValue={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t("prepTimePlaceholder")}
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                    {t("cookTime")} ({t("minutes")})
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    defaultValue={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t("cookTimePlaceholder")}
                    min="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="servings"
                    className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                  >
                    {toTitleCase(t("servings"))} *
                  </label>
                  <input
                    id="servings"
                    type="number"
                    name="servings"
                    defaultValue={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={t("servingsPlaceholder")}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                  {t("tags")}
                </span>

                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tagName) => {
                    return (
                      <div key={tagName}>
                        <input type="hidden" name="tags" value={tagName} />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
                          #{tagName}
                          <button
                            type="button"
                            onClick={() => removeTag(tagName)}
                            className="ml-2 hover:text-orange-200 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {presetTags.map((tag) => (
                      <button
                        key={tag.name}
                        type="button"
                        onClick={() => toggleTag(tag.name)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          selectedTags.includes(tag.name)
                            ? "bg-gray-300 dark:bg-stone-600 text-gray-500 dark:text-stone-400"
                            : "bg-gray-200 dark:bg-stone-700 text-gray-700 dark:text-stone-300 hover:bg-gray-300 dark:hover:bg-stone-600"
                        }`}
                        disabled={selectedTags.includes(tag.name)}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleNewTagKeyDown}
                    placeholder="Add custom tag..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    disabled={!newTagInput.trim()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-3">
                  {t("privacy", { defaultValue: "Privacy" })}
                </span>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-stone-700 rounded-lg border border-gray-200 dark:border-stone-600">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-stone-300">
                      {t("makeRecipePublic", {
                        defaultValue:
                          "Make this recipe public (others can see it)",
                      })}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-stone-400 mt-1">
                      {t("privateRecipeNote", {
                        defaultValue: "Private recipes are only visible to you",
                      })}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    {""}
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                  </label>
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
                <span>{t("addIngredient")}</span>
              </button>
            </div>

            <DndContext
              id="ingredients-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleIngredientDragEnd}
            >
              <SortableContext
                items={ingredients.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {ingredients.map((ingredient) => (
                    <SortableIngredient
                      key={ingredient.id}
                      ingredient={ingredient}
                      onUpdate={updateIngredient}
                      onRemove={removeIngredient}
                      unitOptions={unitOptions}
                      canRemove={ingredients.length > 1}
                      t={t}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
                <span>{t("addStep")}</span>
              </button>
            </div>

            <DndContext
              id="instructions-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleInstructionDragEnd}
            >
              <SortableContext
                items={instructions.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {instructions.map((instruction, index) => (
                    <SortableInstruction
                      key={instruction.id}
                      instruction={instruction}
                      index={index}
                      onUpdate={updateInstruction}
                      onRemove={removeInstruction}
                      canRemove={instructions.length > 1}
                      t={t}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("creatingRecipe") : t("createRecipe")}
            </button>
          </div>
        </Form>
      </main>
    </div>
  );
}
