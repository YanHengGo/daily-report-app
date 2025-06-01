/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ← `src`ディレクトリを使っている場合
    "./app/**/*.{js,ts,jsx,tsx}", // ← `app`ディレクトリがある場合
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};