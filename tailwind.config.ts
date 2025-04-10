import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      colors: {
        black: "#1E1E1C",
        "dark-black": "#181816",
        "light-black": "#353533",
        green: "#1E8571",
        "dark-green": "#186a5a",
        "light-green": "#35917f",
        "extra-light-green": "#d2e7e3",
        white: "#FFFFFF",
      },
      gridTemplateColumns: {
        "16": "repeat(16, minmax(0, 1fr));",
        "14": "repeat(14, minmax(0, 1fr));",
      },
      keyframes: {
        tada: {
          "0%": {
            transform: "scale3d(1, 1, 1)",
          },
          "10%, 20%": {
            transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)",
          },
          "30%, 50%, 70%, 90%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",
          },
          "40%, 60%, 80%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",
          },
          "100%": {
            transform: "scale3d(1, 1, 1)",
          },
        },
        slideInFromBottom: {
          "0%": { transform: "translateY(100%)", opacity: "0.6" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-100%)", opacity: "0.6" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideinleft: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(5%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideinright: {
          "0%": { transform: "translateX(100%)" },
          "50%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideoutleft: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(5%)" },
          "100%": { transform: "translateX(-110%)" },
        },
        slideoutright: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(110%)" },
        },
        fingerslideoutleft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-110%)" },
        },
        fingerslideoutright: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        slightpulse: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.7" },
          "100%": { opacity: "1" },
        },
        backgroundOpacitySlightPulse: {
          "0%": { "background-color": "rgba(233, 243, 241, 1)" },
          "50%": { "background-color": "rgba(233, 243, 241, 0)" },
          "100%": { "background-color": "rgba(233, 243, 241, 1)" },
        },
        backgroundOpacitySlightPulseDark: {
          "0%": { "background-color": "rgba(0, 0, 0, 1)" },
          "50%": { "background-color": "rgba(0, 0, 0, 0.5)" },
          "100%": { "background-color": "rgba(0, 0, 0, 1)" },
        },
      },
      animation: {
        tada: "tada 1s ease-in-out 0.25s infinite",
        "slide-in-bottom": "slideInFromBottom 0.25s ease-out forwards",
        "slide-in-top": "slideInFromTop 0.25s ease-out forwards",
        slideinleft: "slideinleft 0.5s ease-out forwards",
        slideinright: "slideinright 0.5s ease-out forwards",
        slideoutleft: "slideoutleft 0.5s ease-out forwards",
        slideoutright: "slideoutright 0.5s ease-out forwards",
        fingerslideoutleft: "fingerslideoutleft 0.5s ease-out forwards",
        fingerslideoutright: "fingerslideoutright 0.5s ease-out forwards",
        slightpulse: "slightpulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        backgroundOpacitySlightPulse: "backgroundOpacitySlightPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        backgroundOpacitySlightPulseDark: "backgroundOpacitySlightPulseDark 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        carousel: "inset 0px 0px 10px #000000",
        "carousel-dark": "inset 0px 0px 10px #525252",
        "category-nav": "inset 0px 0px 5px #737373",
        "product-cards": "0px 0px 2px #1E8571",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
};
export default config;
