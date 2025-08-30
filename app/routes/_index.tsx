import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { recipes, Tag } from "~/utils/recipes";

export const meta: MetaFunction = () => {
  return [
    { title: "Homey Recipes" },
    {
      name: "description",
      content:
        "Discover, create, and savor the perfect recipe for every occasion – where delicious meals meet effortless cooking at home.",
    },
  ];
};

export default function Index() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const recipesFound = useMemo(
    () =>
      recipes.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <section className="relative min-h-screen bg-home bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 text-center max-w-2xl lg:max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
            <mark className="text-zinc-50 bg-zinc-900 bg-opacity-50 px-2 md:px-4 py-1 md:py-2 leading-relaxed">
              {t("appCatchPhrase")}
            </mark>
          </h1>

          <div className="relative mb-8 md:mb-12">
            <input
              type="text"
              placeholder={t("searchRecipes")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md lg:max-w-lg mx-auto text-lg md:text-xl rounded-xl px-6 py-4 md:px-8 md:py-5 focus:ring-4 focus:outline-none focus:ring-amber-300 shadow-lg hover:shadow-xl transition-all"
            />

            {search && (
              <div
                className={clsx(
                  "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-md lg:max-w-lg bg-white rounded-xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-20",
                  { hidden: recipesFound.length === recipes.length }
                )}
              >
                {recipesFound.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm md:text-base">
                    Aucune recette trouvée
                  </div>
                ) : (
                  <div className="p-2">
                    {recipesFound.map((recipe) => (
                      <Link
                        key={recipe.slug}
                        to={`/recipes/${recipe.slug}`}
                        className="block p-3 md:p-4 hover:bg-orange-50 rounded-lg transition-all hover:scale-[1.02] group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm md:text-base group-hover:text-orange-600 transition-colors truncate">
                              {recipe.title}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-1">
                              {recipe.summary}
                            </p>
                          </div>
                          <span className="text-gray-400 group-hover:text-orange-500 ml-2 text-sm md:text-base">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 mt-12 max-w-sm md:max-w-md mx-auto">
            <Link
              to="/recipes"
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-orange-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl md:text-2xl">📖</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                Toutes les recettes
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {recipes.length} disponibles
              </p>
            </Link>

            <Link
              to="/recipes?category=quick"
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-orange-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl md:text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                Recettes rapides
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {recipes.filter((r) => r.tags.includes("quick")).length}{" "}
                recettes
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Nos meilleures recettes
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              Découvrez nos plats les plus populaires
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {recipes.slice(0, 8).map((recipe) => (
              <Link
                key={recipe.slug}
                to={`/recipes/${recipe.slug}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
              >
                <div className="relative h-32 md:h-40 lg:h-48 bg-gradient-to-br from-orange-100 to-red-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('/assets/${recipe.slug}.jpeg')`,
                      backgroundSize: "cover",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center space-x-1">
                      <span className="text-orange-600 text-xs md:text-sm">
                        ⏱️
                      </span>
                      <span className="text-xs md:text-sm font-medium text-gray-800">
                        {recipe.time?.max
                          ? `${recipe.time.min}-${recipe.time.max}`
                          : recipe.time?.min}{" "}
                        min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-5 lg:p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-base md:text-lg group-hover:text-orange-600 transition-colors leading-tight">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base line-clamp-2 leading-relaxed">
                    {recipe.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/recipes"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base"
            >
              Voir toutes les recettes
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
            Explorez par catégorie
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4 md:gap-6">
            {[
              {
                name: "Rapide",
                icon: "⚡",
                color: "from-emerald-400 to-green-500",
                tag: "quick",
              },
              {
                name: "Sucré",
                icon: "🍰",
                color: "from-pink-400 to-rose-500",
                tag: "sweet",
              },
              {
                name: "Salé",
                icon: "🍲",
                color: "from-orange-400 to-red-500",
                tag: "savory",
              },
              {
                name: "Soupes",
                icon: "🍜",
                color: "from-blue-400 to-indigo-500",
                tag: "soup",
              },
              {
                name: "BBQ",
                icon: "🔥",
                color: "from-red-400 to-red-600",
                tag: "bbq",
              },
              {
                name: "Épicé",
                icon: "🌶️",
                color: "from-red-500 to-pink-500",
                tag: "spicy",
              },
              {
                name: "Desserts",
                icon: "🧁",
                color: "from-purple-400 to-purple-600",
                tag: "dessert",
              },
              {
                name: "Apéritif",
                icon: "🥂",
                color: "from-yellow-400 to-amber-500",
                tag: "appetizer",
              },
            ].map((category) => (
              <Link
                key={category.tag}
                to={`/recipes?category=${category.tag}`}
                className="group bg-white rounded-2xl p-4 md:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center"
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-lg md:text-xl lg:text-2xl">
                    {category.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-sm md:text-base">
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {
                    recipes.filter((r) => r.tags.includes(category.tag as Tag))
                      .length
                  }{" "}
                  recettes
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
