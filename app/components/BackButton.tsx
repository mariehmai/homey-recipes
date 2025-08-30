import { useNavigate } from "@remix-run/react";
import { RiArrowLeftSLine } from "@remixicon/react";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

export const BackButton: FunctionComponent<{ label?: string }> = ({
  label = "back",
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const backBtnLabel = t(label);

  return (
    <button
      className="flex items-center text-start text-sm md:text-base text-gray-900 dark:text-white bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 hover:scale-105 w-fit px-3 py-2 md:px-4 md:py-3 rounded-full transition-all font-medium"
      onClick={() => navigate(-1)}
    >
      <RiArrowLeftSLine size={20} className="mr-1" />
      {backBtnLabel}
    </button>
  );
};
