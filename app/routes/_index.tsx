import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Homey Recipes" },
    {
      name: "description",
      content:
        "Discover, create, and savor the perfect recipe for every occasion – where delicious meals meet effortless cooking at home.",
    },
  ];
};

export default function Index() {
  return (
    <div className="px-4 flex flex-col justify-center items-center gap-12 bg-home h-screen bg-cover bg-no-repeat">
      <h2 className="text-3xl font-bold p-4 mx-auto text-center max-w-[840px]">
        <mark className="text-zinc-50 bg-zinc-900 bg-opacity-50 leading-10">
          Discover, create, and savor the perfect recipe for every occasion with
          – where delicious meals meet effortless cooking at home.
        </mark>
      </h2>
      <input
        className="w-full max-w-[600px] text-xl rounded px-4 py-2"
        placeholder="Search recipes..."
      />
    </div>
  );
}
