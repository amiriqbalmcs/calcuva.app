import type { Metadata } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL, GA_ID } from "@/lib/constants";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Script from "next/script";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Calcuva — Free Online Calculators for Finance, Health & Business",
    template: "%s | Calcuva",
  },
  description: "Fast, accurate, and 100% free online calculators for finance, health, business, and everyday math. No signups. No tracking. Just results.",
  keywords: ["calculator", "online tool", "free calculator", "finance", "health", "business", "productivity", "math"],
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Calcuva — 60+ Free Smart Calculators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calcuva — Free Online Calculators",
    description: "Fast, accurate, and 100% free online calculators for finance, health, business, and everyday math.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-concept.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-concept.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Calcuva",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ],
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plexMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground font-sans">
        <Providers>
          <GoogleAnalytics ga_id={GA_ID} />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Analytics />
          <SpeedInsights />
          <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Calcuva",
                "url": SITE_URL,
                "logo": `${SITE_URL}/logo.png`,
                "description": "High-fidelity, professional online tools and calculators for finance, health, and productivity.",
                "foundingDate": "2024",
                "founder": {
                  "@type": "Person",
                  "name": "Calcuva Engineering Team",
                  "jobTitle": "Product Specialists"
                },
                "sameAs": [
                  "https://twitter.com/calcuva",
                  "https://facebook.com/calcuva"
                ]
              })
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
