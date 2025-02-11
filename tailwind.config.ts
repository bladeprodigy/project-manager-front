import type {Config} from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: {
          light: '#EFF6FF', // similar to blue-50
          DEFAULT: '#3B82F6', // similar to blue-600
          dark: '#1D4ED8', // similar to blue-700
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
