/**
 * Builds a URL with proper language prefix for redirects
 * @param path - The path to redirect to (e.g., "/recipes/slug")
 * @param locale - The current locale (fr, en, es, pt, he, vi)
 * @returns The URL with proper language prefix
 */
export function buildI18nUrl(path: string, locale: string): string {
  // French is the default language, no prefix needed
  if (locale === "fr") {
    return path;
  }

  // Add language prefix for other languages
  return `/${locale}${path}`;
}
