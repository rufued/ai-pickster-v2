import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#080a0d",
          900: "#0d1117",
          850: "#111821",
          800: "#151d27",
          700: "#202b38",
        },
        accent: {
          green: "#39ff88",
          blue: "#36a3ff",
        },
      },
      boxShadow: {
        glow: "0 0 28px rgba(57, 255, 136, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
