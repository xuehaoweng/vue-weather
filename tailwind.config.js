/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 配置主题颜色
      colors: {
        "weather-primary": "#F8F8FF",
        "weather-secondary": "#E6E6FA",
      },
    },
    //配置字体
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
    },
    container: {
      padding: "2rem",
      center: true,
    },
    //设置断点，
    screens: {
      sm: "640px",
      md: "768px",
    },
  },
  plugins: [],
  darkMode: "class",
};
