/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'plant-darkest': '#0a0d0a',
        'plant-darker': '#111511',
        'plant-dark': '#1a2e1d',
        'plant-medium': '#2d6a4f',
        'plant-light': '#4f9d69',
        'plant-accent': '#74c69d',
        'plant-pale': '#b7e4c7',
        'glass-white': 'rgba(255, 255, 255, 0.05)',
        'glass-white-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards',
        'blur-in': 'blurIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blurIn: {
          '0%': { filter: 'blur(10px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
