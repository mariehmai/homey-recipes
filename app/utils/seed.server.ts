import { queries } from "./db.server";
import type { Recipe } from "./recipes";

const defaultTags = [
  { name: "quick", displayName: "Quick" },
  { name: "sweet", displayName: "Sweet" },
  { name: "savory", displayName: "Savory" },
  { name: "soup", displayName: "Soup" },
  { name: "bbq", displayName: "BBQ" },
  { name: "spicy", displayName: "Spicy" },
  { name: "dessert", displayName: "Dessert" },
  { name: "appetizer", displayName: "Appetizer" },
  { name: "vegan", displayName: "Vegan" },
];

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
    isPublic: true,
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
    isPublic: true,
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
    isPublic: true,
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
    isPublic: true,
  },
  {
    slug: "shakshuka-vegan",
    title: "Vegan Shakshuka",
    summary:
      "A plant-based version of the Middle Eastern classic with tomatoes, bell peppers, and aromatic spices",
    emoji: "🍅",
    ingredients: [
      { unit: "tbsp", quantity: "2", name: "olive oil" },
      { unit: "n", quantity: "1", name: "large onion, diced" },
      { unit: "n", quantity: "1", name: "red bell pepper, diced" },
      { unit: "n", quantity: "4", name: "garlic cloves, minced" },
      { unit: "tsp", quantity: "1", name: "ground cumin" },
      { unit: "tsp", quantity: "1", name: "paprika" },
      { unit: "tsp", quantity: "0.5", name: "cayenne pepper" },
      { unit: "g", quantity: "800", name: "canned crushed tomatoes" },
      { unit: "tsp", quantity: "1", name: "salt" },
      { unit: "tsp", quantity: "0.5", name: "black pepper" },
      { unit: "n", quantity: "0.25", name: "cup fresh parsley, chopped" },
      { unit: "n", quantity: "", name: "pita bread for serving" },
    ],
    time: { min: 25, max: 35 },
    instructions: [
      {
        description: "Heat olive oil in a large skillet over medium heat.",
      },
      {
        description:
          "Add onion and bell pepper, cook for 5 minutes until softened.",
      },
      {
        description:
          "Add garlic, cumin, paprika, and cayenne. Cook for 1 minute until fragrant.",
      },
      {
        description:
          "Add crushed tomatoes, salt, and pepper. Simmer for 15-20 minutes.",
      },
      {
        description: "Taste and adjust seasoning as needed.",
      },
      {
        description:
          "Garnish with fresh parsley and serve with warm pita bread.",
      },
    ],
    tags: ["vegan", "savory", "quick"],
    isPublic: true,
  },
  {
    slug: "pho-bo",
    title: "Pho Bo (Vietnamese Beef Soup)",
    summary:
      "Authentic Vietnamese beef noodle soup with aromatic broth, rice noodles, and tender beef",
    emoji: "🍜",
    ingredients: [
      { unit: "kg", quantity: "1", name: "beef bones" },
      { unit: "g", quantity: "500", name: "beef brisket" },
      { unit: "n", quantity: "1", name: "large onion, halved" },
      { unit: "n", quantity: "1", name: "piece of ginger, 5cm" },
      { unit: "n", quantity: "3", name: "star anise" },
      { unit: "n", quantity: "1", name: "cinnamon stick" },
      { unit: "n", quantity: "6", name: "cloves" },
      { unit: "tbsp", quantity: "2", name: "fish sauce" },
      { unit: "tbsp", quantity: "1", name: "salt" },
      { unit: "g", quantity: "400", name: "rice noodles (banh pho)" },
      { unit: "g", quantity: "200", name: "raw beef sirloin, thinly sliced" },
      { unit: "n", quantity: "", name: "bean sprouts" },
      { unit: "n", quantity: "", name: "fresh herbs (cilantro, basil, mint)" },
      { unit: "n", quantity: "", name: "lime wedges" },
    ],
    time: { min: 180, max: 240 },
    instructions: [
      {
        description:
          "Char onion and ginger over open flame until blackened. Rinse and set aside.",
      },
      {
        description:
          "Toast star anise, cinnamon, and cloves in a dry pan for 2 minutes.",
      },
      {
        description:
          "In a large pot, add beef bones, brisket, charred vegetables, and spices.",
      },
      {
        description:
          "Cover with water and bring to a boil. Skim foam and simmer for 3-4 hours.",
      },
      {
        description: "Remove brisket after 1 hour, slice thinly when cool.",
      },
      {
        description: "Strain broth and season with fish sauce and salt.",
      },
      {
        description: "Cook rice noodles according to package instructions.",
      },
      {
        description:
          "Serve noodles in bowls, top with cooked and raw beef, pour hot broth over.",
      },
      {
        description:
          "Serve with bean sprouts, herbs, and lime wedges on the side.",
      },
    ],
    tags: ["soup", "savory"],
    isPublic: true,
  },
  {
    slug: "frango-assado",
    title: "Frango Assado (Portuguese Roasted Chicken)",
    summary:
      "Traditional Portuguese roasted chicken marinated in garlic, bay leaves, and white wine",
    emoji: "🍗",
    ingredients: [
      { unit: "kg", quantity: "1.5", name: "whole chicken" },
      { unit: "n", quantity: "8", name: "garlic cloves, minced" },
      { unit: "n", quantity: "4", name: "bay leaves" },
      { unit: "mL", quantity: "120", name: "white wine" },
      { unit: "tbsp", quantity: "3", name: "olive oil" },
      { unit: "tbsp", quantity: "2", name: "paprika" },
      { unit: "tsp", quantity: "2", name: "salt" },
      { unit: "tsp", quantity: "1", name: "black pepper" },
      { unit: "n", quantity: "2", name: "lemons, juiced" },
      { unit: "kg", quantity: "1", name: "potatoes, quartered" },
      { unit: "n", quantity: "2", name: "onions, sliced" },
    ],
    time: { min: 90, max: 120 },
    instructions: [
      {
        description:
          "Mix garlic, bay leaves, wine, olive oil, paprika, salt, pepper, and lemon juice.",
      },
      {
        description:
          "Marinate chicken in this mixture for at least 2 hours or overnight.",
      },
      {
        description: "Preheat oven to 200°C (400°F).",
      },
      {
        description: "Place chicken in roasting pan with potatoes and onions.",
      },
      {
        description: "Pour marinade over chicken and vegetables.",
      },
      {
        description:
          "Roast for 60-75 minutes until chicken is golden and cooked through.",
      },
      {
        description: "Baste every 20 minutes with pan juices.",
      },
      {
        description: "Let rest for 10 minutes before carving and serving.",
      },
    ],
    tags: ["savory"],
    isPublic: true,
  },
  {
    slug: "paella-valenciana",
    title: "Paella Valenciana",
    summary:
      "Classic Spanish rice dish from Valencia with chicken, rabbit, beans, and saffron",
    emoji: "🥘",
    ingredients: [
      { unit: "g", quantity: "400", name: "bomba rice or short-grain rice" },
      { unit: "kg", quantity: "0.5", name: "chicken, cut into pieces" },
      { unit: "g", quantity: "300", name: "rabbit, cut into pieces" },
      { unit: "g", quantity: "200", name: "green beans, trimmed" },
      { unit: "g", quantity: "200", name: "lima beans" },
      { unit: "n", quantity: "2", name: "red bell peppers, sliced" },
      { unit: "n", quantity: "4", name: "tomatoes, grated" },
      { unit: "mL", quantity: "100", name: "olive oil" },
      { unit: "L", quantity: "1.5", name: "chicken stock" },
      { unit: "tsp", quantity: "1", name: "saffron threads" },
      { unit: "n", quantity: "4", name: "garlic cloves, minced" },
      { unit: "n", quantity: "6", name: "rosemary sprigs" },
      { unit: "tsp", quantity: "2", name: "salt" },
      { unit: "n", quantity: "", name: "lemon wedges for serving" },
    ],
    time: { min: 45, max: 60 },
    instructions: [
      {
        description:
          "Heat olive oil in a 15-inch paella pan over medium-high heat.",
      },
      {
        description:
          "Season chicken and rabbit with salt, brown on all sides. Set aside.",
      },
      {
        description:
          "Add green beans, lima beans, and bell peppers. Cook for 5 minutes.",
      },
      {
        description:
          "Add garlic and grated tomatoes. Cook until tomatoes are reduced.",
      },
      {
        description:
          "Return meat to pan, add rice and stir to coat with sofrito.",
      },
      {
        description:
          "Add hot stock infused with saffron and rosemary. Season with salt.",
      },
      {
        description:
          "Simmer for 18-20 minutes without stirring. Rotate pan occasionally.",
      },
      {
        description: "Let rest for 5 minutes covered with a clean towel.",
      },
      {
        description: "Serve with lemon wedges.",
      },
    ],
    tags: ["savory", "spicy"],
    isPublic: true,
  },
];

export function seedDefaultTags(): boolean {
  try {
    console.log("🌱 Seeding default tags...");

    if (!queries) {
      console.error("❌ Database queries not initialized");
      return false;
    }

    let seedCount = 0;

    for (const tag of defaultTags) {
      try {
        queries.insertTag.run(tag.name, tag.displayName, 1); // is_default = true
        seedCount++;
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "SQLITE_CONSTRAINT_UNIQUE"
        ) {
          console.log(`⚠️  Tag ${tag.name} already exists, skipping`);
          continue;
        }
        throw error;
      }
    }

    console.log(`✅ Seeded ${seedCount} default tags successfully`);
    return true;
  } catch (error) {
    console.error("❌ Error seeding default tags:", error);
    return false;
  }
}

export function seedDefaultRecipes(): boolean {
  try {
    console.log("🌱 Seeding default recipes...");

    if (!queries) {
      console.error("❌ Database queries not initialized");
      return false;
    }

    // Seed tags first
    seedDefaultTags();

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
          null, // user_id = null (default recipes)
          JSON.stringify(recipe.tags),
          JSON.stringify(recipe.ingredients),
          JSON.stringify(recipe.instructions),
          recipe.author || "Chef",
          1, // is_default = true
          recipe.isPublic !== undefined ? (recipe.isPublic ? 1 : 0) : 1 // Default to public
        );

        // Add tags to the recipe
        for (const tagName of recipe.tags) {
          const allTags = queries.getAllTags.all() as Array<{
            id: number;
            name: string;
          }>;
          const tag = allTags.find((t) => t.name === tagName);
          if (tag) {
            queries.addTagToRecipe.run(recipe.slug, tag.id);
          }
        }

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
