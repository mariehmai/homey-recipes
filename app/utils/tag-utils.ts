const defaultTagColors: Record<string, string> = {
  sweet: "bg-pink-500",
  dessert: "bg-purple-500",
  savory: "bg-orange-500",
  bbq: "bg-red-600",
  soup: "bg-blue-500",
  quick: "bg-green-500",
  spicy: "bg-red-500",
  appetizer: "bg-yellow-500",
  vegan: "bg-green-600",
};

const colorOptions = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-rose-500",
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
