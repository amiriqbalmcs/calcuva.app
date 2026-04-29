import { CALCULATORS, CATEGORIES } from "@/lib/calculators";
import { getSortedPostsData } from "@/lib/markdown";
import { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    // Homepage
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },

    // Hub pages
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    // Compliance pages
    ...["about", "contact", "privacy", "terms", "disclaimer"].map(page => ({
      url: `${baseUrl}/${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];

  // Category pages
  Object.keys(CATEGORIES).forEach(cat => {
    routes.push({
      url: `${baseUrl}/category/${cat}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Calculator pages — primary money pages, high priority
  CALCULATORS.forEach(calc => {
    routes.push({
      url: `${baseUrl}/calculators/${calc.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  // Blog posts — dynamically read from content files
  try {
    const posts = await getSortedPostsData("blog");
    posts.forEach(post => {
      routes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  } catch (e) {
    // No blog posts yet
  }

  // Guide pages — guides render within calculator pages, link to main calc page
  // Also expose /guides page and each guide's own calc page with high priority
  try {
    const guides = await getSortedPostsData("guides");
    guides.forEach(guide => {
      // Guides are embedded in calculator pages — boost those calculator pages
      routes.push({
        url: `${baseUrl}/calculators/${guide.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      });
    });
  } catch (e) {
    // No guides yet
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return routes.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

