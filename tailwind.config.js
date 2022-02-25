module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'electric-violet': '#5d18ea',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}
