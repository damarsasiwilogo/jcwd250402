/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0256EE",
        secondary: "#0256EE",
        tertiary: "#9B02EE",
        accent: "",
      },
      fontFamily: {
        primary: "Ubuntu",
        secondary: "MD Sans",
      },
      backgroundImage: {
        login: "url('./asset/Login.png')",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
