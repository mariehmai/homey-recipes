import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { RiUserLine, RiSaveLine } from "@remixicon/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { BackButton } from "~/components/BackButton";
import { UserAvatar } from "~/components/UserAvatar";
import i18next from "~/i18next.server";
import { authenticator, User } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  // Redirect to login if user is not authenticated
  if (!user) {
    const locale = await i18next.getLocale(request);
    const loginUrl = locale === "fr" ? "/login" : `/${locale}/login`;
    return redirect(loginUrl);
  }

  // Get current user data with username from database
  let dbUser = null;
  try {
    dbUser = (await db.user.findUnique({
      where: { id: user.id },
    })) as User;
  } catch (error) {
    console.error("Error fetching user from database:", error);
  }

  const locale = await i18next.getLocale(request);
  return json({
    user: {
      ...user,
      username: dbUser?.username || null,
    },
    locale,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ error: "Must be logged in" }, { status: 401 });
  }

  const formData = await request.formData();
  const username = formData.get("username") as string;

  if (!username || !username.trim()) {
    return json({ error: "Username cannot be empty" }, { status: 400 });
  }

  const trimmedUsername = username.trim();

  // Basic username validation
  if (trimmedUsername.length < 2) {
    return json(
      { error: "Username must be at least 2 characters" },
      { status: 400 }
    );
  }

  if (trimmedUsername.length > 50) {
    return json(
      { error: "Username must be less than 50 characters" },
      { status: 400 }
    );
  }

  // Update username in database
  try {
    await db.user.update({
      where: { id: user.id },
      data: { username: trimmedUsername },
    });
    return json({ success: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return json({ error: "Failed to update profile" }, { status: 500 });
  }
};

export const meta: MetaFunction = () => {
  return [{ title: "Profile" }];
};

export const handle = {
  i18n: "common",
};

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [username, setUsername] = useState(user.username || "");

  // Update local state if user data changes
  useEffect(() => {
    setUsername(user.username || "");
  }, [user.username]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {t("profile", { defaultValue: "Profile" })}
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-gray-200 dark:border-stone-600">
          <div className="flex items-center space-x-4 mb-8">
            <UserAvatar src={user.avatar} alt={user.name} size="lg" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-stone-400">{user.email}</p>
            </div>
          </div>

          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {actionData.error}
            </div>
          )}

          {actionData?.success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
              {actionData.success}
            </div>
          )}

          <Form method="post" className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-2"
              >
                {t("username", { defaultValue: "Username" })}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiUserLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={t("enterUsername", {
                    defaultValue: "Enter your username",
                  })}
                  minLength={2}
                  maxLength={50}
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-stone-400">
                {t("usernameNote", {
                  defaultValue:
                    "This will be shown when you comment on recipes instead of your full name.",
                })}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RiSaveLine size={16} />
                <span>
                  {isSubmitting
                    ? t("saving", { defaultValue: "Saving..." })
                    : t("saveProfile", { defaultValue: "Save Profile" })}
                </span>
              </button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}
