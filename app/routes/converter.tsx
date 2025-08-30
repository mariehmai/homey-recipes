import type { MetaFunction } from "@remix-run/node";
import { RiScalesLine, RiDivideLine, RiDropLine } from "@remixicon/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import {
  convertUnit,
  convertWeightToVolume,
  convertVolumeToWeight,
  formatQuantity,
  INGREDIENT_DENSITIES,
} from "~/utils/unit-converter";
import type { Unit } from "~/utils/unit-converter";

export const meta: MetaFunction = () => {
  return [{ title: "Unit Converter - Homey Recipes" }];
};

export default function Converter() {
  const { t } = useTranslation();

  // Unit converter state
  const [fromUnit, setFromUnit] = useState<Unit>("cup");
  const [toUnit, setToUnit] = useState<Unit>("mL");
  const [amount, setAmount] = useState<string>("1");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  // Weight/Volume converter state
  const [ingredientName, setIngredientName] = useState<string>("flour");
  const [weightVolume, setWeightVolume] = useState<string>("100");
  const [convertDirection, setConvertDirection] = useState<
    "weightToVolume" | "volumeToWeight"
  >("weightToVolume");
  const [weightVolumeResult, setWeightVolumeResult] = useState<number | null>(
    null
  );

  const units: Unit[] = ["g", "kg", "mL", "L", "tsp", "tbsp", "cup"];

  const handleUnitConversion = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    const result = convertUnit(numAmount, fromUnit, toUnit);
    setConvertedAmount(result);
  };

  const handleWeightVolumeConversion = () => {
    const numAmount = parseFloat(weightVolume);
    if (isNaN(numAmount)) return;

    if (convertDirection === "weightToVolume") {
      const result = convertWeightToVolume(numAmount, ingredientName);
      setWeightVolumeResult(result);
    } else {
      const result = convertVolumeToWeight(numAmount, ingredientName);
      setWeightVolumeResult(result);
    }
  };

  const ingredientOptions = Object.keys(INGREDIENT_DENSITIES);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {t("unitConverter")}
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Basic Unit Converter */}
        <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <RiScalesLine className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("unitConverter")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                {t("amount")}
              </label>
              <input
                type="number"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                {t("fromUnit")}
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as Unit)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`unit${unit.charAt(0).toUpperCase() + unit.slice(1)}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                {t("toUnit")}
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as Unit)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`unit${unit.charAt(0).toUpperCase() + unit.slice(1)}`)}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleUnitConversion}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {t("convert")}
            </button>
          </div>

          {convertedAmount !== null && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-stone-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <RiDivideLine className="w-5 h-5 text-gray-500 dark:text-stone-400" />
                <span className="text-sm text-gray-600 dark:text-stone-300">
                  {t("result")}:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatQuantity(convertedAmount)}{" "}
                  {t(`unit${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}`)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Weight/Volume Converter */}
        <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <RiDropLine className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("weightVolumeConverter")}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                  {t("ingredient")}
                </label>
                <select
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {ingredientOptions.map((ingredient) => (
                    <option key={ingredient} value={ingredient}>
                      {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="conversionType"
                  className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
                >
                  {t("conversionType")}
                </label>
                <select
                  id="conversionType"
                  value={convertDirection}
                  onChange={(e) =>
                    setConvertDirection(
                      e.target.value as "weightToVolume" | "volumeToWeight"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="weightToVolume">
                    Weight → Volume (g → mL)
                  </option>
                  <option value="volumeToWeight">
                    Volume → Weight (mL → g)
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2">
                  {convertDirection === "weightToVolume"
                    ? "Weight (g)"
                    : "Volume (mL)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightVolume}
                  onChange={(e) => setWeightVolume(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="100"
                />
              </div>

              <button
                onClick={handleWeightVolumeConversion}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {t("convert")}
              </button>
            </div>

            {weightVolumeResult !== null && (
              <div className="p-4 bg-gray-50 dark:bg-stone-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <RiDropLine className="w-5 h-5 text-gray-500 dark:text-stone-400" />
                  <span className="text-sm text-gray-600 dark:text-stone-300">
                    {t("result")}:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatQuantity(weightVolumeResult)}{" "}
                    {convertDirection === "weightToVolume" ? "mL" : "g"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Reference
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-stone-200 mb-2">
                Volume
              </h4>
              <ul className="text-sm text-gray-600 dark:text-stone-400 space-y-1">
                <li>1 tsp = 5 mL</li>
                <li>1 tbsp = 15 mL</li>
                <li>1 cup = 250 mL</li>
                <li>1 L = 1000 mL</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-stone-200 mb-2">
                Weight
              </h4>
              <ul className="text-sm text-gray-600 dark:text-stone-400 space-y-1">
                <li>1 kg = 1000 g</li>
                <li>1 cup flour ≈ 125-140 g</li>
                <li>1 cup sugar ≈ 200 g</li>
                <li>1 cup butter ≈ 225 g</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
