const defaultTagColors: Record<string, string> = {
  sweet: "bg-orange-400",
  dessert: "bg-amber-500",
  savory: "bg-orange-600",
  bbq: "bg-orange-700",
  soup: "bg-amber-600",
  quick: "bg-orange-500",
  spicy: "bg-red-600",
  appetizer: "bg-amber-400",
  vegan: "bg-orange-500",
};

const colorOptions = [
  "bg-orange-400",
  "bg-orange-500",
  "bg-orange-600",
  "bg-amber-400",
  "bg-amber-500",
  "bg-amber-600",
  "bg-orange-700",
  "bg-amber-700",
  "bg-yellow-600",
  "bg-orange-300",
  "bg-amber-300",
  "bg-yellow-500",
];

export function getTagColor(tag: string): string {
  if (defaultTagColors[tag]) {
    return defaultTagColors[tag];
  }

  // Generate consistent color based on tag name hash
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash + tag.charCodeAt(i)) & 0xffffffff;
  }
  return colorOptions[Math.abs(hash) % colorOptions.length];
}
