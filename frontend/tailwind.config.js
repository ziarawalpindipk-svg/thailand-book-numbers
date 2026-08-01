/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom coral scale - Tailwind doesn't ship one by default.
        coral: {
          50: "#fff2ef",
          100: "#ffe1da",
          200: "#ffc2b3",
          300: "#ff9c85",
          400: "#ff7a5c",
          500: "#ff5a3c", // primary CTA color
          600: "#e8442a",
          700: "#c23420",
          800: "#992a1a",
          900: "#7a2216",
        },
      },
    },
  },
  plugins: [],
}
