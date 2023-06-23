/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-1': '#C9E6AC',
        'green-2': '#6F805E',
        'green-5': '#879973',
        'brown': '#403539',
        'green-radial-button': 'bg-[radial-gradient(#F1EAD070, #C9E6AC50)]',
      },
      // fontFamily: {
      //   sans: ['Graphik', 'sans-serif']
      // }
    },
  },
  plugins: [],
}
