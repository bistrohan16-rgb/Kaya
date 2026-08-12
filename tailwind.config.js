import tailwindAnimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kaya: {
          // Dark mode
          "dark-bg": "#080C08",
          "dark-surface": "#0F140F",
          "dark-card": "#161D16",
          "dark-border": "#252F25",
          // Light mode
          "light-bg": "#F7FAF7",
          "light-surface": "#FFFFFF",
          "light-card": "#F0F5F0",
          "light-border": "#D4E2D4",
          // Accent — same both modes
          green: "#1B7A4A",
          "green-light": "#22A05E",
          "green-muted": "#1B7A4A",
          // Text
          "dark-text": "#F4F7F4",
          "light-text": "#0A120A",
          // Status
          success: "#16A34A",
          warning: "#D97706",
          danger: "#DC2626",
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
