import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { recipes } from "~/utils/recipes";

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
  const [search, setSearch] = useState<string>("");
  const recipesFound = useMemo(
    () => recipes.filter((r) => r.title.toLowerCase().includes(search)),
    [search]
  );

  return (
    <div className="px-4 flex flex-col justify-center items-center gap-12 bg-home h-screen bg-cover bg-no-repeat">
      <h2 className="text-3xl font-bold p-4 mx-auto text-center max-w-[840px]">
        <mark className="text-zinc-50 bg-zinc-900 bg-opacity-50 leading-10">
          {t("appCatchPhrase")}
        </mark>
      </h2>
      <div className="w-full flex flex-col items-center gap-4 relative">
        <input
          id="dropdownDefaultInput"
          data-dropdown-toggle="dropdown"
          className="w-full max-w-[600px] text-xl rounded-lg px-4 py-2 focus:ring-4 focus:outline-none focus:ring-amber-300"
          placeholder={t("searchRecipes")}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <div
          id="dropdown"
          className={clsx(
            "max-h-[250px] overflow-scroll absolute top-14 bg-white divide-y divide-slate-100 rounded-lg shadow w-44 dark:bg-slate-700",
            {
              hidden: recipesFound.length === recipes.length,
            }
          )}
        >
          <ul
            className="py-2 text-sm text-slate-700 dark:text-slate-200"
            aria-labelledby="dropdownDefaultInput"
          >
            {recipesFound.length === 0 ? (
              <li>
                <p className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white">
                  No recipes found
                </p>
              </li>
            ) : (
              recipesFound.map((r) => (
                <li key={r.slug}>
                  <a
                    href={`/recipes/${r.slug}`}
                    className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white"
                  >
                    {r.title}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
