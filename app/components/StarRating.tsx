import clsx from "clsx";
import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export const StarRating: FunctionComponent<StarRatingProps> = ({
  rating,
  onRate,
  readonly = false,
  size = "md",
  showValue = false,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleClick = (newRating: number) => {
    if (readonly || !onRate) return;

    setCurrentRating(newRating);
    onRate(newRating);
  };

  const handleMouseEnter = (star: number) => {
    if (readonly) return;
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getStarSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-xl";
      default:
        return "text-base";
    }
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className={clsx("flex items-center space-x-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(displayRating);
          const isHalfFilled =
            star === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={star}
              type="button"
              className={clsx(
                "relative transition-all duration-150 focus:outline-none",
                !readonly && "hover:scale-110 cursor-pointer",
                readonly && "cursor-default",
                getStarSize()
              )}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <span
                className={clsx(
                  "transition-colors duration-150",
                  isFilled
                    ? "text-yellow-400"
                    : isHalfFilled
                    ? "text-yellow-200"
                    : hoverRating >= star && !readonly
                    ? "text-yellow-300"
                    : "text-gray-300 dark:text-stone-600"
                )}
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      {showValue && currentRating > 0 && (
        <span
          className={clsx(
            "font-medium text-gray-600 dark:text-stone-400",
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          )}
        >
          {currentRating.toFixed(1)}
        </span>
      )}

      {!readonly && hoverRating > 0 && (
        <span
          className={clsx(
            "text-gray-500 dark:text-stone-500",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          ({hoverRating} star{hoverRating !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
};

interface RatingDisplayProps {
  averageRating: number;
  ratingCount: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export const RatingDisplay: FunctionComponent<RatingDisplayProps> = ({
  averageRating,
  ratingCount,
  size = "md",
  showCount = true,
  className = "",
}) => {
  if (ratingCount === 0) {
    return (
      <span
        className={clsx(
          "text-gray-500 dark:text-stone-500",
          size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm",
          className
        )}
      >
        No ratings yet
      </span>
    );
  }

  return (
    <div className={clsx("flex items-center space-x-2", className)}>
      <StarRating
        rating={averageRating}
        readonly={true}
        size={size}
        showValue={true}
      />
      {showCount && (
        <span
          className={clsx(
            "text-gray-600 dark:text-stone-400",
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          )}
        >
          ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
        </span>
      )}
    </div>
  );
};
