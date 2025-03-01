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
        radishred: "#ee2e4e",
        midblue: "#1f69b3",
        picosun: "#f8ef22",
        wfhome: "#EFEFEF",
      },
    },
  },
  plugins: [],
};
