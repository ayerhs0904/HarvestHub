/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#D8ECE2',
          200: '#B2D8C5',
          500: '#2D6A4F',
          600: '#1B4332',
          700: '#143626',
          800: '#0E2419',
          900: '#081710',
        },
        sage: {
          50: '#F4FBF7',
          100: '#E8F5E9',
          300: '#A3D9B1',
          400: '#74C69D',
          500: '#52B788',
          600: '#40916C',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F7F4EE',
          200: '#EFE9DE',
          300: '#E2DAC8',
          400: '#C8BEA7',
        },
        earth: {
          50: '#FFFBEB',
          100: '#FDF0E2',
          200: '#FCD8B8',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(27, 67, 50, 0.08), 0 4px 6px -2px rgba(27, 67, 50, 0.04)',
        'elevated': '0 10px 25px -5px rgba(27, 67, 50, 0.12), 0 8px 10px -6px rgba(27, 67, 50, 0.08)',
      },
    },
  },
  plugins: [],
};
