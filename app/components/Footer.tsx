import { Link } from "@remix-run/react";
import { RiBookOpenLine, RiAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";

import { toTitleCase } from "~/utils/stringExtensions";

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    {
      to: "/recipes",
      label: t("navRecipes"),
      icon: RiBookOpenLine,
    },
    {
      to: "/recipes/new",
      label: t("addNewRecipe"),
      icon: RiAddLine,
    },
  ];

  const categories = [
    { to: "/recipes?category=quick", label: t("categoryQuick") },
    { to: "/recipes?category=sweet", label: t("categorySweet") },
    { to: "/recipes?category=savory", label: t("categorySavory") },
    { to: "/recipes?category=soup", label: t("categorySoup") },
  ];

  return (
    <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                <img
                  alt="app-logo"
                  className="text-white text-xl"
                  src="/favicon.svg"
                />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                {t("homeyRecipesTitle")}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-stone-400 leading-relaxed">
              {t("appCatchPhrase")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center space-x-3 text-sm text-gray-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("categories")}
            </h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.to}>
                  <Link
                    to={category.to}
                    className="text-sm text-gray-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500 dark:text-stone-500">
              © 2024-2025 {t("homeyRecipesTitle")}. {t("allRightsReserved")}.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-stone-500">
              <Link
                to="mailto:mai.mariehelene@gmail.com"
                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {toTitleCase(t("contact"))}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
