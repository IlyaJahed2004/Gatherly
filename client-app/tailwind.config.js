/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D9488',
        secondary: '#14B8A6',
        background: '#F3F4F6',
        btnText: '#FFFFFF',
        textTitle: '#1F2937',
        accent: '#F59E0B', 
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], 
      },
      boxShadow: {
        'card': '4px 4px 8px 0px rgba(0, 0, 0, 1)',
        'card-img': '0px 4px 4px 0px rgba(0, 0, 0, 1)',
        'btn': '5px 5px 10px 0px rgba(0, 0, 0, 1)',
      },
      borderRadius: {
        'card': '16px',
        'btn': '16px',
      }
    },
  },
  plugins: [],
}
