/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD700',    // Or pur
          50: '#FFFDF5',         // Très clair
          100: '#FFF9DB',        // Pâle
          200: '#FFF1A8',        // Jaune clair
          300: '#FFE773',        // Jaune doré
          400: '#FFDB38',        // Or brillant
          500: '#FFD700',        // Or standard
          600: '#E6C200',        // Or profond
          700: '#CCAA00',        // Vieil or
          800: '#B38F00',        // Doré foncé
          900: '#8C6D00',        // Or antique
        },

      },

    },
  },
  plugins: [],
}

