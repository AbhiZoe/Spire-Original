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
          DEFAULT: "#0F766E",   // deep teal (from logo dark areas)
          light: "#14B8A6",     // teal-500 (mid tones)
          dark: "#0D4F4A",      // darkest teal
        },
        accent: {
          DEFAULT: "#22D3EE",   // cyan-400 (logo bright cyan)
          light: "#67E8F9",     // cyan-300 (logo highlights)
          dark: "#06B6D4",      // cyan-500
        },
        cream: {
          DEFAULT: "#F0FDFA",   // teal-50 (light bg matching logo)
          dark: "#CCFBF1",      // teal-100
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
