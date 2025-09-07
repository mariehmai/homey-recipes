import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

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

const defaultRecipes = [
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
    prepTime: 10,
    cookTime: 20,
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
    author: "Default",
    tags: ["savory", "quick"],
    isDefault: true,
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
    prepTime: 45,
    cookTime: 80,
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
    author: "Default",
    tags: ["savory", "spicy"],
    isDefault: true,
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
    prepTime: 15,
    cookTime: 20,
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
    author: "Default",
    tags: ["sweet", "dessert", "quick"],
    isDefault: true,
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
    prepTime: 90,
    cookTime: 120,
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
    author: "Default",
    tags: ["sweet", "dessert"],
    isDefault: true,
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
    prepTime: 25,
    cookTime: 35,
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
    author: "Default",
    tags: ["vegan", "savory", "quick"],
    isDefault: true,
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
    prepTime: 180,
    cookTime: 240,
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
    author: "Default",
    tags: ["soup", "savory"],
    isDefault: true,
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
    prepTime: 90,
    cookTime: 120,
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
    author: "Default",
    tags: ["savory"],
    isDefault: true,
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
    prepTime: 45,
    cookTime: 60,
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
    author: "Default",
    tags: ["savory", "spicy"],
    isDefault: true,
    isPublic: true,
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Create default tags
  console.log("Creating default tags...");
  for (const tag of defaultTags) {
    await db.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: {
        name: tag.name,
        displayName: tag.displayName,
        isDefault: true,
      },
    });
  }

  // Create default recipes
  console.log("Creating default recipes...");
  for (const recipe of defaultRecipes) {
    await db.recipe.upsert({
      where: { slug: recipe.slug },
      update: {},
      create: {
        slug: recipe.slug,
        title: recipe.title,
        summary: recipe.summary,
        emoji: recipe.emoji,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: JSON.stringify(recipe.instructions),
        author: recipe.author,
        tags: JSON.stringify(recipe.tags), // For backward compatibility
        isDefault: recipe.isDefault,
        isPublic: recipe.isPublic,
      },
    });

    // Add recipe tags
    for (const tagName of recipe.tags) {
      const tag = await db.tag.findUnique({ where: { name: tagName } });
      if (tag) {
        await db.recipeTag.upsert({
          where: {
            recipeSlug_tagId: {
              recipeSlug: recipe.slug,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            recipeSlug: recipe.slug,
            tagId: tag.id,
          },
        });
      }
    }
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
