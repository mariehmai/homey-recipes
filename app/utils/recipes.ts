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
  unit: "n" | "g" | "mL";
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
