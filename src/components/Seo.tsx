"use client";

import { useEffect } from "react";
import { SITE_URL } from "@/lib/constants";

interface Props {
  title: string;
  description: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
  faqs?: { q: string; a: string }[];
}

/**
 * Lightweight SEO head manager — sets title, meta description, canonical and optional JSON-LD.
 */
export const Seo = ({ title, description, canonicalPath, jsonLd, faqs }: Props) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description.slice(0, 158));
    setOg("og:title", title);
    setOg("og:description", description.slice(0, 158));
    setOg("og:type", "website");

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    const path = canonicalPath ?? window.location.pathname;
    canonical.setAttribute("href", `${SITE_URL}${path}`);

    // json-ld
    const existing = document.getElementById("page-jsonld");
    if (existing) existing.remove();
    const existingFaq = document.getElementById("faq-jsonld");
    if (existingFaq) existingFaq.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "page-jsonld";
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    if (faqs && faqs.length > 0) {
      const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      };
      const script = document.createElement("script");
      script.id = "faq-jsonld";
      script.type = "application/ld+json";
      script.text = JSON.stringify(faqLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, jsonLd, faqs]);

  return null;
};
