import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import { TFunction } from "i18next";
import { FunctionComponent, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { RatingDisplay } from "~/components/StarRating";
import { authenticator } from "~/utils/auth.server";
import { getFavorites, toggleFavorite } from "~/utils/favorites";
import { getAllRecipes } from "~/utils/recipe-storage.server";
import type { Recipe, Tag } from "~/utils/recipes";
import { getAllTags } from "~/utils/tag-storage.server";
import { getTagColor } from "~/utils/tag-utils";

export const meta: MetaFunction = () => {
  return [{ title: "Recipes" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  const recipes = getAllRecipes(user?.id);
  const availableTags = getAllTags();
  return json({ recipes, availableTags, user });
};

export default function Recipes() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const { recipes, availableTags, user } = useLoaderData<{
    recipes: Recipe[];
    availableTags: Array<{
      id: number;
      name: string;
      display_name: string;
      is_default: boolean;
      created_at: string;
    }>;
    user: { id: string; name: string; email: string; avatar: string } | null;
  }>();

  // Load favorites from localStorage
  useEffect(() => {
    setFavoriteRecipes(getFavorites());
  }, []);

  const {
    userFilters,
    mainCategories,
    additionalCategories,
    filteredAdditionalCategories,
  } = useMemo(() => {
    const categoryFilter = searchParams.get("category");

    // Helper function to filter by current category selection
    const getCategoryFilteredRecipes = (recipes: Recipe[]) => {
      if (!categoryFilter || categoryFilter === "all") {
        return recipes;
      }
      return recipes.filter((r) => r.tags.includes(categoryFilter as Tag));
    };

    // User-specific filters (counts based on current category filter)
    const categoryFilteredRecipes = getCategoryFilteredRecipes(recipes);
    const userFilters = [
      {
        id: "favorites",
        name: t("favorites"),
        count: categoryFilteredRecipes.filter((r) =>
          favoriteRecipes.includes(r.slug)
        ).length,
      },
    ];

    // Add "My Recipes" filter only for authenticated users
    if (user) {
      userFilters.push({
        id: "my-recipes",
        name: t("myRecipes", { defaultValue: "My Recipes" }),
        count: categoryFilteredRecipes.filter((r) => r.userId === user.id)
          .length,
      });
    }

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

    // Helper function to filter by current user filter selection
    const getUserFilteredRecipes = (recipes: Recipe[]) => {
      const userFilter = searchParams.get("userFilter");
      if (!userFilter) {
        return recipes;
      }
      return recipes.filter((r) => {
        if (userFilter === "favorites") return favoriteRecipes.includes(r.slug);
        if (userFilter === "my-recipes") return user && r.userId === user.id;
        return true;
      });
    };

    // All available tag categories with counts (based on current user filter)
    const userFilteredRecipes = getUserFilteredRecipes(recipes);
    const allTagCategories = availableTags
      .map((tag) => ({
        id: tag.name,
        name: tag.display_name,
        count: userFilteredRecipes.filter((r) => r.tags.includes(tag.name))
          .length,
        isPopular: popularTagNames.includes(tag.name),
      }))
      .filter((category) => category.count > 0); // Only show categories that have recipes

    // Split into popular and additional categories
    const popularCategories = allTagCategories
      .filter((cat) => cat.isPopular)
      .sort((a, b) => b.count - a.count); // Sort by count desc

    const additionalCategories = allTagCategories
      .filter((cat) => !cat.isPopular)
      .sort((a, b) => b.count - a.count); // Sort by count desc

    // Filter additional categories by search query
    const filteredAdditionalCategories = tagSearchQuery
      ? additionalCategories.filter((cat) =>
          cat.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
        )
      : additionalCategories;

    const mainCategories = popularCategories;

    return {
      userFilters,
      mainCategories,
      additionalCategories,
      filteredAdditionalCategories,
    };
  }, [
    t,
    recipes,
    favoriteRecipes,
    availableTags,
    tagSearchQuery,
    user,
    searchParams,
  ]);

  const filteredRecipes = useMemo(() => {
    const categoryFilter = searchParams.get("category");
    const userFilter = searchParams.get("userFilter");

    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.summary?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        recipe.tags.includes(categoryFilter as Tag);

      const matchesUserFilter =
        !userFilter ||
        (userFilter === "favorites" && favoriteRecipes.includes(recipe.slug)) ||
        (userFilter === "my-recipes" && user && recipe.userId === user.id);

      return matchesSearch && matchesCategory && matchesUserFilter;
    });
  }, [searchQuery, searchParams, recipes, favoriteRecipes, user]);

  function selectCategory(category: string) {
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams, { preventScrollReset: true });
  }

  function selectUserFilter(userFilter: string) {
    const currentUserFilter = searchParams.get("userFilter");
    if (currentUserFilter === userFilter) {
      // Toggle off if clicking the same filter
      searchParams.delete("userFilter");
    } else {
      searchParams.set("userFilter", userFilter);
    }
    setSearchParams(searchParams, { preventScrollReset: true });
  }

  const handleToggleFavorite = (recipeSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipeSlug);
    setFavoriteRecipes(getFavorites());
  };

  function formatTime(time?: { min: number; max?: number }) {
    if (!time) return "";
    return time.max
      ? `${time.min}-${time.max} ${t("minutes")}`
      : `${time.min} ${t("minutes")}`;
  }

  const selectedCategory = searchParams.get("category") || "all";
  const selectedUserFilter = searchParams.get("userFilter");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-lg md:text-xl lg:text-2xl">
                  🍳
                </span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {t("recipesPageTitle")}
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-stone-300">
                  {t("recipesPageDescription")}
                </p>
              </div>
            </div>

            {user && (
              <a
                href="/recipes/new"
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm md:text-base"
              >
                <span className="text-lg">➕</span>
                <span className="hidden sm:inline">{t("addNewRecipe")}</span>
              </a>
            )}
          </div>

          <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
            <div className="flex-1 relative max-w-md">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base transition-all"
              />
            </div>

            <div className="flex bg-gray-100 dark:bg-stone-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-2 md:p-3 rounded-md transition-all hover:scale-105",
                  viewMode === "grid"
                    ? "bg-white dark:bg-stone-600 shadow-sm"
                    : "text-gray-500 dark:text-stone-300 hover:text-gray-700 dark:hover:text-stone-200"
                )}
              >
                <span className="text-base md:text-lg">⊞</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-2 md:p-3 rounded-md transition-all hover:scale-105",
                  viewMode === "list"
                    ? "bg-white dark:bg-stone-600 shadow-sm"
                    : "text-gray-500 dark:text-stone-300 hover:text-gray-700 dark:hover:text-stone-200"
                )}
              >
                <span className="text-base md:text-lg">☰</span>
              </button>
            </div>
          </div>

          {/* User Filters Section */}
          {userFilters.some((filter) => filter.count > 0) && (
            <>
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h2 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                  {t("myFilters", { defaultValue: "My Filters" })}:
                </h2>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide mb-4 md:mb-6">
                {userFilters
                  .filter((filter) => filter.count > 0)
                  .map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => selectUserFilter(filter.id)}
                      className={clsx(
                        "cursor-pointer flex-shrink-0 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap hover:scale-105",
                        selectedUserFilter === filter.id
                          ? "bg-blue-500 text-white shadow-sm"
                          : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800"
                      )}
                    >
                      {filter.name}
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-black/10">
                        {filter.count}
                      </span>
                    </button>
                  ))}
              </div>
            </>
          )}

          {/* Category Filters Section */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">
              {t("categoryFilter")}:
            </h2>
            <div className="flex items-center space-x-1 text-sm md:text-base text-gray-500 dark:text-stone-300">
              <span>🔍</span>
              <span>
                {filteredRecipes.length} {t("recipesCount")}
              </span>
            </div>
          </div>

          <div className="flex items-center lg:grid lg:grid-cols-6 gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            <button
              onClick={() => selectCategory("all")}
              className={clsx(
                "flex-shrink-0 lg:flex-shrink px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap hover:scale-105",
                selectedCategory === "all"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
              )}
            >
              {t("all")}
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-black/10">
                {recipes.length}
              </span>
            </button>

            {/* Main popular categories */}
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={clsx(
                  "cursor-pointer flex-shrink-0 lg:flex-shrink px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap hover:scale-105",
                  selectedCategory === category.id
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
                )}
              >
                {category.name}
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-black/10">
                  {category.count}
                </span>
              </button>
            ))}

            {/* Show More button if there are additional categories */}
            {additionalCategories.length > 0 && (
              <>
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="cursor-pointer flex-shrink-0 px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap hover:scale-105 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 border border-stone-300 dark:border-stone-600"
                >
                  {showAllCategories
                    ? t("showLess")
                    : `${t("showMore")} (${additionalCategories.length})`}
                </button>

                {/* Collapsible additional categories */}
                {showAllCategories && (
                  <div className="flex flex-wrap gap-2 md:gap-3 w-full">
                    {/* Search input for tags */}
                    <div className="w-full mb-2">
                      <input
                        type="text"
                        placeholder={t("search")}
                        value={tagSearchQuery}
                        onChange={(e) => setTagSearchQuery(e.target.value)}
                        className="w-full max-w-xs px-3 py-2 text-sm border border-stone-200 dark:border-stone-600 rounded-full bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Filtered additional categories */}
                    {filteredAdditionalCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => selectCategory(category.id)}
                        className={clsx(
                          "cursor-pointer flex-shrink-0 lg:flex-shrink px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap hover:scale-105",
                          selectedCategory === category.id
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600"
                        )}
                      >
                        {category.name}
                        <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-black/10">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.slug}
                recipe={recipe}
                onRecipeClick={() => navigate(`/recipes/${recipe.slug}`)}
                formatTime={formatTime}
                t={t}
                isFavorite={favoriteRecipes.includes(recipe.slug)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
            {filteredRecipes.map((recipe) => (
              <RecipeListItem
                key={recipe.slug}
                recipe={recipe}
                onRecipeClick={() => navigate(`/recipes/${recipe.slug}`)}
                formatTime={formatTime}
                t={t}
                isFavorite={favoriteRecipes.includes(recipe.slug)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {filteredRecipes.length === 0 && (
          <div className="text-center py-16 md:py-24">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🔍</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("noRecipesFound")}
            </h3>
            <p className="text-gray-600 dark:text-stone-300 mb-4 md:mb-6 text-sm md:text-base">
              {t("tryModifyingSearch")}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchParams(new URLSearchParams());
              }}
              className="cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-medium hover:shadow-lg transition-all text-sm md:text-base hover:scale-105"
            >
              {t("reset")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const RecipeCard: FunctionComponent<{
  recipe: Recipe;
  onRecipeClick: () => void;
  formatTime: (time?: { min: number; max?: number }) => string;
  t: TFunction<"translation", undefined>;
  isFavorite: boolean;
  onToggleFavorite: (slug: string, e: React.MouseEvent) => void;
}> = ({
  recipe,
  onRecipeClick,
  formatTime,
  t,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-700 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group relative">
      <button
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={onRecipeClick}
      />

      <div className="relative h-32 md:h-40 lg:h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        <div className="text-4xl md:text-6xl lg:text-7xl transition-transform duration-300 group-hover:scale-110">
          {recipe.emoji || "🍽️"}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        <button
          className={clsx(
            "absolute top-2 md:top-3 right-2 md:right-3 p-1.5 md:p-2 rounded-full transition-all hover:scale-110 z-20",
            isFavorite
              ? "bg-red-100/90 hover:bg-red-100"
              : "bg-white/80 hover:bg-white"
          )}
          onClick={(e) => onToggleFavorite(recipe.slug, e)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="text-base md:text-lg">
            {isFavorite ? "❤️" : "🤍"}
          </span>
        </button>

        <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center space-x-1">
            <span className="text-orange-600 text-xs md:text-sm">⏱️</span>
            <span className="text-xs md:text-sm font-medium text-gray-800">
              {formatTime(recipe.time)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5 lg:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 group-hover:text-orange-600 transition-colors">
          {recipe.title}
        </h3>
        {recipe.summary && (
          <p className="text-gray-600 dark:text-stone-300 text-sm md:text-base line-clamp-2 mb-3 leading-relaxed">
            {recipe.summary}
          </p>
        )}

        <div className="mb-3">
          <RatingDisplay
            averageRating={recipe.averageRating || 0}
            ratingCount={recipe.ratingCount || 0}
            size="sm"
            showCount={true}
            className="justify-start"
          />
        </div>

        <div className="flex flex-wrap gap-1 md:gap-2 items-center">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-1 md:px-3 md:py-1.5 ${getTagColor(
                tag
              )} text-white text-xs md:text-sm rounded-full font-medium`}
            >
              #{tag}
            </span>
          ))}
          {recipe.isPublic === false && (
            <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-500 text-white text-xs md:text-sm rounded-full font-medium flex items-center space-x-1">
              <span>🔒</span>
              <span>{t("private", { defaultValue: "Private" })}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const RecipeListItem: FunctionComponent<{
  recipe: Recipe;
  onRecipeClick: () => void;
  formatTime: (time?: { min: number; max?: number }) => string;
  t: TFunction<"translation", undefined>;
  isFavorite: boolean;
  onToggleFavorite: (slug: string, e: React.MouseEvent) => void;
}> = ({
  recipe,
  onRecipeClick,
  formatTime,
  t,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="relative bg-white dark:bg-stone-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-stone-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <button
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={onRecipeClick}
      />

      <button
        className={clsx(
          "absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110 z-20",
          isFavorite
            ? "bg-red-100/90 hover:bg-red-100"
            : "bg-gray-100/80 hover:bg-gray-100"
        )}
        onClick={(e) => onToggleFavorite(recipe.slug, e)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <span className="text-sm">{isFavorite ? "❤️" : "🤍"}</span>
      </button>

      <div className="flex space-x-4 md:space-x-6 pr-12">
        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
          <div className="text-xl md:text-2xl lg:text-3xl transition-transform duration-300 group-hover:scale-110">
            {recipe.emoji || "🍽️"}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1 md:mb-2 text-base md:text-lg lg:text-xl leading-tight group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          {recipe.summary && (
            <p className="text-gray-600 dark:text-stone-300 text-sm md:text-base line-clamp-2 mb-2 leading-relaxed">
              {recipe.summary}
            </p>
          )}

          <div className="mb-2 md:mb-3">
            <RatingDisplay
              averageRating={recipe.averageRating || 0}
              ratingCount={recipe.ratingCount || 0}
              size="sm"
              showCount={true}
              className="justify-start"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-500 dark:text-stone-400">
              <div className="flex items-center space-x-1">
                <span className="text-orange-500">⏱️</span>
                <span className="font-medium">{formatTime(recipe.time)}</span>
              </div>
            </div>

            <div className="flex gap-1 md:gap-2 items-center">
              {recipe.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 md:px-3 md:py-1.5 ${getTagColor(
                    tag
                  )} text-white text-xs md:text-sm rounded-full font-medium`}
                >
                  #{tag}
                </span>
              ))}
              {recipe.isPublic === false && (
                <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-500 text-white text-xs md:text-sm rounded-full font-medium flex items-center space-x-1">
                  <span>🔒</span>
                  <span>{t("private", { defaultValue: "Private" })}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
