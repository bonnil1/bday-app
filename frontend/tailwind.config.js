/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-cyan-500',
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