import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // 'gradient', // Can likely remove this now
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        background: "hsl(0 0% 100%)", // White
        foreground: "hsl(240 10% 3.9%)", // Dark Gray
        primary: {
          DEFAULT: "hsl(222.2 47.4% 11.2%)", // Dark Blue (example)
          foreground: "hsl(210 40% 98%)", // Light Gray
        },
        accent: {
          DEFAULT: "hsl(217.2 91.2% 59.8%)", // Vibrant Blue (#3b82f6)
          foreground: "hsl(210 40% 98%)", // Light Gray for text on accent
        },
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)", // Light Gray
          foreground: "hsl(215.4 16.3% 46.9%)", // Muted Gray Text
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(240 10% 3.9%)",
        },
        border: "hsl(214.3 31.8% 91.4%)",
        // Dark mode (example - can be refined)
        dark: {
          background: "hsl(240 10% 3.9%)", // Dark Gray
          foreground: "hsl(0 0% 98%)", // Almost White
          primary: {
            DEFAULT: "hsl(210 40% 98%)", // Light Gray
            foreground: "hsl(222.2 47.4% 11.2%)", // Dark Blue
          },
          accent: {
            DEFAULT: "hsl(217.2 91.2% 59.8%)", // Vibrant Blue
            foreground: "hsl(222.2 47.4% 11.2%)", // Dark Blue text on accent
          },
          muted: {
            DEFAULT: "hsl(217.2 32.6% 17.5%)", // Dark Muted Gray
            foreground: "hsl(215 20.2% 65.1%)", // Lighter Muted Gray Text
          },
          card: {
            DEFAULT: "hsl(240 10% 3.9%)",
            foreground: "hsl(0 0% 98%)",
          },
          border: "hsl(217.2 32.6% 17.5%)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: ({ theme }: { theme: any }) => ({
        DEFAULT: {
          css: {
            h1: {
              fontSize: '2.8em', // Default H1 size
            },
            // Base prose styles
          },
        },
        // Custom prose size for 14px paragraphs
        '14px': {
          css: {
            p: {
              fontSize: '14px',
            },
          },
        },
        '22px-h1': {
          css: {
            h1: {
              fontSize: '22px',
            },
          },
        },
      }),
      // Removed gradient-xy animation definitions
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp")],
};
export default config;