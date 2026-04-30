import { getSortedPostsData } from "@/lib/markdown";
import { CATEGORIES, CategoryKey } from "@/lib/calculators";
import { GuideCard } from "@/components/GuideCard";
import { Seo } from "@/components/Seo";
import Link from "next/link";
import { ChevronRight, BookOpen, GraduationCap } from "lucide-react";
import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Expert Strategy Guides & Insights — Calcuva Knowledge Library",
  description: "Deep-dive technical guides on finance, health math, and business strategy. Master the professional math behind our tools with 30+ expert research guides.",
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    title: "Expert Strategy Guides | Calcuva",
    description: "Deep-dive technical guides on finance, health math, and business strategy.",
    url: `${SITE_URL}/guides`,
    siteName: "Calcuva",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: [`${SITE_URL}/og-image.png`] },
};



export default async function GuidesPage() {
  const guides = await getSortedPostsData("guides");
  
  // Group guides by category
  const groupedGuides = (Object.keys(CATEGORIES) as CategoryKey[]).map(key => {
    return {
      category: CATEGORIES[key],
      guides: guides.filter(g => g.category === key)
    };
  }).filter(group => group.guides.length > 0);

  return (
    <div className="bg-secondary/5 min-h-screen">
      <Seo 
        title="Expert Strategy Guides & Insights — Calcuva Knowledge Library"
        description="Deep-dive technical guides on finance, health math, and business strategy. Master the professional math behind our tools with over 25,000 words of expert research."
        canonicalPath="/guides"
      />

      {/* Header */}
      <section className="bg-background border-b border-border pt-28 pb-20">
        <div className="container-wide">
          <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono uppercase font-black tracking-[0.3em] mb-12">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground/80">Knowledge Library</span>
          </nav>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-foreground mb-8">
              <GraduationCap className="size-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">Calcuva Academy · Help Guides</span>
            </div>
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-10">
              Expert Guides <span className="text-foreground/40 italic">&</span> Insights
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
              We don't just provide calculators; we explain the math behind your most important life decisions. Explore our library of 30+ easy-to-read research guides.
            </p>
          </div>
        </div>
      </section>

      {/* Library Grid */}
      <div className="container-wide py-16">
        <div className="space-y-20">
          {groupedGuides.map((group) => (
            <section key={group.category.label}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
                  <BookOpen className="size-4" />
                  {group.category.label} Series
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.guides.map((guide) => (
                  <GuideCard key={guide.slug} guide={guide} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

    </div>
  );
}
