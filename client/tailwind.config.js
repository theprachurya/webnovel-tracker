/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#F5E6D3',
          DEFAULT: '#D4A373',
          dark: '#A67C52',
        },
        background: {
          light: '#FDFCFA',
          dark: '#1A1816',
        },
        text: {
          light: '#2D2A28',
          dark: '#E8E6E3',
        },
        // AniList-like colors
        anilist: {
          blue: '#2B2D42',
          'blue-light': '#3D405B',
          'blue-dark': '#1A1B26',
          purple: '#8D99AE',
          'purple-light': '#A2AEBB',
          'purple-dark': '#6B7280',
          pink: '#EF233C',
          white: '#EDF2F4',
          black: '#2B2D42',
          gray: {
            light: '#F8F9FA',
            DEFAULT: '#6B7280',
            dark: '#2D3748',
          },
          success: '#48BB78',
          warning: '#F6AD55',
          error: '#F56565',
        },
        // Sepia theme colors (AniList-inspired)
        sepia: {
          primary: '#2B2D42', // AniList blue as primary
          secondary: '#8D99AE', // AniList purple as secondary
          accent: '#EF233C', // AniList pink as accent
          background: '#FDFCFA',
          text: '#2D2A28',
          'primary-light': '#3D405B',
          'primary-dark': '#1A1B26',
          'secondary-light': '#A2AEBB',
          'secondary-dark': '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Crimson Pro', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      boxShadow: {
        'anilist': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'anilist-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} 