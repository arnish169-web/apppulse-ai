import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-space": "#0B1121",
        surface: "#151E2D",
        border: "#1E293B",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "signal-indigo": "#6366F1",
        "pulse-emerald": "#10B981",
        "alert-amber": "#F59E0B",
        "coral-red": "#EF4444",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0B1121 0%, #151E2D 50%, #1a1f35 100%)",
        "accent-glow": "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;