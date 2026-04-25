import { getSortedPostsData } from "@/lib/markdown";
import { Seo } from "@/components/Seo";
import { ClientHome } from "@/components/ClientHome";

export default async function IndexPage() {
  // Fetch guides on the server for maximum authority and SEO
  const guides = await getSortedPostsData("guides");
  const posts = await getSortedPostsData("blog");
  
  // Pick a diverse set of guides for the homepage (Finance, Health, Business)
  const homeGuides = [
    guides.find(g => g.slug === "loan-emi-calculator"),
    guides.find(g => g.slug === "bmi-tdee-calculator"),
    guides.find(g => g.slug === "profit-margin-calculator"),
  ].filter(Boolean);

  const homePosts = posts.slice(0, 3);

  return (
    <>
      <Seo
        title="Calcuva — Professional Decision Engine | Finance, Health & Math"
        description="A high-authority toolkit of free, instant calculators and expert strategy guides. Master the math of loans, taxes, metabolic health, and business strategy with total privacy."
        canonicalPath="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Calcuva",
          url: "https://calcuva.com",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://calcuva.com/?q={query}",
            "query-input": "required name=query",
          },
        }}
      />

      <ClientHome guides={homeGuides} posts={homePosts} />
    </>
  );
}
