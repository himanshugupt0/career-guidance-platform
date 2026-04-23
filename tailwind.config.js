/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'Inter', 'Satoshi', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        slate: {
          50: '#f8fafc',
          950: '#020617',
        },
        gray: {
          50: '#f9fafb',
          950: '#030712',
        },
        accent: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        gradient: {
          hero: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 50%, #06b6d4 100%)',
          card: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          glow: 'linear-gradient(145deg, rgba(14,165,233,0.3), rgba(124,58,237,0.2))',
          success: 'linear-gradient(135deg, #10b981, #34d399)',
        },
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        soft: '0 10px 30px rgb(2 6 23 / 0.10)',
        glow: '0 0 20px rgb(14 165 233 / 0.4)',
        'glow-lg': '0 0 40px rgb(14 165 233 / 0.6)',
        float: '0 25px 50px -12px rgb(0 0 0 / 0.15), 0 10px 20px -5px rgb(0 0 0 / 0.08)',
        glass: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        neumorphism: '8px 8px 16px #d1d9e6, -8px -8px 16px #f8f9fa',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '4px',
        DEFAULT: '12px',
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
      },
    },
  },
  darkMode: 'class',

  plugins: [],
}


