import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AppPulse AI — Ranking Protection for Your App Revenue",
  description: "Autonomous competitor intelligence for Shopify App Developers. Monitor rankings, analyze reviews, and get actionable playbooks — before competitors outpace you.",
  keywords: ["Shopify App Store", "competitor intelligence", "app ranking", "review analysis", "SaaS analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-deep-space text-text-primary font-jakarta antialiased">
        {children}
      </body>
    </html>
  );
}