import { CALCULATORS, CATEGORIES } from "@/lib/calculators";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://YOUR-DOMAIN.app"; // Update this to calcuva.app or calcuva.io

  // Home
  const routes: MetadataRoute.Sitemap = [{
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  }];

  // Compliance Pages
  ["about", "contact", "privacy", "terms", "disclaimer"].forEach(page => {
    routes.push({
      url: `${baseUrl}/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  // Category Pages
  Object.keys(CATEGORIES).forEach((cat) => {
    routes.push({
      url: `${baseUrl}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Calculator Pages
  CALCULATORS.forEach((calc) => {
    routes.push({
      url: `${baseUrl}/calculators/${calc.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return routes;
}
