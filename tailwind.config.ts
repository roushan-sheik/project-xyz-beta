import type { Config } from "tailwindcss";

const FONT_FAMILY = "'Plus Jakarta Sans', sans-serif";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [FONT_FAMILY],
      },
      colors: {
        brand: {
          50: "#FFF5F5",
          100: "#FFE3E3",
          200: "#FFBDBD",
          300: "#FF9999",
          400: "#FF4A57",
          500: "#D7000F",
          600: "#B8000D",
          700: "#A3000B",
          800: "#7A0009",
          900: "#520006",
        },
        neutral: {
          900: "#0F172A",
          700: "#334155",
          500: "#64748B",
          300: "#CBD5E1",
          100: "#F1F5F9",
        },
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.2)",
          dark: "rgba(0, 0, 0, 0.1)",
        },
      },
      fontSize: {
        display1: ["4.5rem", { lineHeight: "1.4", fontWeight: "700" }],
        display2: ["4rem", { lineHeight: "1.4", fontWeight: "700" }],
        display3: ["3.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        title2: ["3rem", { lineHeight: "1.4", fontWeight: "600" }],
        title3: ["2.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        heading1: ["1.875rem", { lineHeight: "1.4", fontWeight: "600" }],
        heading2: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        heading3: ["1.25rem", { lineHeight: "1.4", fontWeight: "500" }],
        body1: ["1.125rem", { lineHeight: "1.4", fontWeight: "400" }],
        body2: ["1rem", { lineHeight: "1.4", fontWeight: "400" }],
        body3: ["0.875rem", { lineHeight: "1.4", fontWeight: "400" }],
        caption1: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
        caption2: ["0.625rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      backgroundImage: {
        "gradient-glass":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "gradient-brand": "linear-gradient(135deg, #D7000F 0%, #A3000B 100%)",
        "gradient-dark": `
          radial-gradient(at 4% 21%, hsla(240,100%,10%,0.63) 0px, transparent 50%), 
          radial-gradient(at 98% 1%, hsla(289,100%,23%,0.82) 0px, transparent 50%), 
          radial-gradient(at 0% 50%, hsla(255,0%,0%,1) 0px, transparent 50%)
        `,
      },
      backgroundColor: {
        "app-dark": "hsla(281,93%,6%,1)",
      },
      backdropBlur: {
        none: "0",
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glass-shine": "glassShine 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glassShine: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
