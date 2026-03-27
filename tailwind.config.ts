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
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#0F2A1D",
        },
        accent: {
          DEFAULT: "#52B788",
          light: "#74C69D",
          dark: "#40916C",
        },
        cream: {
          DEFAULT: "#FDFBF7",
          dark: "#F5F0E8",
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
