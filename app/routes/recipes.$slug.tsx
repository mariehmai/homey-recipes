import type { MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import clsx from "clsx";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import { recipes } from "~/utils/recipes";
import { toTitleCase } from "~/utils/stringExtensions";

export const meta: MetaFunction = () => {
  return [{ title: "Recipe" }];
};

const unitLabels = {
  n: "",
  g: "g",
  mL: "mL",
  tsp: "c. à thé",
  tbsp: "c. à soupe",
  cup: "tasse",
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

export default function Recipe() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const recipe = recipes.find((r) => r.slug === slug);
  const [selectedTab, setSelectedTab] = useState("ingredients");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [checkedInstructions, setCheckedInstructions] = useState<Set<string>>(
    new Set()
  );
  const [isFavorite, setIsFavorite] = useState(false);

  if (!recipe) return null;

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
    const unit = unitLabels[ingredient.unit] || ingredient.unit;
    return `${ingredient.quantity} ${unit}`.trim();
  }

  function tabContent() {
    if (!recipe) return null;

    switch (selectedTab) {
      case "ingredients":
        return (
          <div className="space-y-3">
            {recipe.ingredients.map((ingredient, idx) => (
              <button
                key={idx}
                className={clsx(
                  "flex items-center space-x-3 p-3 md:p-4 rounded-lg border cursor-pointer transition-all w-full text-left",
                  checkedIngredients.has(ingredient.name)
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200 hover:bg-gray-50 active:bg-gray-50"
                )}
                onClick={() => onToggleIngredient(ingredient.name)}
              >
                <div
                  className={clsx(
                    "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    checkedIngredients.has(ingredient.name)
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
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
                        ? "text-green-700 line-through"
                        : "text-gray-900"
                    )}
                  >
                    {formatQuantity(ingredient)}
                  </div>
                  <div
                    className={clsx(
                      "text-xs md:text-sm transition-all",
                      checkedIngredients.has(ingredient.name)
                        ? "text-green-600 line-through"
                        : "text-gray-600"
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
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:bg-gray-50 active:bg-gray-50"
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
                          ? "text-green-700 line-through"
                          : "text-gray-900"
                      )}
                    >
                      {instruction.description}
                    </p>
                  </div>
                </button>
              );
            })}

            <div className="mt-6 bg-white rounded-lg p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm md:text-base font-medium text-gray-700">
                  Progression
                </span>
                <span className="text-sm md:text-base font-bold text-orange-600">
                  {Math.round(
                    (checkedInstructions.size / recipe.instructions.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (checkedInstructions.size / recipe.instructions.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <BackButton />

            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={clsx(
                  "p-2 md:p-3 rounded-full transition-all hover:scale-105",
                  isFavorite ? "bg-red-100" : "bg-gray-100 hover:bg-gray-200"
                )}
              >
                <span className="text-lg md:text-xl">
                  {isFavorite ? "❤️" : "🤍"}
                </span>
              </button>
              <button className="p-2 md:p-3 rounded-full bg-gray-100 transition-all hover:bg-gray-200 hover:scale-105">
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
                className={`px-3 py-1 md:px-4 md:py-2 ${tagColors[tag]} text-white text-xs md:text-sm rounded-full font-medium`}
              >
                #{t(`tag${toTitleCase(tag)}`)}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
            {recipe.title}
          </h1>

          <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base lg:text-lg">
            {recipe.summary}
          </p>

          <div className="flex items-center space-x-4 md:space-x-6 text-sm md:text-base text-gray-500 mb-6 md:mb-8">
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-orange-500 text-base md:text-lg">⏱️</span>
              <span className="font-medium">
                {recipe.time?.max
                  ? `${recipe.time.min}-${recipe.time.max}`
                  : recipe.time?.min}{" "}
                min
              </span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-orange-500 text-base md:text-lg">👥</span>
              <span className="font-medium">4-6 personnes</span>
            </div>
          </div>

          <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 mb-6 md:mb-8">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: `url('/assets/${recipe.slug}.jpeg')`,
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 mb-6 lg:mb-0">
            <div className="flex lg:flex-col bg-gray-100 rounded-xl p-1 lg:space-y-1 lg:space-x-0 space-x-0">
              <Tab
                isSelected={selectedTab === "ingredients"}
                label={`${t("ingredients")} (${recipe.ingredients.length})`}
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
          </div>

          <div className="lg:col-span-9">
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
          "bg-white text-gray-900 shadow-sm": isSelected,
          "text-gray-600 hover:text-gray-800 hover:bg-gray-50": !isSelected,
          "flex-1": !isDesktop,
        }
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
