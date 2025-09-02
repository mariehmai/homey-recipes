import { RiUserLine } from "@remixicon/react";
import { useState, useEffect } from "react";

interface UserAvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({
  src,
  alt,
  className = "",
  size = "md",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  // Reset states when src changes
  useEffect(() => {
    if (src) {
      setImageError(false);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  }, [src]);

  const showPlaceholder = !src || imageError || !imageLoaded;

  return (
    <div className={`${sizeClasses[size]} rounded-full relative ${className}`}>
      {/* Placeholder - always rendered but hidden when image loads */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-opacity duration-200 ${
          showPlaceholder ? "opacity-100" : "opacity-0"
        }`}
      >
        <RiUserLine size={iconSizes[size]} className="text-white" />
      </div>

      {/* Image - only render if src exists */}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-200 ${
            imageLoaded && !imageError ? "opacity-100" : "opacity-0"
          }`}
          onError={() => setImageError(true)}
          onLoad={() => {
            setImageError(false);
            setImageLoaded(true);
          }}
        />
      )}
    </div>
  );
}
