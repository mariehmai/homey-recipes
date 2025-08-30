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
      className="flex items-center text-start text-sm text-slate-800 dark:text-stone-200 w-fit pr-2 rounded-xl border border-slate-800 dark:border-stone-600 hover:shadow-md hover:opacity-70 transition-all"
      onClick={() => navigate(-1)}
    >
      <RiArrowLeftSLine size={22} />
      {backBtnLabel}
    </button>
  );
};
