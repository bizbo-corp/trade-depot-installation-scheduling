import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-2": "var(--background-2)",
        "background-3": "var(--background-3)",
        foreground: "var(--foreground)",
        "neutral-olive": {
          50: "var(--neutral-olive-50)",
          100: "var(--neutral-olive-100)",
          200: "var(--neutral-olive-200)",
          300: "var(--neutral-olive-300)",
          400: "var(--neutral-olive-400)",
          500: "var(--neutral-olive-500)",
          600: "var(--neutral-olive-600)",
          700: "var(--neutral-olive-700)",
          800: "var(--neutral-olive-800)",
          900: "var(--neutral-olive-900)",
          950: "var(--neutral-olive-950)",
        },
        olive: {
          50: "var(--olive-50)",
          100: "var(--olive-100)",
          200: "var(--olive-200)",
          300: "var(--olive-300)",
          400: "var(--olive-400)",
          500: "var(--olive-500)",
          600: "var(--olive-600)",
          700: "var(--olive-700)",
          800: "var(--olive-800)",
          900: "var(--olive-900)",
          950: "var(--olive-950)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

