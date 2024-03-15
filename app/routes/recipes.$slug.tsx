import type { MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import clsx from "clsx";
import { FunctionComponent, useState } from "react";

import { BackButton } from "~/components/BackButton";

export const meta: MetaFunction = () => {
  return [{ title: "Recipe" }];
};

export default function Recipe() {
  const { slug } = useParams();
  const [selectedTab, setSelectedTab] = useState("ingredients");

  return (
    <div className="relative p-12 max-w-[800px] mx-auto gap-4 flex flex-col">
      <BackButton />
      <h1 className="text-xl font-bold">{slug}</h1>
      <ul
        className="relative p-1 flex flex-wrap list-none rounded-lg bg-gray-100 justify-center"
        data-tabs="tabs"
      >
        <Tab
          isSelected={selectedTab === "ingredients"}
          label="Ingredients"
          onClick={() => setSelectedTab("ingredients")}
        />
        <Tab
          isSelected={selectedTab === "instructions"}
          label="Instructions"
          onClick={() => setSelectedTab("instructions")}
        />
      </ul>
    </div>
  );
}

const Tab: FunctionComponent<{
  isSelected: boolean;
  label: string;
  onClick: () => void;
}> = ({ isSelected, label, onClick }) => {
  return (
    <li className="z-30 flex-auto text-center">
      <button
        className={clsx(
          "z-30 flex items-center justify-center w-full px-12 py-1 transition-all ease-in-out border-0 rounded-lg cursor-pointer text-zinc-700",
          {
            "bg-white shadow-md": isSelected,
          }
        )}
        data-tab-target=""
        role="tab"
        aria-selected={isSelected}
        onClick={onClick}
      >
        {label}
      </button>
    </li>
  );
};
