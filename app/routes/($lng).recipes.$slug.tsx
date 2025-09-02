import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { RiEditLine } from "@remixicon/react";
import clsx from "clsx";
import { FunctionComponent, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import { RecipeRating } from "~/components/RecipeRating";
import { ServingCalculator } from "~/components/ServingCalculator";
import i18next from "~/i18next.server";
import { isFavorite, toggleFavorite } from "~/utils/favorites";
import { buildI18nUrl } from "~/utils/i18n-redirect";
import { getRecipeBySlug } from "~/utils/recipe-storage.server";
import type { Recipe } from "~/utils/recipes";
import { getTagColor } from "~/utils/tag-utils";

export const meta: MetaFunction = () => {
  return [{ title: "Recipe" }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { slug } = params;
  const locale = await i18next.getLocale(request);

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ recipe, locale });
};

function getUnitLabels(t: (key: string) => string) {
  return {
    n: "",
    g: t("unitG"),
    kg: t("unitKg"),
    mL: t("unitML"),
    L: t("unitL"),
    tsp: t("unitTsp"),
    tbsp: t("unitTbsp"),
    cup: t("unitCup"),
  };
}

export default function Recipe() {
  const { t } = useTranslation();
  const { recipe, locale } = useLoaderData<{
    recipe: Recipe;
    locale: string;
  }>();
  const [selectedTab, setSelectedTab] = useState("ingredients");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [checkedInstructions, setCheckedInstructions] = useState<Set<string>>(
    new Set()
  );
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [scaledIngredients, setScaledIngredients] = useState<
    Recipe["ingredients"]
  >(recipe.ingredients);
  const [currentServings, setCurrentServings] = useState(recipe.servings || 4);

  // Initialize favorite status from localStorage
  useEffect(() => {
    setIsFavoriteState(isFavorite(recipe.slug));
  }, [recipe.slug]);

  const handleToggleFavorite = () => {
    const newFavoriteState = toggleFavorite(recipe.slug);
    setIsFavoriteState(newFavoriteState);
  };

  const handleServingsChange = (
    newScaledIngredients: Recipe["ingredients"],
    newServings: number
  ) => {
    setScaledIngredients(newScaledIngredients);
    setCurrentServings(newServings);
    // Clear checked ingredients when servings change
    setCheckedIngredients(new Set());
  };

  function onToggleIngredient(name: string) {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  }

  function onToggleInstruction(index: string) {
    setCheckedInstructions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  type NewType = typeof recipe.ingredients;

  function formatQuantity(ingredient: NewType[0]) {
    const unitLabels = getUnitLabels(t);
    const unit = unitLabels[ingredient.unit] || ingredient.unit;

    // For "n" unit (numeric/no unit), only show the quantity if it's meaningful
    if (ingredient.unit === "n") {
      // If quantity is 1 or empty, don't show it
      if (
        ingredient.quantity === 1 ||
        ingredient.quantity === "1" ||
        !ingredient.quantity
      ) {
        return "";
      }
      // Otherwise, show just the quantity
      return String(ingredient.quantity);
    }

    return `${ingredient.quantity} ${unit}`.trim();
  }

  function ProgressBar() {
    if (selectedTab !== "instructions" || !recipe) return null;

    return (
      <div className="mb-6 bg-white dark:bg-stone-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-stone-600 sticky top-[73px] md:top-[81px] z-40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm md:text-base font-medium text-gray-700 dark:text-stone-300">
            {t("progression")}
          </span>
          <span className="text-sm md:text-base font-bold text-orange-600">
            {Math.round(
              (checkedInstructions.size / recipe.instructions.length) * 100
            )}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-stone-600 rounded-full h-2 md:h-3">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                (checkedInstructions.size / recipe.instructions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
    );
  }

  function tabContent() {
    if (!recipe) return null;

    switch (selectedTab) {
      case "ingredients":
        return (
          <div className="space-y-3">
            {scaledIngredients.map((ingredient, idx) => (
              <button
                key={idx}
                className={clsx(
                  "flex items-center space-x-3 p-3 md:p-4 rounded-lg border cursor-pointer transition-all w-full text-left",
                  checkedIngredients.has(ingredient.name)
                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700"
                    : "bg-white dark:bg-stone-800 border-gray-200 dark:border-stone-600 hover:bg-gray-50 dark:hover:bg-stone-700 active:bg-gray-50 dark:active:bg-stone-700"
                )}
                onClick={() => onToggleIngredient(ingredient.name)}
              >
                <div
                  className={clsx(
                    "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    checkedIngredients.has(ingredient.name)
                      ? "bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600"
                      : "border-gray-300 dark:border-stone-500"
                  )}
                >
                  {checkedIngredients.has(ingredient.name) && (
                    <span className="text-white text-xs md:text-sm">✓</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={clsx(
                      "font-medium text-sm md:text-base transition-all",
                      checkedIngredients.has(ingredient.name)
                        ? "text-green-700 dark:text-green-400 line-through"
                        : "text-gray-900 dark:text-white"
                    )}
                  >
                    {formatQuantity(ingredient)}
                  </div>
                  <div
                    className={clsx(
                      "text-xs md:text-sm transition-all",
                      checkedIngredients.has(ingredient.name)
                        ? "text-green-600 dark:text-green-400 line-through"
                        : "text-gray-600 dark:text-stone-300"
                    )}
                  >
                    {ingredient.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case "instructions":
        return (
          <div className="space-y-4">
            {recipe.instructions.map((instruction, idx) => {
              const stepId = idx.toString();
              return (
                <button
                  key={stepId}
                  className={clsx(
                    "flex space-x-4 p-4 md:p-6 rounded-lg border cursor-pointer transition-all w-full text-left",
                    checkedInstructions.has(stepId)
                      ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700"
                      : "bg-white dark:bg-stone-800 border-gray-200 dark:border-stone-600 hover:bg-gray-50 dark:hover:bg-stone-700 active:bg-gray-50 dark:active:bg-stone-700"
                  )}
                  onClick={() => onToggleInstruction(stepId)}
                >
                  <div
                    className={clsx(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0",
                      checkedInstructions.has(stepId)
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-br from-orange-400 to-red-400 text-white"
                    )}
                  >
                    {checkedInstructions.has(stepId) ? "✓" : idx + 1}
                  </div>

                  <div className="flex-1">
                    <p
                      className={clsx(
                        "text-sm md:text-base leading-relaxed transition-all",
                        checkedInstructions.has(stepId)
                          ? "text-green-700 dark:text-green-400 line-through"
                          : "text-gray-900 dark:text-white"
                      )}
                    >
                      {instruction.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <BackButton />

            <div className="flex items-center space-x-2 md:space-x-3">
              {!recipe.isDefault && (
                <Link
                  to={buildI18nUrl(`/recipes/edit/${recipe.slug}`, locale)}
                  className="p-2 md:p-3 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all hover:scale-105"
                  aria-label={t("editRecipe")}
                >
                  <RiEditLine
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                  />
                </Link>
              )}
              <button
                onClick={handleToggleFavorite}
                className={clsx(
                  "p-2 md:p-3 rounded-full transition-all hover:scale-105",
                  isFavoriteState
                    ? "bg-red-100 dark:bg-red-900"
                    : "bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700"
                )}
                aria-label={
                  isFavoriteState ? "Remove from favorites" : "Add to favorites"
                }
              >
                <span className="text-lg md:text-xl">
                  {isFavoriteState ? "❤️" : "🤍"}
                </span>
              </button>
              <button className="p-2 md:p-3 rounded-full bg-gray-100 dark:bg-stone-800 transition-all hover:bg-gray-200 dark:hover:bg-stone-700 hover:scale-105">
                <span className="text-base md:text-lg">📤</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 md:px-4 md:py-2 ${getTagColor(
                  tag
                )} text-white text-xs md:text-sm rounded-full font-medium`}
              >
                #{tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 leading-tight">
            {recipe.title}
          </h1>

          {recipe.summary && (
            <p className="text-gray-600 dark:text-stone-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base lg:text-lg">
              {recipe.summary}
            </p>
          )}

          {/* Author and Rating Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
            <div className="flex items-center space-x-4 text-sm md:text-base text-gray-500 dark:text-stone-400">
              {recipe.author && (
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500">👨‍🍳</span>
                  <span>
                    {t("by")}{" "}
                    <span className="font-medium text-gray-700 dark:text-stone-300">
                      {recipe.author}
                    </span>
                  </span>
                </div>
              )}
              {recipe.createdAt && (
                <div className="flex items-center space-x-1">
                  <span className="text-orange-500">📅</span>
                  <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Rating Display */}
            <div className="flex items-center space-x-2">
              {recipe.averageRating &&
              recipe.ratingCount &&
              recipe.ratingCount > 0 ? (
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(recipe.averageRating || 0)
                            ? "text-yellow-400"
                            : i < (recipe.averageRating || 0)
                            ? "text-yellow-200"
                            : "text-gray-300 dark:text-stone-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-stone-400">
                    {recipe.averageRating?.toFixed(1)} ({recipe.ratingCount}{" "}
                    {recipe.ratingCount === 1 ? t("rating") : t("ratings")})
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-stone-500">
                  {t("noRatings")}
                </span>
              )}
              {recipe.commentCount && recipe.commentCount > 0 && (
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-stone-400">
                  <span>💬</span>
                  <span>
                    {recipe.commentCount} {t("comments")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 text-sm md:text-base text-gray-500 dark:text-stone-400 mb-6 md:mb-8">
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-orange-500 text-base md:text-lg">⏱️</span>
              <span className="font-medium">
                {recipe.time?.max
                  ? `${recipe.time.min}-${recipe.time.max}`
                  : recipe.time?.min}{" "}
                {t("minutes")}
              </span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-orange-500 text-base md:text-lg">👥</span>
              <span className="font-medium">
                {currentServings} {t("servings")}
                {currentServings !== (recipe.servings || 4) && (
                  <span className="text-orange-600 dark:text-orange-400 ml-1">
                    (scaled from {recipe.servings || 4})
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 mb-6 md:mb-8 flex items-center justify-center">
            <div className="text-6xl md:text-8xl lg:text-9xl transition-transform duration-300 hover:scale-105">
              {recipe.emoji || "🍽️"}
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 mb-6 lg:mb-0 space-y-4">
            <div className="flex lg:flex-col bg-gray-100 dark:bg-stone-700 rounded-xl p-1 lg:space-y-1 lg:space-x-0 space-x-0">
              <Tab
                isSelected={selectedTab === "ingredients"}
                label={`${t("ingredients")} (${scaledIngredients.length})`}
                onClick={() => setSelectedTab("ingredients")}
                isDesktop={true}
              />
              <Tab
                isSelected={selectedTab === "instructions"}
                label={`${t("instructions")} (${recipe.instructions.length})`}
                onClick={() => setSelectedTab("instructions")}
                isDesktop={true}
              />
            </div>

            <ServingCalculator
              recipe={recipe}
              onServingsChange={handleServingsChange}
            />

            <RecipeRating
              recipeSlug={recipe.slug}
              initialAverageRating={recipe.averageRating}
              initialRatingCount={recipe.ratingCount}
              className="bg-white dark:bg-stone-800 rounded-lg p-4 border border-gray-200 dark:border-stone-600"
            />
          </div>

          <div className="lg:col-span-9">
            <ProgressBar />
            <div className="pb-6">{tabContent()}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Tab: FunctionComponent<{
  isSelected: boolean;
  label: string;
  onClick: () => void;
  isDesktop?: boolean;
}> = ({ isSelected, label, onClick, isDesktop = false }) => {
  return (
    <button
      className={clsx(
        "py-3 px-4 md:py-4 md:px-6 rounded-lg font-medium transition-all text-sm md:text-base text-center lg:text-left lg:w-full",
        {
          "bg-white dark:bg-stone-600 text-gray-900 dark:text-white shadow-sm":
            isSelected,
          "text-gray-600 dark:text-stone-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-stone-600":
            !isSelected,
          "flex-1": !isDesktop,
        }
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
