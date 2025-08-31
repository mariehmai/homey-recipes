import { useLocation } from "@remix-run/react";

export function useI18nUrl() {
  const location = useLocation();

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

  const buildUrl = (path: string) => {
    const currentLang = getCurrentLanguage();
    if (currentLang === "fr") {
      return path;
    }
    return `/${currentLang}${path}`;
  };

  return { getCurrentLanguage, buildUrl };
}
