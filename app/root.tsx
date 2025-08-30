import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatch,
  useNavigate,
} from "@remix-run/react";
import { RiSliceLine, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";

import i18next from "~/i18next.server";
import styles from "~/index.css";

import { Link } from "./components/Link";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  return json({ locale });
}

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export default function App() {
  const navigate = useNavigate();
  const match = useMatch("/");
  const { locale } = useLoaderData<typeof loader>();
  const { i18n, t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored) {
      setIsDarkMode(JSON.parse(stored));
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <html lang={locale} dir={i18n.dir()} className={isDarkMode ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors duration-300">
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <header className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <button
              className="flex items-center space-x-3 group transition-all hover:scale-105"
              onClick={() => navigate("/")}
            >
              <div className="p-2 md:p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <RiSliceLine
                  className="text-white"
                  size={match ? "28" : "24"}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Homey Recipes
                </h1>
              </div>
            </button>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-1 bg-stone-100 dark:bg-stone-800 rounded-full p-1">
                <Link to="/recipes" label={t("navRecipes")} />
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 md:p-3 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:scale-110"
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <RiSunLine className="w-5 h-5 text-amber-500" />
                ) : (
                  <RiMoonLine className="w-5 h-5 text-stone-600" />
                )}
              </button>
            </div>
          </nav>

          <div className="md:hidden px-4 pb-4">
            <div className="flex justify-center">
              <div className="bg-stone-100 dark:bg-stone-800 rounded-full p-1">
                <Link to="/recipes" label={t("navRecipes")} />
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          <Outlet />
        </main>
      </body>
    </html>
  );
}
