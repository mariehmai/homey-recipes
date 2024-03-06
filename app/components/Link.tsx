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
        clsx("px-4 hover:underline tracking-widest font-semibold", {
          "underline text-amber-400 cursor-default": isActive,
        })
      }
    >
      {label}
    </NavLink>
  );
};
