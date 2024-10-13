import type { MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import clsx from "clsx";
import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import { recipes } from "~/utils/recipes";

export const meta: MetaFunction = () => {
  return [{ title: "Recipe" }];
};

export default function Recipe() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const recipe = recipes.find((r) => r.slug === slug);
  const [selectedTab, setSelectedTab] = useState("ingredients");
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [checkedInstructions, setCheckedInstructions] = useState<string[]>([]);

  if (!recipe) return null;

  function tabContent() {
    if (!recipe) return null;

    switch (selectedTab) {
      case "ingredients":
        return (
          <ul>
            {recipe.ingredients.map((i, idx) => (
              <li key={idx} className="flex gap-4 items-center">
                <input
                  className="accent-amber-400"
                  id={i.name}
                  type="checkbox"
                  name={i.name}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setCheckedIngredients([
                        ...checkedIngredients,
                        e.currentTarget.name,
                      ]);
                    } else {
                      setCheckedIngredients(
                        checkedIngredients.filter(
                          (ing) => ing !== e.currentTarget.name
                        )
                      );
                    }
                  }}
                  checked={checkedIngredients.includes(i.name)}
                />
                <label
                  className={clsx("text-lg", {
                    "line-through": checkedIngredients.includes(i.name),
                  })}
                  htmlFor={i.name}
                >{`${i.quantity} ${i.unit} ${i.name}`}</label>
              </li>
            ))}
          </ul>
        );
      case "instructions":
        return (
          <ul>
            {recipe.instructions.map((i, idx) => {
              const sortaId = idx.toString();
              return (
                <li key={sortaId} className="flex gap-4 items-center">
                  <input
                    className="accent-amber-400"
                    id={sortaId}
                    type="checkbox"
                    name={sortaId}
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setCheckedInstructions([
                          ...checkedInstructions,
                          e.currentTarget.name,
                        ]);
                      } else {
                        setCheckedInstructions(
                          checkedInstructions.filter(
                            (ing) => ing !== e.currentTarget.name
                          )
                        );
                      }
                    }}
                    checked={checkedInstructions.includes(sortaId)}
                  />
                  <label
                    className={clsx("text-lg", {
                      "line-through": checkedInstructions.includes(sortaId),
                    })}
                    htmlFor={sortaId}
                  >
                    {i.description}
                  </label>
                </li>
              );
            })}
          </ul>
        );
      default:
        return null;
    }
  }

  return (
    <div className="relative p-4 max-w-[900px] mx-auto gap-4 flex flex-col">
      <BackButton />
      <h1 className="text-xl font-bold">{recipe.title}</h1>
      <div className="flex flex-col-reverse sm:flex-row justify-start gap-8">
        <div className="flex flex-col gap-4 flex-[3]">
          <ul
            className="relative p-1 flex flex-wrap list-none rounded-lg bg-gray-100 justify-center"
            data-tabs="tabs"
          >
            <Tab
              isSelected={selectedTab === "ingredients"}
              label={t("ingredients")}
              onClick={() => setSelectedTab("ingredients")}
            />
            <Tab
              isSelected={selectedTab === "instructions"}
              label={t("instructions")}
              onClick={() => setSelectedTab("instructions")}
            />
          </ul>
          {tabContent()}
        </div>
        <div className="flex-[2]">
          <img
            className={`object-contain self-start rounded-lg shadow-md`}
            src={`/assets/${recipe.slug}.jpeg`}
            alt=""
          />
        </div>
      </div>
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
