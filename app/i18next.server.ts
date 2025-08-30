import Backend from "i18next-fs-backend";
import { RemixI18Next } from "remix-i18next/server";

import { resolve } from "node:path";

import i18n from "~/i18n"; // your i18n configuration file

// Helper function to extract locale from URL path
function getLocaleFromPath(request: Request): string {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);

  // Check if first segment is a supported language
  if (pathSegments.length > 0 && i18n.supportedLngs.includes(pathSegments[0])) {
    return pathSegments[0];
  }

  // Default to French (no subpath)
  return "fr";
}

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  },
  // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
  // E.g. The Backend plugin for loading translations from the file system
  // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
  plugins: [Backend],
});

// Override the getLocale method to use our custom path-based detection
i18next.getLocale = async (request: Request) => {
  return getLocaleFromPath(request);
};

export default i18next;
export { getLocaleFromPath };
