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
      className="flex items-center text-start text-sm text-slate-800 w-fit pr-2 rounded-xl border border-slate-800 hover:shadow-md hover:opacity-70"
      onClick={() => navigate(-1)}
    >
      <RiArrowLeftSLine size={22} />
      {backBtnLabel}
    </button>
  );
};
