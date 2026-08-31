/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceHover: '#f1f5f9',
        surfaceCard: '#ffffff',
        border: '#e2e8f0',
        brand: {
          orange: '#f97316',
          orangeHover: '#ea580c',
          orangeDark: '#c2410c',
          orangeGlow: 'rgba(249, 115, 22, 0.15)',
        },
        accent: {
          cyan: '#0891b2',
          emerald: '#059669',
          rose: '#dc2626',
          amber: '#d97706',
          indigo: '#4f46e5',
        }
      }
    },
  },
  plugins: [],
}


