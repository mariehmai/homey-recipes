export type Tag =
  | "sweet"
  | "dessert"
  | "savory"
  | "bbq"
  | "soup"
  | "quick"
  | "spicy"
  | "appetizer";

type Ingredient = {
  unit: "n" | "g" | "mL" | "tsp" | "tbsp";
  name: string;
  quantity: string | number;
};

type Instruction = {
  description: string;
};

type Time = {
  min: number;
  max?: number;
};

export type Recipe = {
  slug: string;
  title: string;
  summary: string;
  time?: Time;
  instructions: Instruction[];
  ingredients: Ingredient[];
  tags: Tag[];
};

export const recipes = [
  {
    slug: `riz-saute`,
    title: `Riz Sauté`,
    summary: `Riz sauté à base de restes de la veille`,
    ingredients: [
      {
        unit: "n",
        name: "carottes",
        quantity: "3",
      },
      {
        unit: "n",
        quantity: "0.5",
        name: "blanc de poireaux",
      },
      {
        unit: "g",
        quantity: "200",
        name: "reste de poulet ou n'importe quelle protéine",
      },
      {
        unit: "g",
        quantity: "200",
        name: "reste de riz de la veille",
      },
      {
        unit: "n",
        quantity: "2",
        name: "oeufs",
      },
      {
        unit: "n",
        quantity: "",
        name: "cébette",
      },
      {
        unit: "n",
        quantity: "",
        name: "coriandre",
      },
      {
        unit: "tbsp",
        quantity: "2",
        name: "sauce maggi",
      },
      {
        unit: "tbsp",
        quantity: "1",
        name: "sauce huître",
      },
      {
        unit: "tbsp",
        quantity: "1",
        name: "huile de sésame",
      },
      {
        unit: "tbsp",
        quantity: "4",
        name: "huile végétale",
      },
      {
        unit: "tbsp",
        quantity: "1",
        name: "vinaigre de riz",
      },
      {
        unit: "tsp",
        quantity: "2",
        name: "poivre blanc",
      },
    ],
    time: {
      min: 10,
      max: 20,
    },
    instructions: [
      {
        description: `(Optionnel) Faire revenir les carottes dans un tout petit fond d'eau (goût perso, pour que ce ne soit pas trop croquant).`,
      },
      {
        description: `Une fois l'eau évaporée, ajouter de l'huile végétale et les poireaux et faire revenir.`,
      },
      {
        description: `Ajouter la viande, bien mélanger puis ajouter le vinaigre de riz, la sauce huître et l'huile de sésame (pas trop pck c'est assez fort) et remuer.`,
      },
      {
        description: `Faire de la place sur le côté du wok et ajouter encore un peu d'huile de sésame (ou végétale) et faire cuire les œufs. Une fois plus liquide mélanger l'œuf avec le reste.`,
      },
      {
        description: `Ajouter le riz et mélanger. Mettre du maggi, pas trop mais doser en fonction de comment la protéine était assaisonnée, puis du poivre blanc, une bonne dose pck ça pique pas beaucoup, et la cébette et remuer.`,
      },
      {
        description: `Éteindre le feu et finir en ajoutant la coriandre. Goûter et ajuster en fonction (toujours plus de poivreeeee).`,
      },
    ],
    tags: ["savory", "quick"],
  },
  {
    slug: `pancake-a-la-banane`,
    title: `Pancake à la banane`,
    summary: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  Voluptatibus quia, nulla! Maiores et perferendis eaque,
  exercitationem praesentium nihil.`,
    ingredients: [
      {
        unit: "n",
        name: "banane",
        quantity: "4",
      },
      {
        unit: "g",
        quantity: "500",
        name: "farine",
      },
    ],
    time: {
      min: 10,
      max: 20,
    },
    instructions: [
      {
        description: `Do this`,
      },
      {
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    Voluptatibus quia, nulla! Maiores et perferendis eaque,
    exercitationem praesentium nihil.`,
      },
      {
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    Voluptatibus quia, nulla! Maiores et perferendis eaque,
    exercitationem praesentium nihil. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    Voluptatibus quia, nulla! Maiores et perferendis eaque,
    exercitationem praesentium nihil.`,
      },
      {
        description: `Then this`,
      },
      {
        description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  Voluptatibus quia, nulla! Maiores et perferendis eaque,
  exercitationem praesentium nihil.`,
      },
    ],
    tags: ["dessert", "sweet"],
  },
  {
    slug: `crepes-sucrees`,
    title: `Crêpes sucrées`,
    summary: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  Voluptatibus quia, nulla! Maiores et perferendis eaque,
  exercitationem praesentium nihil.`,
    ingredients: [
      {
        unit: "n" as const,
        name: "banane",
        quantity: "4",
      },
      {
        unit: "g" as const,
        quantity: "500",
        name: "farine",
      },
    ],
    instructions: [
      {
        description: `Do this`,
      },
      {
        description: `Then this`,
      },
    ],
    tags: ["sweet", "dessert"],
  },
  {
    slug: `riz-au-poulet-peruvien`,
    title: `Riz au poulet péruvien`,
    summary: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  Voluptatibus quia, nulla! Maiores et perferendis eaque,
  exercitationem praesentium nihil.`,
    ingredients: [
      {
        unit: "n",
        name: "banane",
        quantity: "4",
      },
      {
        unit: "g",
        quantity: "500",
        name: "farine",
      },
    ],
    instructions: [
      {
        description: `Do this`,
      },
      {
        description: `Then this`,
      },
    ],
    tags: ["savory", "spicy"],
  },
  {
    slug: `plantains-verts-frits`,
    title: `Plantains verts frits`,
    summary: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  Voluptatibus quia, nulla! Maiores et perferendis eaque,
  exercitationem praesentium nihil.`,
    ingredients: [
      {
        unit: "n",
        name: "banane",
        quantity: "4",
      },
      {
        unit: "g",
        quantity: "500",
        name: "farine",
      },
    ],
    instructions: [
      {
        description: `Do this`,
      },
      {
        description: `Then this`,
      },
    ],
    tags: ["appetizer", "quick"],
  },
] satisfies Recipe[];
