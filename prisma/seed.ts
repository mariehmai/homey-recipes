import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      "3 carottes",
      "0.5 blanc de poireaux",
      "200g reste de poulet ou protéine",
      "200g reste de riz de la veille",
      "2 oeufs",
      "cébette",
      "coriandre fraîche",
      "2 tbsp sauce maggi",
      "1 tbsp sauce huître",
      "1 tbsp huile de sésame",
      "4 tbsp huile végétale",
      "1 tbsp vinaigre de riz",
      "2 tsp poivre blanc",
    ],
    instructions: [
      "Faire revenir les carottes dans un tout petit fond d'eau.",
      "Une fois l'eau évaporée, ajouter de l'huile végétale et les poireaux et faire revenir.",
      "Ajouter la viande, bien mélanger puis ajouter le vinaigre de riz, la sauce huître et l'huile de sésame et remuer.",
      "Ajouter le riz et bien mélanger, faire revenir 3-4 minutes en remuant régulièrement.",
      "Faire un puits au centre, casser les oeufs et les brouiller rapidement au centre puis mélanger avec le riz.",
      "Ajouter la sauce maggi et le poivre blanc, goûter et rectifier l'assaisonnement.",
      "Servir immédiatement avec la cébette et la coriandre fraîche hachées.",
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    author: "Chef",
    tags: ["quick", "savory"],
    isDefault: true,
    isPublic: true,
  },
  {
    slug: "pate-carbonara",
    title: "Pâtes Carbonara",
    summary: "Recette traditionnelle italienne de pâtes carbonara crémeuses",
    emoji: "🍝",
    ingredients: [
      "400g spaghetti",
      "200g guanciale ou lardons",
      "4 oeufs entiers",
      "100g parmesan râpé",
      "poivre noir fraîchement moulu",
      "sel",
    ],
    instructions: [
      "Faire bouillir une grande casserole d'eau salée pour les pâtes.",
      "Couper le guanciale en petits cubes et le faire revenir dans une poêle jusqu'à ce qu'il soit croustillant.",
      "Dans un bol, battre les oeufs avec le parmesan et beaucoup de poivre noir.",
      "Cuire les spaghetti al dente selon les instructions du paquet.",
      "Réserver 1 tasse d'eau de cuisson des pâtes, puis égoutter les pâtes.",
      "Ajouter les pâtes chaudes au guanciale dans la poêle, hors du feu.",
      "Verser le mélange oeufs-parmesan en remuant vigoureusement, ajouter un peu d'eau de cuisson si nécessaire.",
      "Servir immédiatement avec du parmesan supplémentaire et du poivre noir.",
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    author: "Chef",
    tags: ["quick", "savory"],
    isDefault: true,
    isPublic: true,
  },
  {
    slug: "tiramisu",
    title: "Tiramisu",
    summary: "Dessert italien classique au café et mascarpone",
    emoji: "🍰",
    ingredients: [
      "6 jaunes d'oeufs",
      "150g sucre",
      "500g mascarpone",
      "3 blancs d'oeufs",
      "200g biscuits à la cuillère",
      "300ml café fort refroidi",
      "3 tbsp marsala ou amaretto",
      "cacao en poudre pour saupoudrer",
    ],
    instructions: [
      "Battre les jaunes d'oeufs avec le sucre jusqu'à ce que le mélange blanchisse.",
      "Incorporer délicatement le mascarpone au mélange jaunes-sucre.",
      "Monter les blancs d'oeufs en neige ferme et les incorporer délicatement au mélange précédent.",
      "Mélanger le café refroidi avec l'alcool.",
      "Tremper rapidement chaque biscuit dans le café et les disposer dans un plat.",
      "Étaler la moitié de la crème sur les biscuits.",
      "Répéter avec une deuxième couche de biscuits et terminer avec le reste de crème.",
      "Réfrigérer au moins 4 heures ou toute la nuit.",
      "Saupoudrer de cacao avant de servir.",
    ],
    prepTime: 30,
    cookTime: 0,
    servings: 8,
    author: "Chef",
    tags: ["sweet", "dessert"],
    isDefault: true,
    isPublic: true,
  },
  {
    slug: "crepes-sucrees",
    title: "Crêpes sucrées",
    summary: "Crêpes françaises classiques fines et délicates, parfaites pour le dessert",
    emoji: "🥞",
    ingredients: [
      "250g farine tout usage",
      "1 pincée de sel",
      "1 tbsp sucre en poudre",
      "3 gros œufs",
      "600mL lait entier",
      "50g beurre non salé, fondu",
      "1 tsp extrait de vanille",
      "beurre supplémentaire pour la cuisson",
    ],
    instructions: [
      "Mélanger la farine, le sel et le sucre dans un grand bol.",
      "Creuser un puits au centre et ajouter les œufs.",
      "Incorporer 240ml de lait en fouettant du centre vers l'extérieur.",
      "Ajouter graduellement le reste du lait, fouetter jusqu'à obtenir un mélange lisse.",
      "Couvrir et réfrigérer pendant au moins 1 heure.",
      "Incorporer le beurre fondu et la vanille.",
      "Chauffer une poêle à crêpes de 25cm à feu moyen.",
      "Beurrer légèrement la poêle.",
      "Verser 60ml de pâte au centre et faire tourner immédiatement la poêle.",
      "Cuire 40-60 secondes jusqu'à ce que les bords soient dorés.",
      "Retourner délicatement, cuire 20-30 secondes de plus.",
      "Empiler les crêpes avec du papier parchemin entre les couches.",
    ],
    prepTime: 30,
    cookTime: 90,
    servings: 4,
    author: "Chef",
    tags: ["sweet", "dessert"],
    isDefault: true,
    isPublic: true,
  },
  {
    slug: "frango-assado",
    title: "Frango Assado (Portuguese Roasted Chicken)",
    summary: "Poulet rôti portugais traditionnel mariné à l'ail, aux feuilles de laurier et au vin blanc",
    emoji: "🍗",
    ingredients: [
      "1.5kg poulet entier",
      "8 gousses d'ail, hachées",
      "4 feuilles de laurier",
      "120mL vin blanc",
      "3 tbsp huile d'olive",
      "2 tbsp paprika",
      "2 tsp sel",
      "1 tsp poivre noir",
      "2 citrons, pressés",
      "1kg pommes de terre, coupées en quartiers",
      "2 oignons, tranchés",
    ],
    instructions: [
      "Mélanger l'ail, les feuilles de laurier, le vin, l'huile d'olive, le paprika, le sel, le poivre et le jus de citron.",
      "Mariner le poulet pendant au moins 2 heures ou toute la nuit.",
      "Préchauffer le four à 200°C (400°F).",
      "Placer le poulet dans un plat de cuisson avec les pommes de terre et les oignons.",
      "Verser la marinade sur le poulet et les légumes.",
      "Rôtir 60-75 minutes jusqu'à ce que le poulet soit doré et bien cuit.",
      "Arroser toutes les 20 minutes avec le jus de cuisson.",
      "Laisser reposer 10 minutes avant de découper et servir.",
    ],
    prepTime: 20,
    cookTime: 75,
    servings: 4,
    author: "Chef",
    tags: ["savory"],
    isDefault: true,
    isPublic: true,
  },
  {
    slug: "paella-valenciana",
    title: "Paella Valenciana",
    summary: "Plat de riz espagnol classique de Valence avec poulet, lapin, haricots et safran",
    emoji: "🥘",
    ingredients: [
      "400g riz bomba ou riz à grain court",
      "0.5kg poulet, coupé en morceaux",
      "300g lapin, coupé en morceaux",
      "200g haricots verts, équeutés",
      "200g haricots de lima",
      "2 poivrons rouges, tranchés",
      "4 tomates, râpées",
      "100mL huile d'olive",
      "1.5L bouillon de poulet",
      "1 tsp filaments de safran",
      "4 gousses d'ail, hachées",
      "6 brins de romarin",
      "2 tsp sel",
      "quartiers de citron pour servir",
    ],
    instructions: [
      "Chauffer l'huile d'olive dans une poêle à paella de 15 pouces à feu moyen-vif.",
      "Assaisonner le poulet et le lapin avec du sel, les faire dorer de tous côtés. Réserver.",
      "Ajouter les haricots verts, les haricots de lima et les poivrons. Cuire 5 minutes.",
      "Ajouter l'ail et les tomates râpées. Cuire jusqu'à réduction des tomates.",
      "Remettre la viande dans la poêle, ajouter le riz et remuer pour enrober de sofrito.",
      "Ajouter le bouillon chaud infusé au safran et au romarin. Assaisonner de sel.",
      "Mijoter 18-20 minutes sans remuer. Faire tourner la poêle occasionnellement.",
      "Laisser reposer 5 minutes couvert d'un torchon propre.",
      "Servir avec des quartiers de citron.",
    ],
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    author: "Chef",
    tags: ["savory", "spicy"],
    isDefault: true,
    isPublic: true,
  },
  {
    slug: "pho-bo",
    title: "Pho Bo (Vietnamese Beef Soup)",
    summary: "Soupe de nouilles vietnamienne authentique avec bouillon aromatique, nouilles de riz et bœuf",
    emoji: "🍜",
    ingredients: [
      "1kg os de bœuf",
      "500g poitrine de bœuf",
      "1 gros oignon, coupé en deux",
      "1 morceau de gingembre (5cm)",
      "3 anis étoilé",
      "1 bâton de cannelle",
      "6 clous de girofle",
      "2 tbsp sauce de poisson",
      "1 tbsp sel",
      "400g nouilles de riz (banh pho)",
      "200g aloyau de bœuf cru, tranché finement",
      "germes de soja",
      "herbes fraîches (coriandre, basilic, menthe)",
      "quartiers de citron vert",
    ],
    instructions: [
      "Griller l'oignon et le gingembre à flamme nue jusqu'à noircissement. Rincer et réserver.",
      "Griller l'anis étoilé, la cannelle et les clous de girofle dans une poêle sèche 2 minutes.",
      "Dans une grande casserole, ajouter les os de bœuf, la poitrine, les légumes grillés et les épices.",
      "Couvrir d'eau et porter à ébullition. Écumer et mijoter 3-4 heures.",
      "Retirer la poitrine après 1 heure, trancher finement une fois refroidie.",
      "Filtrer le bouillon et assaisonner avec la sauce de poisson et le sel.",
      "Cuire les nouilles de riz selon les instructions de l'emballage.",
      "Servir les nouilles dans des bols, garnir de bœuf cuit et cru, verser le bouillon chaud par-dessus.",
      "Servir avec les germes de soja, les herbes et les quartiers de citron vert à part.",
    ],
    prepTime: 30,
    cookTime: 240,
    servings: 4,
    author: "Chef",
    tags: ["savory", "soup"],
    isDefault: true,
    isPublic: true,
  },
  {
    slug: "shakshuka-vegan",
    title: "Vegan Shakshuka",
    summary: "Version végétalienne du classique moyen-oriental avec tomates épicées et herbes fraîches",
    emoji: "🍅",
    ingredients: [
      "2 tbsp huile d'olive",
      "1 gros oignon, coupé en dés",
      "1 poivron rouge, coupé en dés",
      "4 gousses d'ail, hachées",
      "1 tsp cumin moulu",
      "1 tsp paprika",
      "0.5 tsp piment de Cayenne",
      "800g tomates broyées en conserve",
      "1 tsp sel",
      "0.5 tsp poivre noir",
      "0.25 cup persil frais, haché",
      "pain pita pour servir",
    ],
    instructions: [
      "Chauffer l'huile d'olive dans une grande poêle à feu moyen.",
      "Ajouter l'oignon et le poivron, cuire 5 minutes jusqu'à ramollissement.",
      "Ajouter l'ail, le cumin, le paprika et le piment de Cayenne. Cuire 1 minute jusqu'à parfum.",
      "Ajouter les tomates broyées, le sel et le poivre. Mijoter 15-20 minutes.",
      "Goûter et ajuster l'assaisonnement au besoin.",
      "Garnir de persil frais et servir avec du pain pita chaud.",
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    author: "Chef",
    tags: ["quick", "savory", "vegan"],
    isDefault: true,
    isPublic: true,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create default tags
  console.log("Creating default tags...");
  for (const tag of defaultTags) {
    await prisma.tag.upsert({
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
    // Create recipe
    const createdRecipe = await prisma.recipe.upsert({
      where: { slug: recipe.slug },
      update: {},
      create: {
        slug: recipe.slug,
        title: recipe.title,
        summary: recipe.summary,
        emoji: recipe.emoji,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        author: recipe.author,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        isDefault: recipe.isDefault,
        isPublic: recipe.isPublic,
      },
    });

    // Add tags to recipe
    for (const tagName of recipe.tags) {
      const tag = await prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (tag) {
        await prisma.recipeTag.upsert({
          where: {
            recipeId_tagId: {
              recipeId: createdRecipe.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            recipeId: createdRecipe.id,
            tagId: tag.id,
          },
        });
      }
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
