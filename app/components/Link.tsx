import { NavLink, useLocation } from "@remix-run/react";
import clsx from "clsx";
import type { FunctionComponent } from "react";

export const Link: FunctionComponent<{
  to: string;
  label: string;
}> = ({ to, label }) => {
  const location = useLocation();

  // Get current language from URL path
  const getCurrentLanguage = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (
      pathSegments.length > 0 &&
      ["fr", "en", "es", "pt", "he", "vi"].includes(pathSegments[0])
    ) {
      return pathSegments[0];
    }
    return "fr";
  };

  // Build URL with proper language prefix
  const buildUrl = (path: string) => {
    const currentLang = getCurrentLanguage();
    if (currentLang === "fr") {
      return path;
    }
    return `/${currentLang}${path}`;
  };

  return (
    <NavLink
      to={buildUrl(to)}
      className={({ isActive }) =>
        clsx(
          "px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base transition-all hover:scale-105",
          {
            "bg-white dark:bg-stone-700 text-gray-900 dark:text-white shadow-sm":
              isActive,
            "text-gray-600 dark:text-stone-300 hover:text-gray-800 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-700":
              !isActive,
          }
        )
      }
    >
      {label}
    </NavLink>
  );
};
