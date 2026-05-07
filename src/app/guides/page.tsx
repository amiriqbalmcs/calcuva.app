import { getSortedPostsData } from "@/lib/markdown";
import { CATEGORIES, CategoryKey } from "@/lib/calculators";
import { GuideCard } from "@/components/GuideCard";
import { Seo } from "@/components/Seo";
import Link from "next/link";
import { ChevronRight, BookOpen, GraduationCap, Plus, Percent, Divide, Activity as ActivityIcon, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Expert Strategy Guides & Insights — Calcuva Knowledge Library",
  description: "Deep-dive technical guides on finance, health math, and business strategy. Master the professional math behind our tools with 60+ expert research guides.",
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
    <div className="bg-background min-h-screen">
      <Seo
        title="Expert Strategy Guides & Insights — Calcuva Knowledge Library"
        description="Deep-dive technical guides on finance, health math, and business strategy."
        canonicalPath="/guides"
      />

      {/* Immersive Header - Elite Style */}
      <header className="relative min-h-[70vh] lg:min-h-[80vh] flex flex-col items-center justify-start border-b border-border/50 bg-hero overflow-hidden pt-32 sm:pt-48 pb-20">
        {/* Dynamic Texture Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 dark:bg-indigo-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

          {/* Precision Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.03]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>

        {/* Rich Icon Watermarks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04] dark:opacity-[0.02] text-white dark:text-muted-foreground">
          <div className="absolute top-[10%] left-[10%] rotate-12"><Plus className="size-20" /></div>
          <div className="absolute top-[15%] right-[15%] -rotate-45"><Percent className="size-16" /></div>
          <div className="absolute bottom-[20%] left-[15%] -rotate-12"><Divide className="size-20" /></div>
          <div className="absolute bottom-[10%] right-[10%] rotate-12"><ActivityIcon className="size-24" /></div>
        </div>

        <div className="container-wide max-w-4xl relative z-10 text-hero-text text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
            Calcuva Academy
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            Expert Guides <br />
            <span className="opacity-40 italic font-medium">& Insights.</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
            We don't just provide calculators; we explain the math behind your most important life decisions. Master the logic with our 60+ research guides.
          </p>
        </div>
      </header>

      <main className="container-wide py-24 animate-fade-up">
        <div className="space-y-32">
          {groupedGuides.map((group) => (
            <section key={group.category.label}>
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3 shrink-0 font-mono">
                  <BookOpen className="size-4" />
                  {group.category.label} Series
                </h2>
                <div className="h-px flex-1 bg-border dark:bg-white/5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.guides.map((guide) => (
                  <GuideCard key={guide.slug} guide={guide} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom Callout */}
        <section className="mt-32 p-12 sm:p-20 bg-hero rounded-2xl text-hero-text text-center border border-transparent dark:border-white/5 shadow-2xl shadow-black/10 relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
             <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight">Need deep analysis?</h2>
               <p className="text-white/70 dark:text-muted-foreground text-lg mb-12 font-medium leading-relaxed">
                 Check out our research blog for data-driven insights and long-form editorial content.
               </p>
               <Link href="/blog" className="inline-flex h-14 px-10 rounded-2xl bg-white dark:bg-signal text-signal dark:text-white text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl items-center gap-2">
                  Visit Research Blog <ArrowRight className="size-4" />
               </Link>
             </div>
        </section>
      </main>
    </div>
  );
}
