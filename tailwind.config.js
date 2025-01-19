/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ["Montserrat"],
      },
      colors: {
        button: "#96B85C",
        background: "#D9D9D9",
        low: "#98B7EE",
        middle: "#F5F6A39C",
        high: "#FF53497A",
        wfhome: "#EFEFEF",
      },
    },
  },
  plugins: [],
};
