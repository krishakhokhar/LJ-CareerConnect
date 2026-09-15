/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#F2F4F5',
          100: '#E4E8EA',
          200: '#C7CFD3',
          300: '#9AA6AD',
          400: '#6B7A84',
          500: '#4B5963',
          600: '#3A464E',
          700: '#2D373E',
          800: '#232B31',
          900: '#1B2126',
          950: '#14181B',
        },
        paper: {
          50: '#FDFCF9',
          100: '#FAF8F3',
          200: '#F3F0E8',
          300: '#E9E4D8',
        },
        brand: {
          50: '#ECFDF6',
          100: '#D1FAE9',
          200: '#A5F1D3',
          300: '#6FE3BB',
          400: '#3BCC9F',
          500: '#1CAE84',
          600: '#148C6B',
          700: '#106F56',
          800: '#0E5946',
          900: '#0B4A3A',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(20, 24, 27, 0.04), 0 1px 3px 0 rgba(20, 24, 27, 0.06)',
        card: '0 2px 8px -2px rgba(20, 24, 27, 0.08), 0 4px 16px -4px rgba(20, 24, 27, 0.06)',
        lift: '0 8px 24px -6px rgba(20, 24, 27, 0.14)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: 0, transform: 'translateX(12px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        slideInLeft: { '0%': { opacity: 0, transform: 'translateX(-16px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
