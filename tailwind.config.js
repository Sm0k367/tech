/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: { purple: "#c026d3", cyan: "#22d3ee", fuchsia: "#d946ef" },
      },
    },
  },
  plugins: [],
};
