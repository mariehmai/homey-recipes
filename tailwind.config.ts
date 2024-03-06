import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "home": "url('/assets/home-bg.jpg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
