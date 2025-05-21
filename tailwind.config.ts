import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        brown: {
          50: "#ECE7E4"  /* #ECE7E4 */,
          100: "#DCD3CC" /* #DCD3CC */,
          200: "#B8A698" /* #B8A698 */,
          300: "#947A66" /* #947A66 */,
          400: "#615043" /* #615043 */,
          500: "#2D251F" /* #2D251F */,
          600: "#241E19" /* #241E19 */,
          700: "#1B1613" /* #1B1613 */,
          800: "#120F0C" /* #120F0C */,
          900: "#090706" /* #090706 */,
          950: "#030202" /* #030202 */,
        },
        orange: {
          50: "#FDF1E8"  /* #FDF1E8 */,
          100: "#FAE3D1" /* #FAE3D1 */,
          200: "#F6C9A7" /* #F6C9A7 */,
          300: "#F1AD79" /* #F1AD79 */,
          400: "#ED914A" /* #ED914A */,
          500: "#E8741E" /* #E8741E */,
          600: "#BE5D13" /* #BE5D13 */,
          700: "#8F460F" /* #8F460F */,
          800: "#61300A" /* #61300A */,
          900: "#2E1705" /* #2E1705 */,
          950: "#170B02" /* #170B02 */,
        },
        moss: {
          50: "#EFF2EE"  /* #EFF2EE */,
          100: "#DFE5DC" /* #DFE5DC */,
          200: "#BCC8B7" /* #BCC8B7 */,
          300: "#9CAD94" /* #9CAD94 */,
          400: "#79916E" /* #79916E */,
          500: "#5C6E54" /* #5C6E54 */,
          600: "#485742" /* #485742 */,
          700: "#384333" /* #384333 */,
          800: "#242B21" /* #242B21 */,
          900: "#131712" /* #131712 */,
          950: "#0A0C09" /* #0A0C09 */,
        },
        pink: {
          50: "#FBEAF0", /* #FBEAF0 */
          100: "#F8D8E4", /* #F8D8E4 */
          200: "#F0ADC7", /* #F0ADC7 */
          300: "#E987AC", /* #E987AC */	
          400: "#E05C8F", /* #E05C8F */
          500: "#D93472", /*hsl(337, 68.50%, 52.70%) */
          600: "#B4225A", /*hsl(337, 68.20%, 42.00%) */
          700: "#891A45", /*hsl(337, 68.10%, 32.00%) */
          800: "#5A112D", /*hsl(337, 68.20%, 21.00%) */
          900: "#2F0918", /*hsl(337, 68.20%, 21.00%) */
          950: "#15040B", /* #15040B */
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
