import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        dark: {
          base:    "#0a0f1e",
          surface: "#111827",
          card:    "#1a2236",
          border:  "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        "glow-blue":   "0 0 40px -8px rgba(59,130,246,0.5)",
        "glow-violet": "0 0 40px -8px rgba(139,92,246,0.5)",
        "glow-sm":     "0 0 20px -5px rgba(59,130,246,0.35)",
      },
      animation: {
        "float-glow": "float-glow 4s ease-in-out infinite",
        shimmer:      "shimmer 1.6s infinite",
      },
      keyframes: {
        "float-glow": {
          "0%, 100%": { transform: "translateY(0px)", opacity: "0.7" },
          "50%":       { transform: "translateY(-8px)", opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
