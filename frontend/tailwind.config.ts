import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E6B6B",   // deep teal (bottom stripe)
          light: "#5FA3A3",     // medium teal (3rd stripe)
          dark: "#094D4D",      // darker shade
        },
        accent: {
          DEFAULT: "#95C8CB",   // light teal/aqua (2nd stripe)
          light: "#B8DDE0",     // lighter tint
          dark: "#5FA3A3",      // medium teal
        },
        cream: {
          DEFAULT: "#F0EDE8",   // off-white (top stripe)
          dark: "#E3DED7",      // slightly darker cream
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
