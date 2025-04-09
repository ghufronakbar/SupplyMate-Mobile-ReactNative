/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: {
          "1": "#23ACE3",
          "2": "#808080",
          "3": "#dbbda5",
          "4": '#E8E4FF',
          "5": '#B0A4FD',
          success: "#23ACE3",
          info: "#8cc5ff",
          error: "#fcaea4"
        }
      },
      fontFamily: {
        othin: ['Outfit-Thin', 'sans-serif'],
        oextralight: ['Outfit-ExtraLight', 'sans-serif'],
        olight: ['Outfit-Light', 'sans-serif'],
        oregular: ['Outfit-Regular', 'sans-serif'],
        omedium: ['Outfit-Medium', 'sans-serif'],
        osemibold: ['Outfit-SemiBold', 'sans-serif'],
        obold: ['Outfit-Bold', 'sans-serif'],
        oextrabold: ['Outfit-ExtraBold', 'sans-serif'],
        oblack: ['Outfit-Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

