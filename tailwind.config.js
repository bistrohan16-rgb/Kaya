import tailwindAnimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kaya: {
          navy: "#0A1628",
          surface: "#0F2035",
          card: "#162232",
          "card-hover": "#1E2E42",
          border: "#2A3F58",
          gold: "#B8960C",
          "gold-light": "#D4AA10",
          white: "#F8F8F8",
          amber: "#C44A1A",
          emerald: "#1E5C3A",
        }
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: { lg: "0.75rem", md: "0.5rem", sm: "0.375rem" },
    },
  },
  plugins: [tailwindAnimate],
}
