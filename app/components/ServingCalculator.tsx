import { RiCalculatorLine, RiSubtractLine, RiAddLine } from "@remixicon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { ClientRecipe } from "~/services/recipe.server";
import { scaleRecipe } from "~/utils/unit-converter";

interface ServingCalculatorProps {
  recipe: ClientRecipe;
  onServingsChange?: (
    scaledIngredients: ClientRecipe["ingredients"],
    newServings: number
  ) => void;
}

export function ServingCalculator({
  recipe,
  onServingsChange,
}: ServingCalculatorProps) {
  const { t } = useTranslation();
  const [targetServings, setTargetServings] = useState(recipe.servings || 4);
  const [showCalculator, setShowCalculator] = useState(false);

  const originalServings = recipe.servings || 4;

  const handleServingsChange = (newServings: number) => {
    if (newServings < 1) return;

    setTargetServings(newServings);

    if (onServingsChange) {
      const scaledIngredients = scaleRecipe(
        recipe.ingredients,
        originalServings,
        newServings
      );
      onServingsChange(scaledIngredients, newServings);
    }
  };

  const incrementServings = () => {
    handleServingsChange(targetServings + 1);
  };

  const decrementServings = () => {
    handleServingsChange(Math.max(1, targetServings - 1));
  };

  const resetServings = () => {
    handleServingsChange(originalServings);
  };

  const scaleFactor = targetServings / originalServings;
  const isScaled = targetServings !== originalServings;

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg p-4 border border-gray-200 dark:border-stone-600">
      <button
        onClick={() => setShowCalculator(!showCalculator)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <RiCalculatorLine className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t("servingCalculator")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-stone-400">
              {targetServings} {t("servings")}
              {isScaled && (
                <span className="ml-1 text-orange-600 dark:text-orange-400">
                  (×{scaleFactor.toFixed(1)})
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="text-gray-400 dark:text-stone-500">
          {showCalculator ? "−" : "+"}
        </div>
      </button>

      {showCalculator && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-stone-600">
          <div className="space-y-4">
            {/* Current servings display */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-stone-400">
                {t("originalServings")}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {originalServings}
              </span>
            </div>

            {/* Servings adjuster */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-stone-400">
                {t("desiredServings")}:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={decrementServings}
                  disabled={targetServings <= 1}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RiSubtractLine className="w-4 h-4 text-gray-600 dark:text-stone-400" />
                </button>

                <input
                  type="number"
                  min="1"
                  value={targetServings}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      handleServingsChange(value);
                    }
                  }}
                  className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                  onClick={incrementServings}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <RiAddLine className="w-4 h-4 text-gray-600 dark:text-stone-400" />
                </button>
              </div>
            </div>

            {/* Scale factor display */}
            {isScaled && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-stone-400">
                  Scale factor:
                </span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  ×{scaleFactor.toFixed(2)}
                </span>
              </div>
            )}

            {/* Reset button */}
            {isScaled && (
              <button
                onClick={resetServings}
                className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-stone-700 text-gray-700 dark:text-stone-300 rounded-lg hover:bg-gray-200 dark:hover:bg-stone-600 transition-colors"
              >
                Reset to original ({originalServings} {t("servings")})
              </button>
            )}

            {/* Conversion note */}
            <div className="text-xs text-gray-500 dark:text-stone-500 bg-gray-50 dark:bg-stone-700 rounded p-3">
              <p className="mb-1">📝 Note:</p>
              <p>
                Ingredient quantities are automatically scaled. Cooking times
                may need adjustment for larger/smaller portions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
