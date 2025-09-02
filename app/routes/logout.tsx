import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";

export const action: ActionFunction = ({ request }) => {
  return authenticator.logout(request, { redirectTo: "/login" });
};

export const loader: LoaderFunction = () => {
  return redirect("/");
};
