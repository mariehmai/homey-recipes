import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { getUserRatingForRecipe, rateRecipe } from "~/utils/ratings";

import { StarRating, RatingDisplay } from "./StarRating";

interface RecipeRatingProps {
  recipeSlug: string;
  initialAverageRating?: number;
  initialRatingCount?: number;
  className?: string;
}

export const RecipeRating: FunctionComponent<RecipeRatingProps> = ({
  recipeSlug,
  initialAverageRating = 0,
  initialRatingCount = 0,
  className = "",
}) => {
  const { t } = useTranslation();
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [ratingCount, setRatingCount] = useState(initialRatingCount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const loadUserRating = async () => {
      try {
        const existingRating = await getUserRatingForRecipe(recipeSlug);
        if (existingRating) {
          setUserRating(existingRating);
        }
      } catch (error) {
        console.error("Failed to load user rating:", error);
      }
    };

    loadUserRating();
  }, [recipeSlug]);

  const handleRate = async (rating: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await rateRecipe(recipeSlug, rating);

      if (result) {
        setUserRating(rating);
        setAverageRating(result.averageRating);
        setRatingCount(result.ratingCount);

        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 3000);
      } else {
        console.error("Failed to save rating - no result returned");
      }
    } catch (error) {
      console.error("Failed to save rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t("rating")}
        </h3>
        <RatingDisplay
          averageRating={averageRating}
          ratingCount={ratingCount}
          size="md"
          showCount={true}
        />
      </div>

      <div className="border-t border-gray-200 dark:border-stone-600 pt-4">
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              {userRating > 0 ? t("updateYourRating") : t("rateThisRecipe")}
            </h4>

            <StarRating
              rating={userRating}
              onRate={handleRate}
              readonly={isSubmitting}
              size="lg"
              className="mb-3"
            />

            {userRating > 0 && (
              <p className="text-sm text-gray-600 dark:text-stone-400">
                {t("yourRating")}: {userRating} {t("stars")}
              </p>
            )}
          </div>

          {showThankYou && (
            <div className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-900/90 border border-green-200 dark:border-green-700 rounded-lg p-4 shadow-xl backdrop-blur-sm min-w-[280px] max-w-[400px]">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-lg font-bold">
                    ✓
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {userRating === 1
                      ? t("thanksForRating")
                      : t("ratingUpdated")}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-0.5">
                    {userRating} {userRating === 1 ? t("star") : t("stars")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {isSubmitting && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
            <span className="text-sm text-gray-600 dark:text-stone-400">
              {t("savingRating")}...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
