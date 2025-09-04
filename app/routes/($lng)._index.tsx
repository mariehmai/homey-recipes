import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import i18next from "~/i18next.server";
import { getAllRecipes } from "~/utils/recipe-storage.server";
import type { Recipe, Tag } from "~/utils/recipes";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locale = data?.locale || "fr";

  const descriptions: Record<string, string> = {
    fr: "Découvrez, créez et savourez la recette parfaite pour chaque occasion, où des plats délicieux se marient avec une cuisine facile à préparer à la maison.",
    en: "Discover, create, and savor the perfect recipe for every occasion – where delicious meals meet effortless cooking at home.",
    es: "Descubre, crea y saborea la receta perfecta para cada ocasión, donde los platos deliciosos se encuentran con la cocina fácil en casa.",
    pt: "Descubra, crie e saboreie a receita perfeita para cada ocasião, onde pratos deliciosos encontram a culinária fácil em casa.",
    he: "גלו, צרו וטעמו את המתכון המושלם לכל אירוע, כאשר מנות טעימות נפגשות עם בישול קל בבית.",
  };

  return [
    { title: "Papilles & Mami" },
    {
      name: "description",
      content: descriptions[locale] || descriptions.fr,
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const recipes = getAllRecipes();
  return json({ recipes, locale });
};

export const handle = {
  i18n: "common",
};

export default function Index() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { recipes } = useLoaderData<{ recipes: Recipe[]; locale: string }>();
  const params = useParams();
  const currentLang = params.lng || "fr";

  // Helper function to build URLs with language prefix
  const buildUrl = (path: string) => {
    if (currentLang === "fr") {
      return path;
    }
    return `/${currentLang}${path}`;
  };

  const recipesFound = useMemo(
    () =>
      recipes.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search, recipes]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-8 md:mb-12">
            <input
              type="text"
              placeholder={t("searchRecipes")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md lg:max-w-lg mx-auto text-lg md:text-xl rounded-xl px-6 py-4 md:px-8 md:py-5 focus:ring-4 focus:outline-none focus:ring-orange-300 shadow-lg hover:shadow-xl transition-all bg-white dark:bg-stone-800 dark:text-white dark:border-stone-600"
            />

            {search && (
              <div
                className={clsx(
                  "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-md lg:max-w-lg bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-gray-100 dark:border-stone-700 max-h-60 overflow-y-auto z-20",
                  { hidden: recipesFound.length === recipes.length }
                )}
              >
                {recipesFound.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-stone-400 text-sm md:text-base">
                    {t("noRecipesFound")}
                  </div>
                ) : (
                  <div className="p-2">
                    {recipesFound.map((recipe) => (
                      <a
                        key={recipe.slug}
                        href={buildUrl(`/recipes/${recipe.slug}`)}
                        className="block p-3 md:p-4 hover:bg-orange-50 dark:hover:bg-stone-700 rounded-lg transition-all hover:scale-[1.02] group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base group-hover:text-orange-600 transition-colors truncate">
                              {recipe.title}
                            </h4>
                            {recipe.summary && (
                              <p className="text-xs md:text-sm text-gray-500 dark:text-stone-400 mt-1 line-clamp-1">
                                {recipe.summary}
                              </p>
                            )}
                          </div>
                          <span className="text-gray-400 dark:text-stone-500 group-hover:text-orange-500 ml-2 text-sm md:text-base">
                            →
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 mt-12 max-w-sm md:max-w-md mx-auto">
            <a
              href={buildUrl("/recipes")}
              className="bg-white dark:bg-stone-800 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-orange-100 dark:border-stone-600 hover:bg-white dark:hover:bg-stone-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl md:text-2xl">📖</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                {t("allRecipes")}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-stone-300 mt-1">
                {recipes.length} {t("available")}
              </p>
            </a>

            <a
              href={buildUrl("/recipes/new")}
              className="bg-white dark:bg-stone-800 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-orange-100 dark:border-stone-600 hover:bg-white dark:hover:bg-stone-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl md:text-2xl">➕</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                {t("addRecipe")}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-stone-300 mt-1">
                {t("createNewRecipe")}
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-stone-900 py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
              {t("ourBestRecipes")}
            </h2>
            <p className="text-gray-600 dark:text-stone-300 text-sm md:text-base lg:text-lg">
              {t("discoverPopularDishes")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {recipes.slice(0, 8).map((recipe) => (
              <a
                key={recipe.slug}
                href={buildUrl(`/recipes/${recipe.slug}`)}
                className="group bg-white dark:bg-stone-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-stone-700 hover:-translate-y-2"
              >
                <div className="relative h-32 md:h-40 lg:h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl lg:text-7xl transition-transform duration-300 group-hover:scale-110">
                    {recipe.emoji || "🍽️"}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                  <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center space-x-1">
                      <span className="text-orange-600 text-xs md:text-sm">
                        ⏱️
                      </span>
                      <span className="text-xs md:text-sm font-medium text-gray-800">
                        {recipe.time?.max
                          ? `${recipe.time.min}-${recipe.time.max}`
                          : recipe.time?.min}{" "}
                        {t("minutes")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-5 lg:p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base md:text-lg group-hover:text-orange-600 transition-colors leading-tight">
                    {recipe.title}
                  </h3>
                  {recipe.summary && (
                    <p className="text-gray-600 dark:text-stone-300 text-sm md:text-base line-clamp-2 leading-relaxed">
                      {recipe.summary}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <a
              href={buildUrl("/recipes")}
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base"
            >
              {t("seeAllRecipes")}
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-orange-500/5 to-red-500/5 dark:from-orange-500/10 dark:to-red-500/10">
        <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 md:mb-12 text-center">
            {t("exploreByCategory")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4 md:gap-6">
            {[
              {
                name: t("categoryQuick"),
                icon: "⚡",
                color: "from-emerald-400 to-green-500",
                tag: "quick",
              },
              {
                name: t("categorySweet"),
                icon: "🍰",
                color: "from-pink-400 to-rose-500",
                tag: "sweet",
              },
              {
                name: t("categorySavory"),
                icon: "🍲",
                color: "from-orange-400 to-red-500",
                tag: "savory",
              },
              {
                name: t("categorySoup"),
                icon: "🍜",
                color: "from-blue-400 to-indigo-500",
                tag: "soup",
              },
              {
                name: t("tagBbq"),
                icon: "🔥",
                color: "from-red-400 to-red-600",
                tag: "bbq",
              },
              {
                name: t("tagSpicy"),
                icon: "🌶️",
                color: "from-red-500 to-pink-500",
                tag: "spicy",
              },
              {
                name: t("tagDessert"),
                icon: "🧁",
                color: "from-purple-400 to-purple-600",
                tag: "dessert",
              },
              {
                name: t("tagAppetizer"),
                icon: "🥂",
                color: "from-yellow-400 to-amber-500",
                tag: "appetizer",
              },
              {
                name: t("categoryVegan"),
                icon: "🌱",
                color: "from-green-400 to-emerald-500",
                tag: "vegan",
              },
            ].map((category) => (
              <a
                key={category.tag}
                href={buildUrl(`/recipes?category=${category.tag}`)}
                className="group bg-white dark:bg-stone-800 rounded-2xl p-4 md:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-stone-700 text-center"
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-lg md:text-xl lg:text-2xl">
                    {category.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors text-sm md:text-base">
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-stone-400 mt-1">
                  {
                    recipes.filter((r) => r.tags.includes(category.tag as Tag))
                      .length
                  }{" "}
                  {t("recipes")}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
