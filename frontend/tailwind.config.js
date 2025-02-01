/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50:  '#F0F3F2',
          100: '#D9DFDE',
          200: '#B3C1BF',
          300: '#8DA3A2',
          400: '#678584',
          500: '#3B5249',
          600: '#32443E',
          700: '#29383A',
          800: '#202C35',
          900: '#181F30',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'sans-serif'], // Add Montserrat before Inter
      },
    },
  },
  plugins: [],
}
