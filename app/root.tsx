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
import { RiSliceLine } from "@remixicon/react";
import clsx from "clsx";
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

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <header className="bg-zinc-900 text-zinc-50">
          <nav className="flex gap-4 text-zinc-50 justify-between items-center p-4 uppercase">
            <button
              className="px-2"
              onClick={() => {
                navigate("/");
              }}
            >
              <RiSliceLine
                className={clsx({ "text-amber-400": !!match })}
                size="32"
              />
            </button>
            <div className="flex divide-x-2">
              <Link to={`/recipes`} label={t("navRecipes")} />
            </div>
            <span />
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </body>
    </html>
  );
}
