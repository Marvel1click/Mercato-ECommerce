/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fdf5f2',
          100: '#fbe8e1',
          200: '#f8d4c7',
          300: '#f2b5a0',
          400: '#e98d6e',
          500: '#D4734E',
          600: '#c55a35',
          700: '#a4482a',
          800: '#873d28',
          900: '#6f3525',
        },
        olive: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          200: '#ccd9cd',
          300: '#a6bda8',
          400: '#7a9a7d',
          500: '#4A7C59',
          600: '#3d6349',
          700: '#32503c',
          800: '#2a4132',
          900: '#24362b',
        },
        marine: {
          50: '#f2f7fa',
          100: '#e1ecf3',
          200: '#c8dce9',
          300: '#a2c4d9',
          400: '#75a5c5',
          500: '#2C5F8D',
          600: '#2a5580',
          700: '#254669',
          800: '#233b57',
          900: '#21344a',
        },
        cream: {
          50: '#FDFCFA',
          100: '#F5F1E8',
          200: '#EDE6D8',
          300: '#E2D8C4',
          400: '#D4C5A9',
          500: '#C5B18E',
          600: '#A89367',
          700: '#8B7750',
          800: '#6E5D40',
          900: '#574A34',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
