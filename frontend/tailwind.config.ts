import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['\"Space Grotesk\"', 'system-ui', 'sans-serif'],
        body: ['\"Plus Jakarta Sans\"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0f172a',
        primary: '#0ea5e9',
        accent: '#f59e0b',
        surface: '#f8fafc',
      },
    },
  },
  plugins: [],
};

export default config;
