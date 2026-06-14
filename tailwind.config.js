/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF5ED',
          100: '#FFE7D5',
          200: '#FFCBAA',
          300: '#FFAF80',
          400: '#FF9455',
          500: '#FF8A3D',
          600: '#E87024',
          700: '#BE5818',
          800: '#944210',
          900: '#6A2E0A',
        },
        secondary: {
          50: '#EFF7F7',
          100: '#D5EBEB',
          200: '#ABD6D6',
          300: '#7EBEBE',
          400: '#54A6A6',
          500: '#2A8E8E',
          600: '#1E6B6B',
          700: '#165050',
          800: '#0F3737',
          900: '#081E1E',
        },
        warm: {
          50: '#FAF8F5',
          100: '#F3EEE8',
          200: '#E6DDD2',
          300: '#D3C4B0',
          400: '#BDAA8F',
          500: '#A6906F',
          600: '#8A7557',
          700: '#6D5C43',
          800: '#4F4330',
          900: '#332C20',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 10px 40px -5px rgba(0, 0, 0, 0.1)',
        'orange-glow': '0 4px 20px -2px rgba(255, 138, 61, 0.35)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
