import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import type { FunctionComponent } from "react";

export const Link: FunctionComponent<{
  to: string;
  label: string;
}> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx("px-4 hover:underline tracking-widest font-semibold text-stone-700 dark:text-stone-300", {
          "underline text-amber-400 dark:text-amber-400 cursor-default": isActive,
        })
      }
    >
      {label}
    </NavLink>
  );
};
