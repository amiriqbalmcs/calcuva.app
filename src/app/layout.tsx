import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://calcuva.app"),
  title: {
    default: "Calcuva — Free Online Calculators for Finance, Health & Business",
    template: "%s | Calcuva",
  },
  description: "Fast, accurate, and 100% free online calculators for finance, health, business, and everyday math. No signups. No tracking. Just results.",
  keywords: ["calculator", "online calculator", "free calculator", "finance calculator", "health calculator", "bmi calculator", "loan calculator", "tax calculator"],
  authors: [{ name: "Calcuva" }],
  creator: "Calcuva",
  verification: {
    google: "gnvne988yEMr2dq7e3E0egt2XeA4e3H7DuLWZ8ui5js",
  },
  openGraph: {
    type: "website",
    siteName: "Calcuva",
    title: "Calcuva — Free Online Calculators",
    description: "Fast, accurate, and 100% free online calculators for finance, health, business, and everyday math.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Calcuva — 30+ Free Smart Calculators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calcuva — Free Online Calculators",
    description: "Fast, accurate, and 100% free online calculators for finance, health, business, and everyday math.",
    images: ["/og-image.png"],
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
