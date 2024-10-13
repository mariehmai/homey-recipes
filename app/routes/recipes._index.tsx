import type { MetaFunction } from "@remix-run/node";
import { useNavigate, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { Recipe, recipes as recipesMock, Tag } from "~/utils/recipes";

const tagStyle =
  "rounded-full px-3 py-1 text-xs font-semibold text-white mr-2 mb-2 hover:shadow-md hover:opacity-80";

export const meta: MetaFunction = () => {
  return [{ title: "Recipes" }];
};

export default function Recipes() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const recipes = searchParams.get("category")
    ? recipesMock.filter((r) =>
        r.tags.includes(searchParams.get("category") as never)
      )
    : recipesMock;

  function selectCategory(category: string) {
    searchParams.set("category", category);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  }

  return (
    <div className="flex flex-col gap-12 p-4 sm:p-12">
      <h1 className="text-4xl">{t("recipesPageTitle")}</h1>
      <div className="flex gap-2 flex-wrap justify-center">
        <h2 className="font-bold">{t("categoryFilter")}:</h2>
        <button
          className={clsx(tagStyle, `bg-black`)}
          onClick={() => setSearchParams()}
        >
          All
        </button>
        {tagsProps.map((t) => (
          <button
            key={t.name}
            className={clsx(tagStyle, "bg-amber-400")}
            onClick={() => selectCategory(t.name)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <ul className="flex justify-center flex-wrap gap-10">
        {recipes.map((r) => (
          <RecipeCard
            key={r.slug}
            {...r}
            goToRecipe={(slug: string) => navigate(`/recipes/${slug}`)}
            selectCategory={selectCategory}
          />
        ))}
      </ul>
    </div>
  );
}

const tagsProps = [
  { name: "sweet", color: "teal" },
  { name: "dessert", color: "amber" },
  { name: "savory", color: "red" },
  { name: "bbq", color: "indigo" },
  { name: "soup", color: "purple" },
  { name: "quick", color: "lime" },
  { name: "spicy", color: "slate" },
  { name: "appetizer", color: "emerald" },
] as {
  name: Tag;
  color: string;
}[];

type RecipeProps = Recipe & {
  goToRecipe: (slug: string) => void;
  selectCategory: (category: Tag) => void;
};

const RecipeCard: FunctionComponent<RecipeProps> = ({
  slug,
  title,
  summary,
  time = { min: 10, max: 50 },
  tags,
  goToRecipe,
  selectCategory,
}) => {
  return (
    <li className="w-full md:max-w-sm rounded-xl overflow-hidden shadow-lg">
      <button
        style={{
          backgroundImage: `url('/assets/${slug}.jpeg')`,
          backgroundPosition: "center",
          backgroundSize: 400,
        }}
        className={clsx(`w-full text-start px-6 py-4 h-[120px]")]`)}
        onClick={() => goToRecipe(slug)}
      >
        <h3 className="font-bold text-xl mb-2">
          <mark className="text-zinc-200 bg-zinc-900 bg-opacity-50">
            {title}
          </mark>
        </h3>
        <p className="text-gray-700 text-sm line-clamp-4">
          <mark className="text-zinc-200 bg-zinc-900 bg-opacity-50">
            {time.min}
            {time.max && `- ${time.max}min`}
          </mark>
        </p>
      </button>
      <div className="px-6 pt-4 pb-2">
        <p className="text-gray-700 text-sm line-clamp-4 pb-4">{summary}</p>
        {tags.length > 0 &&
          tags.map((t) => (
            <button
              key={`${title}-${t}`}
              className={clsx(tagStyle, "bg-amber-400")}
              onClick={() => selectCategory(t)}
            >
              #{t}
            </button>
          ))}
      </div>
    </li>
  );
};
