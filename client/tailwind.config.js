/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base_01: "#e1dbd6",
        base_02: "#b5a89f",
        base_03: "#2b1f1b",
        base_04: "#84a98c",
        button_one: "#ff0022",
        button_two: "#b5dead",
      },
      fontFamily: {
        space: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
