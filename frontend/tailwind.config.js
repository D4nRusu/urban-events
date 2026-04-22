/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#121212",
        card: "#1e1e1e",
        accent: "#8b5cf6",
      }
    },
  },
  plugins: [],
}