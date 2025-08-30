import type { MetaFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import { TFunction } from "i18next";
import { FunctionComponent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Recipe, recipes, Tag } from "~/utils/recipes";
import { toTitleCase } from "~/utils/stringExtensions";

export const meta: MetaFunction = () => {
  return [{ title: "Recipes" }];
};

const tagColors = {
  sweet: "bg-pink-500",
  dessert: "bg-purple-500",
  savory: "bg-orange-500",
  bbq: "bg-red-600",
  soup: "bg-blue-500",
  quick: "bg-green-500",
  spicy: "bg-red-500",
  appetizer: "bg-yellow-500",
};

export default function Recipes() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const categories = useMemo(
    () => [
      { id: "all", name: "Toutes", count: recipes.length },
      {
        id: "quick",
        name: "Rapide",
        count: recipes.filter((r) => r.tags.includes("quick")).length,
      },
      {
        id: "savory",
        name: "Salé",
        count: recipes.filter((r) => r.tags.includes("savory")).length,
      },
      {
        id: "sweet",
        name: "Sucré",
        count: recipes.filter((r) => r.tags.includes("sweet")).length,
      },
      {
        id: "soup",
        name: "Soupes",
        count: recipes.filter((r) => r.tags.includes("soup")).length,
      },
    ],
    []
  );

  const filteredRecipes = useMemo(() => {
    const categoryFilter = searchParams.get("category");
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        recipe.tags.includes(categoryFilter as Tag);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, searchParams]);

  function selectCategory(category: string) {
    if (category === "all") {
      setSearchParams();
    } else {
      searchParams.set("category", category);
      setSearchParams(searchParams, { preventScrollReset: true });
    }
  }

  function formatTime(time?: { min: number; max?: number }) {
    if (!time) return "";
    return time.max ? `${time.min}-${time.max} min` : `${time.min} min`;
  }

  const selectedCategory = searchParams.get("category") || "all";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with max-width centering */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Title Section */}
          <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-lg md:text-xl lg:text-2xl">
                🍳
              </span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Our recipes
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Découvrez notre collection
              </p>
            </div>
          </div>

          {/* Search and View Toggle */}
          <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
            <div className="flex-1 relative max-w-md">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base transition-all"
              />
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-2 md:p-3 rounded-md transition-all hover:scale-105",
                  viewMode === "grid"
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <span className="text-base md:text-lg">⊞</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-2 md:p-3 rounded-md transition-all hover:scale-105",
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <span className="text-base md:text-lg">☰</span>
              </button>
            </div>
          </div>

          {/* Category Filter Header */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="font-bold text-gray-900 text-sm md:text-base">
              {t("categoryFilter")}:
            </h2>
            <div className="flex items-center space-x-1 text-sm md:text-base text-gray-500">
              <span>🔍</span>
              <span>{filteredRecipes.length} recettes</span>
            </div>
          </div>

          {/* Category Buttons - Responsive grid on desktop */}
          <div className="flex lg:grid lg:grid-cols-6 gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            <button
              onClick={() => selectCategory("all")}
              className={clsx(
                "flex-shrink-0 lg:flex-shrink px-4 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all whitespace-nowrap hover:scale-105",
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
              )}
            >
              Toutes
              <span className="ml-1 md:ml-2 px-1.5 py-0.5 text-xs md:text-sm rounded-full bg-black/10">
                {recipes.length}
              </span>
            </button>

            {categories.slice(1).map((category) => (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={clsx(
                  "flex-shrink-0 lg:flex-shrink px-4 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all whitespace-nowrap hover:scale-105",
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                )}
              >
                {category.name}
                <span className="ml-1 md:ml-2 px-1.5 py-0.5 text-xs md:text-sm rounded-full bg-black/10">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results with max-width centering */}
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
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16 md:py-24">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <span className="text-2xl md:text-3xl">🔍</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Aucune recette trouvée
            </h3>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              Essayez de modifier votre recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchParams();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-medium hover:shadow-lg transition-all text-sm md:text-base hover:scale-105"
            >
              Réinitialiser
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
}> = ({ recipe, onRecipeClick, formatTime, t }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group relative">
      <button
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={onRecipeClick}
      />

      <div className="relative h-32 md:h-40 lg:h-48 bg-gradient-to-br from-orange-100 to-red-100">
        <img
          src={`/assets/${recipe.slug}.jpeg`}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <button
          className="absolute top-2 md:top-3 right-2 md:right-3 p-1.5 md:p-2 rounded-full bg-white/80 hover:bg-white transition-all hover:scale-110 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-base md:text-lg">🤍</span>
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
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-orange-600 transition-colors">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-4 leading-relaxed">
          {recipe.summary}
        </p>

        <div className="flex flex-wrap gap-1 md:gap-2">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-1 md:px-3 md:py-1.5 ${tagColors[tag]} text-white text-xs md:text-sm rounded-full font-medium`}
            >
              #{t(`tag${toTitleCase(tag)}`)}
            </span>
          ))}
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
}> = ({ recipe, onRecipeClick, formatTime, t }) => {
  return (
    <button
      className="w-full bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left group"
      onClick={onRecipeClick}
    >
      <div className="flex space-x-4 md:space-x-6">
        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden flex-shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundImage: `url('/assets/${recipe.slug}.jpeg')`,
              backgroundSize: "cover",
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-base md:text-lg lg:text-xl leading-tight group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-2 md:mb-3 leading-relaxed">
            {recipe.summary}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs md:text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <span className="text-orange-500">⏱️</span>
                <span className="font-medium">{formatTime(recipe.time)}</span>
              </div>
            </div>

            <div className="flex gap-1 md:gap-2">
              {recipe.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 md:px-3 md:py-1.5 ${tagColors[tag]} text-white text-xs md:text-sm rounded-full font-medium`}
                >
                  #{t(`tag${toTitleCase(tag)}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};
