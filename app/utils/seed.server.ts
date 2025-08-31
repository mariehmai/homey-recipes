import { queries } from "./db.server";
import type { Recipe } from "./recipes";

const defaultRecipes: Recipe[] = [
  {
    slug: "riz-saute",
    title: "Riz Sauté",
    summary:
      "Riz sauté à base de restes de la veille, parfait pour utiliser les restes",
    emoji: "🍚",
    ingredients: [
      { unit: "n", name: "carottes", quantity: "3" },
      { unit: "n", quantity: "0.5", name: "blanc de poireaux" },
      { unit: "g", quantity: "200", name: "reste de poulet ou protéine" },
      { unit: "g", quantity: "200", name: "reste de riz de la veille" },
      { unit: "n", quantity: "2", name: "oeufs" },
      { unit: "n", quantity: "", name: "cébette" },
      { unit: "n", quantity: "", name: "coriandre fraîche" },
      { unit: "tbsp", quantity: "2", name: "sauce maggi" },
      { unit: "tbsp", quantity: "1", name: "sauce huître" },
      { unit: "tbsp", quantity: "1", name: "huile de sésame" },
      { unit: "tbsp", quantity: "4", name: "huile végétale" },
      { unit: "tbsp", quantity: "1", name: "vinaigre de riz" },
      { unit: "tsp", quantity: "2", name: "poivre blanc" },
    ],
    time: { min: 10, max: 20 },
    instructions: [
      {
        description:
          "Faire revenir les carottes dans un tout petit fond d'eau.",
      },
      {
        description:
          "Une fois l'eau évaporée, ajouter de l'huile végétale et les poireaux et faire revenir.",
      },
      {
        description:
          "Ajouter la viande, bien mélanger puis ajouter le vinaigre de riz, la sauce huître et l'huile de sésame et remuer.",
      },
      {
        description:
          "Faire de la place sur le côté du wok et ajouter encore un peu d'huile et faire cuire les œufs. Une fois cuit mélanger avec le reste.",
      },
      {
        description:
          "Ajouter le riz et mélanger. Mettre du maggi, du poivre blanc, et la cébette et remuer.",
      },
      {
        description:
          "Éteindre le feu et finir en ajoutant la coriandre. Goûter et ajuster.",
      },
    ],
    tags: ["savory", "quick"],
  },
  {
    slug: "poulet-curry-jaune",
    title: "Poulet au curry jaune",
    summary:
      "Curry thaï authentique au lait de coco, doux et parfumé aux épices traditionnelles",
    emoji: "🍛",
    ingredients: [
      { unit: "tbsp", quantity: "5", name: "pâte de curry jaune" },
      { unit: "g", quantity: "900", name: "cuisses de poulet avec os" },
      { unit: "mL", quantity: "480", name: "lait de coco" },
      { unit: "g", quantity: "300", name: "pommes de terre nouvelles" },
      { unit: "n", quantity: "0.5", name: "oignon jaune" },
      { unit: "mL", quantity: "240", name: "eau" },
      { unit: "tbsp", quantity: "2", name: "sauce de poisson" },
      { unit: "tbsp", quantity: "1.5", name: "sucre de palme" },
      { unit: "tbsp", quantity: "1", name: "pâte de tamarin" },
      { unit: "cup", quantity: "1", name: "tomates cerises" },
      { unit: "n", quantity: "", name: "échalotes frites pour garnir" },
    ],
    time: { min: 45, max: 80 },
    instructions: [
      {
        description:
          "Porter 180ml de lait de coco à ébullition, ajouter la pâte de curry et mélanger.",
      },
      {
        description:
          "Cuire jusqu'à ce que l'huile de coco se sépare (5-8 minutes).",
      },
      {
        description:
          "Ajouter le reste du lait de coco, le poulet, sauce de poisson, sucre et tamarin.",
      },
      {
        description:
          "Ajouter juste assez d'eau pour couvrir le poulet et mijoter 30 minutes.",
      },
      {
        description:
          "Ajouter pommes de terre et oignon, cuire 15 minutes jusqu'à tendreté.",
      },
      { description: "Piquer les tomates et les ajouter en fin de cuisson." },
      {
        description: "Servir avec du riz jasmin et garnir d'échalotes frites.",
      },
    ],
    tags: ["savory", "spicy"],
  },
  {
    slug: "pancake-banane",
    title: "Pancakes à la banane",
    summary:
      "Pancakes moelleux aux bananes écrasées, parfaits pour un petit-déjeuner gourmand",
    emoji: "🥞",
    ingredients: [
      { unit: "n", name: "bananes mûres", quantity: "2" },
      { unit: "g", quantity: "200", name: "farine" },
      { unit: "n", quantity: "2", name: "œufs" },
      { unit: "mL", quantity: "250", name: "lait" },
      { unit: "tbsp", quantity: "2", name: "sucre" },
      { unit: "tsp", quantity: "1", name: "levure chimique" },
      { unit: "n", quantity: "", name: "beurre pour la cuisson" },
    ],
    time: { min: 15, max: 20 },
    instructions: [
      { description: "Écraser les bananes à la fourchette." },
      { description: "Mélanger la farine, sucre et levure dans un bol." },
      {
        description:
          "Battre les œufs avec le lait puis incorporer aux bananes.",
      },
      { description: "Mélanger le tout sans trop travailler la pâte." },
      { description: "Cuire dans une poêle beurrée, 2-3 minutes par face." },
      { description: "Servir chaud avec sirop d'érable." },
    ],
    tags: ["sweet", "dessert", "quick"],
  },
  {
    slug: "crepes-sucrees",
    title: "Crêpes sucrées",
    summary:
      "Crêpes françaises classiques fines et délicates, parfaites pour le dessert",
    emoji: "🥞",
    ingredients: [
      { unit: "g", quantity: "250", name: "farine tout usage" },
      { unit: "n", quantity: "", name: "pincée de sel" },
      { unit: "tbsp", quantity: "1", name: "sucre en poudre" },
      { unit: "n", quantity: "3", name: "gros œufs" },
      { unit: "mL", quantity: "600", name: "lait entier" },
      { unit: "g", quantity: "50", name: "beurre non salé fondu" },
      { unit: "tsp", quantity: "1", name: "extrait de vanille" },
      {
        unit: "n",
        quantity: "",
        name: "beurre supplémentaire pour la cuisson",
      },
    ],
    time: { min: 90, max: 120 },
    instructions: [
      { description: "Mélanger farine, sel et sucre dans un grand bol." },
      { description: "Faire un puits au centre et ajouter les œufs." },
      {
        description:
          "Incorporer 240ml de lait en fouettant du centre vers l'extérieur.",
      },
      {
        description:
          "Ajouter progressivement le reste du lait en fouettant jusqu'à obtenir une pâte lisse.",
      },
      {
        description:
          "Couvrir et laisser reposer au réfrigérateur 1 heure minimum.",
      },
      { description: "Incorporer le beurre fondu et la vanille." },
      { description: "Chauffer une poêle à crêpes de 25cm à feu moyen." },
      { description: "Beurrer légèrement la poêle." },
      {
        description:
          "Verser 60ml de pâte au centre et faire tourner immédiatement.",
      },
      {
        description:
          "Cuire 40-60 secondes jusqu'à ce que les bords soient dorés.",
      },
      { description: "Retourner délicatement, cuire 20-30 secondes de plus." },
      {
        description:
          "Empiler les crêpes avec du papier sulfurisé entre chacune.",
      },
    ],
    tags: ["sweet", "dessert"],
  },
];

export function seedDefaultRecipes(): boolean {
  try {
    console.log("🌱 Seeding default recipes...");

    if (!queries) {
      console.error("❌ Database queries not initialized");
      return false;
    }

    // Check if we already have default recipes
    const { count } = queries.countDefaultRecipes.get() as { count: number };

    if (count > 0) {
      console.log(`✅ Default recipes already seeded (${count} recipes)`);
      return true;
    }

    let seedCount = 0;

    // Insert all default recipes
    for (const recipe of defaultRecipes) {
      try {
        queries.insertRecipe.run(
          recipe.slug,
          recipe.title,
          recipe.summary || "",
          recipe.emoji || null,
          recipe.time?.min || null,
          recipe.time?.max || null,
          recipe.servings || null,
          JSON.stringify(recipe.tags),
          JSON.stringify(recipe.ingredients),
          JSON.stringify(recipe.instructions),
          recipe.author || "Chef",
          1 // is_default = true
        );

        seedCount++;
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "SQLITE_CONSTRAINT_UNIQUE"
        ) {
          console.log(`⚠️  Recipe ${recipe.slug} already exists, skipping`);
          continue;
        }
        throw error;
      }
    }

    console.log(`✅ Seeded ${seedCount} default recipes successfully`);
    return true;
  } catch (error) {
    console.error("❌ Error seeding default recipes:", error);
    return false;
  }
}

export function getDefaultRecipesList(): Recipe[] {
  return defaultRecipes;
}
