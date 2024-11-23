/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-blue-500',
    'text-red-500',
    'text-green-500',
    'text-teal-500',
    'text-indigo-500',
    'text-orange-500',
    'text-pink-500',
    'text-amber-500',
    'text-cyan-500',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'Monaco', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}