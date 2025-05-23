/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./public/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f75c1e",
        dark: "#3f3f3f",
      },
    },
  },
  plugins: [],
};
