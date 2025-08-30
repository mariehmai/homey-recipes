// Unit conversion utilities for European metric system

export type Unit = "g" | "kg" | "mL" | "L" | "tsp" | "tbsp" | "cup" | "n";

// Base conversion rates to grams/milliliters
const CONVERSIONS_TO_METRIC = {
  // Weight conversions to grams
  g: 1,
  kg: 1000,

  // Volume conversions to milliliters
  mL: 1,
  L: 1000,
  tsp: 5, // 1 tsp = 5 mL
  tbsp: 15, // 1 tbsp = 15 mL
  cup: 250, // 1 cup = 250 mL (European metric cup)

  // Unit (no conversion)
  n: 1,
};

export function convertToMetric(
  quantity: number,
  fromUnit: Unit
): { quantity: number; unit: Unit } {
  if (fromUnit === "n") {
    return { quantity, unit: "n" };
  }

  const isVolumeUnit = ["mL", "L", "tsp", "tbsp", "cup"].includes(fromUnit);
  const isWeightUnit = ["g", "kg"].includes(fromUnit);

  if (isVolumeUnit) {
    const mL = quantity * CONVERSIONS_TO_METRIC[fromUnit];
    // Convert to L if >= 1000mL for readability
    if (mL >= 1000) {
      return { quantity: mL / 1000, unit: "L" };
    }
    return { quantity: mL, unit: "mL" };
  }

  if (isWeightUnit) {
    const grams = quantity * CONVERSIONS_TO_METRIC[fromUnit];
    // Convert to kg if >= 1000g for readability
    if (grams >= 1000) {
      return { quantity: grams / 1000, unit: "kg" };
    }
    return { quantity: grams, unit: "g" };
  }

  return { quantity, unit: fromUnit };
}

export function convertUnit(
  quantity: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  if (fromUnit === toUnit || fromUnit === "n" || toUnit === "n") {
    return quantity;
  }

  // Convert to base metric unit first
  const baseQuantity = quantity * CONVERSIONS_TO_METRIC[fromUnit];

  // Convert from base metric to target unit
  return baseQuantity / CONVERSIONS_TO_METRIC[toUnit];
}

export function scaleRecipe(
  ingredients: Array<{ quantity: string | number; unit: Unit; name: string }>,
  originalServings: number,
  targetServings: number
) {
  if (originalServings === 0) return ingredients;

  const scaleFactor = targetServings / originalServings;

  return ingredients.map((ingredient) => {
    const numQuantity =
      typeof ingredient.quantity === "string"
        ? parseFloat(ingredient.quantity)
        : ingredient.quantity;

    if (isNaN(numQuantity)) return ingredient;

    const scaledQuantity = numQuantity * scaleFactor;

    return {
      ...ingredient,
      quantity: formatQuantity(scaledQuantity),
    };
  });
}

export function formatQuantity(quantity: number): string {
  // Round to reasonable precision
  if (quantity < 0.1) {
    return quantity.toFixed(2);
  } else if (quantity < 1) {
    return quantity.toFixed(1);
  } else if (quantity < 10) {
    return quantity.toFixed(1);
  } else {
    return Math.round(quantity).toString();
  }
}

// Common ingredient densities for weight/volume conversions (g/mL)
export const INGREDIENT_DENSITIES: Record<string, number> = {
  // Liquids
  water: 1,
  milk: 1.03,
  cream: 1.01,
  oil: 0.92,
  honey: 1.4,
  syrup: 1.3,

  // Dry ingredients (approximate)
  flour: 0.57,
  sugar: 0.85,
  salt: 1.2,
  butter: 0.91,
  cocoa: 0.41,
  "baking powder": 0.9,
  vanilla: 0.88,
};

export function convertWeightToVolume(
  weight: number,
  ingredient: string
): number {
  const density = INGREDIENT_DENSITIES[ingredient.toLowerCase()] || 1;
  return weight / density;
}

export function convertVolumeToWeight(
  volume: number,
  ingredient: string
): number {
  const density = INGREDIENT_DENSITIES[ingredient.toLowerCase()] || 1;
  return volume * density;
}
