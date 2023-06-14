import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./index.html"],
  theme: {
    colors: {
      'brd-red' : '#e9041e',
    extend: {},
  }},
  plugins: [
  ],
} satisfies Config;
