import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        steel: "#4b5563",
        mint: "#2dd4bf",
        coral: "#fb7185",
        amber: "#f59e0b"
      }
    }
  },
  plugins: []
};

export default config;
