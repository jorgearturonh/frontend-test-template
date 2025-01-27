import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        // Keep default sizes and add custom ones
        ag: ['16px', '20px'],
        xs: ['20px', '24px'],
        lg: ['18px', '20px'],
        xl: ['24px', '28px'],
        '2xl': ['36px', '40px'],
      },
      colors: {
        'stroke-secondary': '#8F8F8F',
        'stroke-primary': '#3B3B3B',
        'text-primary': '#3B3B3B',
        'cta-fill-primary': '#585660',
        gray: {
          medium: '#585660',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
