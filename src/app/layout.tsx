import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Calcuva | Premium Online Tools & Calculators",
  description: "Fast, accurate and free online calculators for finance, health, and academic needs. No signups required.",
  verification: {
    google: "gnvne988yEMr2dq7e3E0egt2XeA4e3H7DuLWZ8ui5js",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <Providers>
          <SiteHeader />
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
