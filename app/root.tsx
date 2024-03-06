import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatch,
  useNavigate,
} from "@remix-run/react";
import { RiSliceLine } from "@remixicon/react";
import clsx from "clsx";

import styles from "~/index.css";

import { Link } from "./components/Link";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  const navigate = useNavigate();
  const match = useMatch("/");

  return (
    <html lang="en">
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
              <Link to={`/recipes`} label="Recipes" />
              <Link to={`/favourites`} label="Favourites" />
              <Link to={`/profile`} label="Profile" />
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
