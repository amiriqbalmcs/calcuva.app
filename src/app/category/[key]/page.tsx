import { CATEGORIES, CALCULATORS, CategoryKey } from "@/lib/calculators";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Plus, Percent, Divide, Activity as ActivityIcon, ArrowRight } from "lucide-react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Seo } from "@/components/Seo";
import type { Metadata } from "next";

const BASE_URL = "https://calcuva.app";

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((key) => ({
    key,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  if (!(key in CATEGORIES)) return {};
  const cat = CATEGORIES[key as CategoryKey];
  const items = CALCULATORS.filter(c => c.category === key);
  const title = `${cat.label} Calculators — Free Online Tools | Calcuva`;
  const description = `${cat.description} Browse ${items.length} free, instant ${cat.label.toLowerCase()} calculators on Calcuva.`;
  const url = `${BASE_URL}/category/${key}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Calcuva",
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${BASE_URL}/og-image.png`] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  
  if (!(key in CATEGORIES)) {
    notFound();
  }

  const catKey = key as CategoryKey;
  const cat = CATEGORIES[catKey];
  const items = CALCULATORS.filter((c) => c.category === catKey);

  return (
    <div className="bg-background min-h-screen">
      <Seo
        title={`${cat.label} Calculators — Calcuva`}
        description={`${cat.description} Browse ${items.length} free, instant ${cat.label.toLowerCase()} calculators on Calcuva.`}
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
          <div className="absolute top-[10%] left-[10%] rotate-12"><Plus className="size-20 sm:size-32" /></div>
          <div className="absolute top-[15%] right-[15%] -rotate-45"><Percent className="size-16 sm:size-24" /></div>
          <div className="absolute bottom-[20%] left-[15%] -rotate-12"><Divide className="size-20 sm:size-28" /></div>
          <div className="absolute bottom-[10%] right-[10%] rotate-12"><ActivityIcon className="size-24 sm:size-36" /></div>
        </div>

        <div className="container-wide max-w-5xl relative z-10 text-hero-text text-center">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-[10px] text-white/40 font-mono uppercase font-black tracking-[0.3em] mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="size-3 opacity-30" />
            <span className="text-white">Categories</span>
          </nav>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
            Browsing Category
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            {cat.label} <br />
            <span className="opacity-40 italic font-medium">Tools & Analytics</span>
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
            {cat.description} Explore our suite of precision {cat.label.toLowerCase()} calculators.
          </p>
        </div>
      </header>

      <main className="container-wide py-24 animate-fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((calc) => (
            <CalculatorCard key={calc.slug} calc={calc} />
          ))}
        </div>
      </main>
    </div>
  );
}
