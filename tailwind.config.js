/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grid-circles': "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27 viewBox=%270 0 40 40%27%3E%3Ccircle cx=%2720%27 cy=%2720%27 r=%274%27 fill=%27rgba(77,77,77,0.1)%27 /%3E%3C/svg%3E')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        background: "#1A1A1A",
        elementBackground: "#2C2C2C", 
        primary: "#00C896",
        primaryHover: '#00E6A0',
        secondary: "#FFFFFF",
        textSecondary: "#A8A8A8", 
        accent: "#FFD700",
        accentHover: '#FFC700',
        error: '#FF4C4C',
        success: '#00FFB0',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0, 0, 0, 0.1)', // Sombra ligera
        strong: '0 4px 6px rgba(0, 0, 0, 0.3)', // Sombra fuerte
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        muted: '#2D2D2D', 
      },
      transitionProperty: {
        all: 'all', 
      },
      transitionDuration: {
        300: '300ms',
      },
      transitionTimingFunction: {
        ease: 'ease-in-out', 
      },
    },
  },
  plugins: [],
}
