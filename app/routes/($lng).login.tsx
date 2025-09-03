import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import i18next from "~/i18next.server";
import { authenticator } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18next.getLocale(request);

  // If user is already authenticated, redirect to home
  const user = await authenticator.isAuthenticated(request);
  if (user) {
    return redirect("/");
  }

  return json({ locale });
};

export const action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("google", request);
};

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <BackButton />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-200 dark:border-stone-600 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("welcomeBack", { defaultValue: "Welcome Back" })}
            </h1>
            <p className="text-gray-600 dark:text-stone-300">
              {t("signInToContinue", {
                defaultValue: "Sign in to continue to your recipes",
              })}
            </p>
          </div>

          <Form method="post" className="space-y-6">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 hover:bg-gray-50 dark:hover:bg-stone-600 transition-colors font-medium text-gray-700 dark:text-stone-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>
                {t("continueWithGoogle", {
                  defaultValue: "Continue with Google",
                })}
              </span>
            </button>
          </Form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-stone-500">
            {t("bySigningIn", {
              defaultValue: "By signing in, you agree to our terms of service",
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
