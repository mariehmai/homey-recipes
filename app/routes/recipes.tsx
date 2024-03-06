import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Recipes" }];
};

export default function Recipes() {
  return <div>Recipes</div>;
}
