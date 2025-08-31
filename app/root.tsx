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
import {
  RiSliceLine,
  RiMoonLine,
  RiSunLine,
  RiGlobalLine,
} from "@remixicon/react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";

import { getLocaleFromPath } from "~/i18next.server";
import styles from "~/index.css";

import { Footer } from "./components/Footer";
import { Link } from "./components/Link";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = getLocaleFromPath(request);
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
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  useEffect(() => {
    setIsClient(true);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node) &&
        languageButtonRef.current &&
        !languageButtonRef.current.contains(event.target as Node)
      ) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeLanguage = (newLocale: string) => {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/").filter(Boolean);

    // Remove current language prefix if it exists
    if (
      pathSegments.length > 0 &&
      ["fr", "en", "es", "pt", "he", "vi"].includes(pathSegments[0])
    ) {
      pathSegments.shift();
    }

    // Build new path
    let newPath = "/";
    if (newLocale !== "fr") {
      // Only add language prefix for non-French
      newPath += newLocale + "/";
    }
    newPath += pathSegments.join("/");

    // Preserve search params and hash
    window.location.href = newPath + currentUrl.search + currentUrl.hash;
  };

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "he", name: "עברית", flag: "🇮🇱" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  ];

  const getButtonPosition = () => {
    if (!languageButtonRef.current) return { top: 0, right: 0 };
    const rect = languageButtonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  };

  const LanguageMenu = () => {
    if (!showLanguageMenu || !isClient) return null;

    const position = getButtonPosition();

    return createPortal(
      <div
        ref={languageMenuRef}
        className="fixed bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg min-w-[120px] z-[9999]"
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              changeLanguage(lang.code);
              setShowLanguageMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2 ${
              locale === lang.code ? "bg-stone-100 dark:bg-stone-700" : ""
            }`}
          >
            <span>{lang.flag}</span>
            <span className="text-stone-900 dark:text-white">{lang.name}</span>
          </button>
        ))}
      </div>,
      document.body
    );
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
              onClick={() => {
                const currentLang = locale;
                const homeUrl = currentLang === "fr" ? "/" : `/${currentLang}/`;
                navigate(homeUrl);
              }}
            >
              <div className="p-2 md:p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <RiSliceLine
                  className="text-white"
                  size={match ? "28" : "24"}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Papilles & Mami
                </h1>
              </div>
            </button>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-1 bg-stone-100 dark:bg-stone-800 rounded-full p-1">
                <Link to="/recipes" label={t("navRecipes")} />
                <Link to="/recipes/new" label={t("navAddRecipe")} />
                <Link to="/converter" label={t("unitConverter")} />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  ref={languageButtonRef}
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 md:p-3 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:scale-110"
                  aria-label="Change language"
                >
                  <RiGlobalLine className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                </button>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 md:p-3 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:scale-110"
                  aria-label={
                    isDarkMode ? t("switchToLightMode") : t("switchToDarkMode")
                  }
                >
                  {isDarkMode ? (
                    <RiSunLine className="w-5 h-5 text-amber-500" />
                  ) : (
                    <RiMoonLine className="w-5 h-5 text-stone-600" />
                  )}
                </button>
              </div>
            </div>
          </nav>

          <div className="md:hidden px-4 pb-4">
            <div className="flex justify-center">
              <div className="bg-stone-100 dark:bg-stone-800 rounded-full p-1">
                <Link to="/recipes" label={t("navRecipes")} />
                <Link to="/recipes/new" label={t("navAddRecipe")} />
                <Link to="/converter" label={t("unitConverter")} />
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          <Outlet />
        </main>
        <Footer />
        <LanguageMenu />
      </body>
    </html>
  );
}
