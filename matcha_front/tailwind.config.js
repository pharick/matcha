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
        'light-button-1': '#6F805E',
        'light-button-2': '#879973',
        'pink-primary': '#F39BB3',
        'neutral': '#F1EAD0',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'leaf-down': "url('/leaf_down.svg')",
        'leaf-main': "url('/leaf_main.svg')",
      },
      keyframes: {
        info: {
          'from': {transform: 'translate(100%)'},
          'to': {transform: '-translate-x-full'},
        }
      },
      animation: {
        // info: 'info 10s infinite easy-in-out',
      },
    },
  },
  plugins: [],
}
