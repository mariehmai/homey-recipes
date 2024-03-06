import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Favourites" }];
};

export default function Favourites() {
  return <div>Favourites</div>;
}
