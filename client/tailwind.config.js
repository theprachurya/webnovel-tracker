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
          blue: '#2B2D42', // Main blue
          purple: '#8D99AE', // Secondary purple
          pink: '#EF233C', // Accent pink
          white: '#EDF2F4', // Light text
          black: '#2B2D42', // Dark background
          // Additional AniList colors
          'blue-light': '#3D405B', // Lighter blue
          'blue-dark': '#1A1B26', // Darker blue
          'purple-light': '#A2AEBB', // Lighter purple
          'purple-dark': '#6B7280', // Darker purple
          'gray-light': '#F8F9FA', // Light gray
          'gray-dark': '#2D3748', // Dark gray
          'success': '#48BB78', // Success green
          'warning': '#F6AD55', // Warning orange
          'error': '#F56565', // Error red
        },
        // Sepia theme colors
        sepia: {
          primary: '#D4A373', // Main sepia color
          secondary: '#E9EDC9', // Light sepia
          accent: '#CCD5AE', // Accent color
          background: '#FEFAE0', // Background color
          text: '#2D2A28', // Text color
          'primary-light': '#E6C9A8', // Lighter primary
          'primary-dark': '#BC6C25', // Darker primary
          'secondary-light': '#F5F1E3', // Lighter secondary
          'secondary-dark': '#D4C9A1', // Darker secondary
          'accent-light': '#E2E8D0', // Lighter accent
          'accent-dark': '#B7C4A0', // Darker accent
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
        'sepia': '0 4px 6px -1px rgba(212, 163, 115, 0.1), 0 2px 4px -1px rgba(212, 163, 115, 0.06)',
        'sepia-hover': '0 10px 15px -3px rgba(212, 163, 115, 0.1), 0 4px 6px -2px rgba(212, 163, 115, 0.05)',
      },
    },
  },
  plugins: [],
} 