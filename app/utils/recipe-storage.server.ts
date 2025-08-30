import type { Recipe } from "./recipes";

const defaultRecipes: Recipe[] = [
  {
    slug: "riz-saute",
    title: "Riz Sauté",
    summary:
      "Riz sauté à base de restes de la veille, parfait pour utiliser les restes",
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
    slug: "spaghetti-bolo",
    title: "Spaghetti Bolognaise",
    summary:
      "Sauce bolognaise authentique mijotée pendant des heures selon la tradition de Bologne",
    ingredients: [
      { unit: "tbsp", quantity: "2", name: "huile d'olive extra vierge" },
      { unit: "g", quantity: "300", name: "pancetta finement hachée" },
      { unit: "n", quantity: "1", name: "carotte finement hachée" },
      { unit: "n", quantity: "1", name: "branche de céleri finement hachée" },
      { unit: "n", quantity: "1", name: "petit oignon finement haché" },
      { unit: "g", quantity: "300", name: "bœuf haché" },
      { unit: "g", quantity: "300", name: "porc haché" },
      { unit: "mL", quantity: "120", name: "vin rouge sec" },
      { unit: "tbsp", quantity: "2", name: "concentré de tomate" },
      { unit: "mL", quantity: "550", name: "purée de tomates" },
      { unit: "n", quantity: "2", name: "feuilles de laurier" },
      { unit: "mL", quantity: "80", name: "lait entier" },
      { unit: "g", quantity: "500", name: "spaghetti" },
      { unit: "n", quantity: "", name: "parmesan râpé" },
    ],
    time: { min: 240, max: 300 },
    instructions: [
      {
        description:
          "Faire rissoler la pancetta dans l'huile jusqu'à ce qu'elle soit croustillante.",
      },
      {
        description:
          "Ajouter céleri, carotte et oignon, cuire à couvert 20 minutes jusqu'à tendreté.",
      },
      {
        description:
          "Augmenter le feu, ajouter les viandes et bien dorer en cassant les morceaux.",
      },
      { description: "Ajouter le vin rouge à feu vif et laisser s'évaporer." },
      {
        description:
          "Incorporer le concentré de tomate, cuire 2 minutes, puis ajouter la purée et le laurier.",
      },
      {
        description:
          "Porter à ébullition puis réduire au minimum et laisser mijoter 2h30-3h à couvert.",
      },
      {
        description:
          "En fin de cuisson, découvrir et laisser réduire 15-20 minutes.",
      },
      {
        description:
          "Retirer le laurier, ajouter le lait et chauffer 2-3 minutes.",
      },
      {
        description:
          "Cuire les spaghetti al dente et servir avec la sauce et le parmesan.",
      },
    ],
    tags: ["savory"],
  },
  {
    slug: "nems",
    title: "Nems vietnamiens",
    summary:
      "Rouleaux croustillants farcis aux légumes et viande, frits deux fois pour une texture parfaite",
    ingredients: [
      { unit: "n", quantity: "18", name: "galettes de riz séchées" },
      { unit: "g", quantity: "15", name: "champignons noirs séchés" },
      { unit: "g", quantity: "50", name: "vermicelles de haricots mungo" },
      { unit: "g", quantity: "270", name: "crevettes décortiquées hachées" },
      { unit: "g", quantity: "300", name: "porc haché" },
      { unit: "g", quantity: "100", name: "pousses de soja" },
      { unit: "g", quantity: "30", name: "carottes en julienne" },
      { unit: "tbsp", quantity: "2.5", name: "échalotes hachées" },
      { unit: "n", quantity: "1", name: "gousse d'ail hachée" },
      { unit: "tsp", quantity: "1", name: "gingembre râpé" },
      { unit: "n", quantity: "2", name: "œufs" },
      { unit: "tbsp", quantity: "1", name: "sauce de poisson" },
      { unit: "tsp", quantity: "1.5", name: "poivre noir" },
      { unit: "tsp", quantity: "3", name: "sucre" },
      { unit: "n", quantity: "", name: "huile pour friture" },
    ],
    time: { min: 120, max: 140 },
    instructions: [
      {
        description:
          "Faire tremper les champignons 5 minutes, égoutter et couper en julienne.",
      },
      {
        description:
          "Tremper les vermicelles 20 minutes, égoutter et couper en tronçons de 5cm.",
      },
      {
        description:
          "Mélanger tous les ingrédients de la farce dans un grand bol.",
      },
      {
        description:
          "Tremper une galette de riz 5-10 secondes dans l'eau tiède sucrée.",
      },
      {
        description:
          "Placer 2,5 cuillères de farce en forme de bûche, rouler en serrant bien.",
      },
      { description: "Réfrigérer les rouleaux 1 heure minimum." },
      {
        description:
          "1ère friture : 170°C pendant 5-6 minutes jusqu'à doré clair.",
      },
      {
        description:
          "2ème friture : 175°C pendant 1-2 minutes jusqu'à doré foncé et croustillant.",
      },
      {
        description:
          "Servir immédiatement avec sauce nuoc mam, salade et herbes fraîches.",
      },
    ],
    tags: ["savory", "appetizer"],
  },
  {
    slug: "pho",
    title: "Pho",
    summary:
      "Bouillon de bœuf vietnamien traditionnel aux épices parfumées, mijoté pendant des heures",
    ingredients: [
      { unit: "g", quantity: "1500", name: "os de bœuf à moelle" },
      { unit: "g", quantity: "600", name: "poitrine de bœuf" },
      { unit: "g", quantity: "500", name: "jarret de bœuf" },
      { unit: "n", quantity: "2", name: "gros oignons jaunes" },
      { unit: "n", quantity: "1", name: "morceau de gingembre (8cm)" },
      { unit: "n", quantity: "7", name: "étoiles de badiane" },
      { unit: "n", quantity: "3", name: "bâtons de cannelle" },
      { unit: "n", quantity: "6", name: "clous de girofle" },
      { unit: "tbsp", quantity: "1", name: "graines de coriandre" },
      { unit: "tsp", quantity: "2", name: "graines de fenouil" },
      { unit: "n", quantity: "2", name: "gousses de cardamome noire" },
      { unit: "tbsp", quantity: "1", name: "sel" },
      { unit: "tbsp", quantity: "1", name: "sauce de poisson" },
      { unit: "tbsp", quantity: "1", name: "sucre de canne" },
      { unit: "g", quantity: "800", name: "nouilles de riz fraîches" },
      { unit: "g", quantity: "200", name: "émincé de bœuf cru" },
      { unit: "n", quantity: "", name: "oignon émincé, cébettes, coriandre" },
    ],
    time: { min: 360, max: 480 },
    instructions: [
      {
        description:
          "Blanchir les os 10 minutes dans l'eau bouillante, égoutter et nettoyer.",
      },
      {
        description:
          "Griller oignons et gingembre à la flamme 10-15 minutes jusqu'à noircissement.",
      },
      {
        description:
          "Remettre les os dans la casserole avec l'eau fraîche, aromates grillés et sel.",
      },
      { description: "Mijoter doucement 6-8 heures en écumant régulièrement." },
      {
        description:
          "Après 2h30, ajouter la viande et cuire jusqu'à tendreté, puis retirer.",
      },
      {
        description:
          "Griller les épices 2-3 minutes, envelopper dans une étamine et ajouter au bouillon.",
      },
      {
        description:
          "Filtrer le bouillon et assaisonner avec sauce de poisson et sucre.",
      },
      {
        description:
          "Cuire les nouilles selon les instructions, répartir dans les bols.",
      },
      {
        description:
          "Ajouter viande cuite et crue, oignons, cébettes, verser le bouillon bouillant.",
      },
      {
        description:
          "Servir avec pousses de soja, basilic thaï, citron vert et piments.",
      },
    ],
    tags: ["savory", "soup"],
  },
  {
    slug: "crepes-sucrees",
    title: "Crêpes sucrées",
    summary:
      "Crêpes françaises classiques fines et délicates, parfaites pour le dessert",
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
  {
    slug: "riz-au-poulet-peruvien",
    title: "Riz au poulet péruvien",
    summary:
      "Arroz con pollo vert traditionnel du Pérou, coloré naturellement par la coriandre et les épinards",
    ingredients: [
      { unit: "cup", quantity: "0.75", name: "feuilles de coriandre fraîche" },
      { unit: "n", quantity: "4", name: "feuilles d'épinards frais" },
      { unit: "n", quantity: "0.5", name: "oignon jaune" },
      { unit: "n", quantity: "3", name: "gousses d'ail" },
      { unit: "n", quantity: "0.5", name: "piment jalapeño" },
      { unit: "tsp", quantity: "2", name: "cumin moulu" },
      { unit: "tsp", quantity: "0.5", name: "paprika" },
      { unit: "tbsp", quantity: "2", name: "pâte d'ají amarillo" },
      { unit: "mL", quantity: "720", name: "bouillon de poulet" },
      {
        unit: "n",
        quantity: "6",
        name: "morceaux de poulet (cuisses et pilons)",
      },
      { unit: "cup", quantity: "1", name: "riz à grain moyen" },
      { unit: "n", quantity: "1", name: "bouteille de bière brune" },
      { unit: "cup", quantity: "0.5", name: "petits pois" },
      { unit: "cup", quantity: "0.5", name: "carottes en dés" },
      { unit: "n", quantity: "0.5", name: "poivron rouge en dés" },
      { unit: "cup", quantity: "0.5", name: "grains de maïs" },
      { unit: "tbsp", quantity: "2", name: "huile végétale" },
    ],
    time: { min: 75, max: 95 },
    instructions: [
      {
        description:
          "Mixer coriandre, épinards, oignon, ail, jalapeño, cumin, paprika avec 360ml de bouillon.",
      },
      {
        description:
          "Assaisonner le poulet, le dorer dans l'huile chaude 15 minutes, réserver.",
      },
      {
        description:
          "Dans la même casserole, faire revenir l'oignon restant et la pâte d'ají 5 minutes.",
      },
      {
        description:
          "Ajouter le mélange vert, la bière, le reste du bouillon et le poulet.",
      },
      { description: "Cuire à couvert 15 minutes." },
      {
        description:
          "Ajouter petits pois, carottes, poivron et maïs, cuire 10 minutes.",
      },
      {
        description:
          "Incorporer le riz, mélanger et cuire à couvert 45-50 minutes à feu doux.",
      },
      {
        description:
          "Vérifier toutes les 15 minutes, ajouter du bouillon si nécessaire.",
      },
      { description: "Servir chaud avec des accompaniments traditionnels." },
    ],
    tags: ["savory"],
  },
  {
    slug: "plantains-verts-frits",
    title: "Plantains verts frits",
    summary:
      "Patacones ou tostones croustillants, frits deux fois selon la tradition caribéenne",
    ingredients: [
      { unit: "n", quantity: "3", name: "gros plantains verts (très verts)" },
      { unit: "mL", quantity: "500", name: "huile neutre pour friture" },
      { unit: "tbsp", quantity: "2", name: "gros sel de mer" },
      { unit: "mL", quantity: "500", name: "eau froide" },
      { unit: "n", quantity: "4", name: "gousses d'ail écrasées" },
      { unit: "tbsp", quantity: "3", name: "huile d'olive" },
      { unit: "tbsp", quantity: "2", name: "coriandre fraîche hachée" },
      { unit: "tbsp", quantity: "2", name: "jus de citron vert" },
    ],
    time: { min: 35, max: 45 },
    instructions: [
      {
        description:
          "Couper les extrémités des plantains, faire des entailles dans la peau et l'enlever sous l'eau froide.",
      },
      { description: "Couper en rondelles de 2,5cm d'épaisseur." },
      {
        description:
          "Faire tremper dans l'eau salée avec l'ail écrasé 15-30 minutes.",
      },
      { description: "Égoutter et sécher les rondelles." },
      {
        description:
          "1ère friture : chauffer l'huile à 160°C, frire 3-4 minutes par face jusqu'à doré clair.",
      },
      {
        description:
          "Aplatir chaque rondelle avec un presse-tostones ou le fond d'un verre.",
      },
      {
        description:
          "2ème friture : augmenter l'huile à 190°C, refrire 2-3 minutes par face jusqu'à doré foncé.",
      },
      { description: "Égoutter et saupoudrer immédiatement de gros sel." },
      {
        description:
          "Pour le mojo : mélanger ail haché, huile d'olive, coriandre, sel et citron vert.",
      },
      { description: "Servir chaud immédiatement avec le mojo." },
    ],
    tags: ["savory", "appetizer"],
  },
  {
    slug: "pancake-banane",
    title: "Pancakes à la banane",
    summary:
      "Pancakes moelleux aux bananes écrasées, parfaits pour un petit-déjeuner gourmand",
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
];

// In-memory storage for custom recipes
let customRecipes: Recipe[] = [];

export function getAllRecipes(): Recipe[] {
  return [...defaultRecipes, ...customRecipes];
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return getAllRecipes().find(recipe => recipe.slug === slug);
}

export function addRecipe(recipe: Recipe): Recipe {
  // Check if slug already exists and modify if needed
  let uniqueSlug = recipe.slug;
  let counter = 1;
  while (getAllRecipes().some(r => r.slug === uniqueSlug)) {
    uniqueSlug = `${recipe.slug}-${counter}`;
    counter++;
  }
  
  const newRecipe = { ...recipe, slug: uniqueSlug };
  customRecipes.push(newRecipe);
  return newRecipe;
}

export function updateRecipe(slug: string, updatedRecipe: Omit<Recipe, 'slug'>): Recipe | null {
  const recipeIndex = customRecipes.findIndex(recipe => recipe.slug === slug);
  
  if (recipeIndex === -1) {
    return null;
  }
  
  const recipe = { ...updatedRecipe, slug };
  customRecipes[recipeIndex] = recipe;
  return recipe;
}

export function deleteRecipe(slug: string): boolean {
  const initialLength = customRecipes.length;
  customRecipes = customRecipes.filter(recipe => recipe.slug !== slug);
  return customRecipes.length < initialLength;
}

export function getCustomRecipes(): Recipe[] {
  return customRecipes;
}