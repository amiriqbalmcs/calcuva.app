"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/constants";

interface SeoProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  jsonLd?: any;
}

export const Seo = ({
  title,
  description,
  canonicalPath,
  ogImage = "/og-image.png",
  ogType = "website",
  jsonLd,
}: SeoProps) => {
  const pathname = usePathname();
  const siteTitle = "Calcuva";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} — Free Online Calculators`;
  
  const canonicalUrl = `${SITE_URL}${canonicalPath || pathname}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />
    </>
  );
};
