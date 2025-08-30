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
        clsx("px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base transition-all hover:scale-105", {
          "bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-sm": isActive,
          "text-gray-600 dark:text-stone-300 hover:text-gray-800 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-700": !isActive,
        })
      }
    >
      {label}
    </NavLink>
  );
};
