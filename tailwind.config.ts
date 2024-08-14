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
        black: "#1E1E1C",
        "dark-black": "#181816",
        "light-black": "#353533",
        green: "#1E8571",
        "dark-green": "#186a5a",
        "light-green": "#35917f",
        white: "#FFFFFF",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
