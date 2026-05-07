"use client";

import { CATEGORIES, CALCULATORS, CategoryKey } from "@/lib/calculators";
import Link from "next/link";
import { ArrowRight, Plus, Percent, Divide, Activity as ActivityIcon, ChevronRight, Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet, GraduationCap, Briefcase, FileType, PiggyBank, Utensils, Coins, Banknote, Calculator, Car, Percent as PercentIcon, Heart, Shield, Zap, BadgeCheck, Leaf, Sun, Wallet, Battery, Grid3X3, BookOpen, LayoutGrid, ActivitySquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Seo } from "@/components/Seo";

const ICONS: Record<string, any> = {
  finance: Landmark,
  health: Activity,
  education: GraduationCap,
  utility: Calculator,
  business: Briefcase,
  sustainability: Leaf,
  benchmarks: BadgeCheck,
  tax: Receipt,
  productivity: Zap,
  travel: Home,
  lifestyle: Heart,
};

const categoryStyles: Record<CategoryKey, string> = {
  finance: "bg-finance-soft text-finance dark:bg-finance/20 dark:text-finance",
  health: "bg-health-soft text-health dark:bg-health/20 dark:text-health",
  education: "bg-education-soft text-education dark:bg-education/20 dark:text-education",
  utility: "bg-utility-soft text-utility dark:bg-utility/20 dark:text-utility",
  business: "bg-business-soft text-business dark:bg-business/20 dark:text-business",
  sustainability: "bg-sustainability-soft text-sustainability dark:bg-sustainability/20 dark:text-sustainability",
  benchmarks: "bg-benchmarks-soft text-benchmarks dark:bg-benchmarks/20 dark:text-benchmarks",
  tax: "bg-tax-soft text-tax dark:bg-tax/20 dark:text-tax",
  productivity: "bg-productivity-soft text-productivity dark:bg-productivity/20 dark:text-productivity",
  travel: "bg-travel-soft text-travel dark:bg-travel/20 dark:text-travel",
  lifestyle: "bg-lifestyle-soft text-lifestyle dark:bg-lifestyle/20 dark:text-lifestyle",
};

export default function CategoriesPage() {
  return (
    <div className="bg-background min-h-screen">
      <Seo 
        title="All Categories — Precision Tools"
        description="Browse our complete collection of 100+ calculators organized by industry and utility."
        canonicalPath="/categories"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
            Global Index
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            Tool <br />
            <span className="opacity-40 italic font-medium">Categories.</span>
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
            Every calculation starts with a category. Find the exact logic engine you need across our 11 core industries.
          </p>
        </div>
      </header>

      <main className="container-wide py-24 animate-fade-up">
        <div className="space-y-16">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
            const cat = CATEGORIES[key];
            const count = CALCULATORS.filter((c) => c.category === key).length;
            const topTools = CALCULATORS.filter((c) => c.category === key).slice(0, 6);
            const Icon = ICONS[key] || Landmark;
            
            return (
              <div
                key={key}
                className="group flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch"
              >
                {/* Left Side: Category Card - Enhanced Style */}
                <Link
                  href={`/category/${key}`}
                  className={cn(
                    "lg:w-[400px] shrink-0 bg-surface border border-border dark:border-white/5 rounded-2xl p-10 flex flex-col justify-between relative overflow-hidden transition-all duration-500 hover:border-signal/50 hover:shadow-2xl hover:-translate-y-1 group/cat",
                  )}
                >
                   {/* Precision Inner Pattern */}
                  <div 
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                    style={{ 
                      backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                      backgroundSize: '20px 20px' 
                    }} 
                  />

                  {/* Subtle Permanent Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className={cn(
                      "size-16 rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover/cat:scale-110 transition-transform border border-black/5 dark:border-white/10",
                      categoryStyles[key]
                    )}>
                      <Icon className="size-8" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-4 group-hover/cat:text-signal transition-colors">{cat.label}</h2>
                    <p className="text-base text-muted-foreground font-medium leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center justify-between relative z-10">
                    <span className="font-mono text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] bg-secondary/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-border/50">
                      {count} Tools
                    </span>
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-signal group-hover/cat:translate-x-1 transition-all">
                      Browse All <ArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Large Background Icon */}
                  <Icon className="absolute -right-8 -top-8 size-48 opacity-[0.02] dark:opacity-[0.04] -rotate-12 transition-transform duration-700 group-hover/cat:scale-110 group-hover/cat:rotate-0" />
                </Link>

                {/* Right Side: Tool Grid - High Fidelity Cards */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/calculators/${tool.slug}`}
                      className="group/tool bg-surface border border-border dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between transition-all duration-500 hover:border-signal/40 hover:bg-secondary/10 hover:-translate-y-1 relative overflow-hidden shadow-sm"
                    >
                      {/* Dotted pattern for sub-cards */}
                      <div 
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none" 
                        style={{ 
                          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                          backgroundSize: '12px 12px' 
                        }} 
                      />
                      
                      <div className="relative z-10">
                        <h3 className="text-sm font-bold text-foreground group-hover/tool:text-signal transition-colors line-clamp-1 mb-2">{tool.title.replace(/ Calculator$/, "")}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 font-medium leading-relaxed">{tool.short}</p>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between relative z-10">
                        <div className="size-1.5 rounded-full bg-signal/40 group-hover/tool:bg-signal transition-colors" />
                        <ChevronRight className="size-3.5 text-muted-foreground/30 group-hover/tool:text-signal group-hover/tool:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
