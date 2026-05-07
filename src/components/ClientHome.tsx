"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Sparkles, TrendingUp, Calculator, ArrowRight, BookOpen, Plus, Minus, X, Percent, Divide, Activity, BadgeDollarSign } from "lucide-react";
import Link from "next/link";
import { CalculatorCard } from "@/components/CalculatorCard";
import { GuideCard } from "@/components/GuideCard";
import { CALCULATORS, CATEGORIES, CategoryKey } from "@/lib/calculators";
import { cn } from "@/lib/utils";

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

interface ClientHomeProps {
  guides: any[];
  posts: any[];
}

export const ClientHome = ({ guides, posts }: ClientHomeProps) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<CategoryKey | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CALCULATORS.filter((c) => {
      const matchCat = active === "all" || c.category === active;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.short.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query, active]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('home-search')?.focus();
      }
      if (e.key === 'Escape') {
        document.getElementById('home-search')?.blur();
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <main className="flex-1">
        {/* Immersive Hero Section */}
        <section className="relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden bg-hero">
          {/* Dynamic Texture Layer */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-hero" />

            {/* Advanced Mesh Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 dark:bg-indigo-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

            {/* Precision Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-[0.08] dark:opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                backgroundSize: '160px 160px'
              }}
            />
          </div>

          {/* Rich Icon Watermarks */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04] dark:opacity-[0.02] text-white dark:text-muted-foreground">
            <div className="absolute top-[2%] left-[10%] rotate-12"><Plus className="size-20 sm:size-32" /></div>
            <div className="absolute top-[5%] right-[15%] -rotate-45"><Percent className="size-16 sm:size-24" /></div>
            <div className="absolute top-[18%] right-[5%] rotate-45"><X className="size-24 sm:size-40" /></div>
            <div className="absolute top-[40%] left-[5%] -rotate-12"><Minus className="size-16" /></div>
            <div className="absolute top-[45%] right-[25%] rotate-12"><Calculator className="size-28 sm:size-44" /></div>
            <div className="absolute bottom-[15%] left-[10%] -rotate-12"><Divide className="size-20" /></div>
            <div className="absolute bottom-[10%] right-[10%] rotate-12"><Activity className="size-24" /></div>
          </div>

          <section className="w-full relative px-6 sm:px-12 lg:px-24 pt-24 sm:pt-36 pb-12 sm:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content: Text Entrance */}
            <div className="lg:w-1/2 flex flex-col items-start text-hero-text">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
                <Sparkles className="size-3" />
                Over 100+ Free Tools
              </div>

              <h1 className="text-6xl sm:text-[90px] leading-[0.9] font-bold tracking-tighter mb-10 animate-fade-up">
                Find the right <br />
                <span className="opacity-40 italic">calculator.</span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-white/70 dark:text-muted-foreground max-w-xl mb-12 animate-fade-up leading-relaxed" style={{ animationDelay: "100ms" }}>
                Find the right calculator for your daily tasks. Join thousands of people
                who use our 100+ tools for money, health, and work.
              </p>

              {/* Premium Slim Glass Search Bar */}
              <div className="relative w-full max-w-lg mt-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40">
                  <Search className="size-5 sm:size-6" />
                </div>
                <input
                  id="home-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a tool..."
                  className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 pl-14 sm:pl-16 pr-20 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl text-white font-medium shadow-2xl focus:bg-white/20 focus:ring-2 focus:ring-white/30 focus:outline-none transition-all placeholder:text-white/30"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
                  <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 font-mono text-[10px] font-medium text-white/50">
                    ⌘K
                  </div>
                </div>
              </div>

              {/* Compact Shortcuts */}
              <div className="flex flex-wrap items-center justify-start gap-2 mt-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 mr-1">Trending:</span>
                {[
                  { label: "Salary Tax", q: "salary tax" },
                  { label: "Loan EMI", q: "loan emi" },
                  { label: "Zakat", q: "zakat" },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => setQuery(tag.q)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] font-medium text-white transition-all backdrop-blur-sm"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Centerpiece: Floating Glass Dash */}
            <div className="hidden lg:flex flex-1 relative h-[500px] items-center justify-end">
              <div className="relative">
                {/* Main Centerpiece Card */}
                <div className="relative w-[420px] h-[320px] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl animate-fade-up rotate-[-4deg] flex flex-col p-8 overflow-hidden" style={{ animationDelay: "400ms" }}>
                  {/* Permanent Shimmer Effect */}


                  <div className="flex items-center gap-3 mb-10 relative z-10">
                    <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20">
                      <Calculator className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-white">Mortgage Pro</span>
                      <span className="text-[10px] text-white/60 uppercase tracking-widest font-black">Calculator Engine</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-4 relative z-10 my-4">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Principal</span>
                      <span className="text-sm font-bold text-white tabular-nums">$350,000</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Interest Rate</span>
                      <span className="text-sm font-bold text-white tabular-nums">4.5%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Loan Term</span>
                      <span className="text-sm font-bold text-white tabular-nums">30 Years</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-auto relative z-10">
                    <div className="flex flex-col">
                      <span className="text-5xl font-bold tracking-tighter text-white tabular-nums">$4,250</span>
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Estimated Monthly</span>
                    </div>
                    <div className="size-14 rounded-full bg-white text-signal flex items-center justify-center shadow-2xl shadow-white/30">
                      <TrendingUp className="size-7" />
                    </div>
                  </div>
                </div>

                {/* Detail Cards */}
                <div className="absolute -top-12 -right-8 w-48 p-4 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-xl animate-fade-up rotate-[8deg] overflow-hidden" style={{ animationDelay: "600ms" }}>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-white/70" />
                      <span className="text-xs font-bold text-white">Health Metric</span>
                    </div>
                    <div className="mt-2 text-xl font-bold tracking-tighter text-white tabular-nums">24.5 BMI</div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -left-12 w-48 p-4 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-xl animate-fade-up rotate-[-12deg] overflow-hidden" style={{ animationDelay: "800ms" }}>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign className="size-4 text-white/70" />
                      <span className="text-xs font-bold text-white">Tax Savings</span>
                    </div>
                    <div className="mt-2 text-xl font-bold tracking-tighter text-white tabular-nums">$1,240.00</div>
                  </div>
                </div>
              </div>

              {/* Subtle glow */}
              <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full -z-10" />
            </div>
          </section>
        </section>
      </main>

      {/* Popular Tools with Color Accents */}
      {active === "all" && !query && (
        <section className="container-wide py-16 animate-fade-up border-b border-border/50">
          <div className="flex items-center gap-2 mb-8 text-signal">
            <TrendingUp className="size-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Popular Tools</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {["salary-income-tax-calculator-2026", "university-merit-aggregate-calculator", "calorie-deficit-calculator", "compound-interest-calculator"].map(slug => {
              const c = CALCULATORS.find(c => c.slug === slug);
              return c ? <CalculatorCard key={c.slug} calc={c} /> : null;
            })}
          </div>
        </section>
      )}      {/* Categories overview - Elite Dark Style */}
      {!query && active === "all" && (
        <section className="container-wide py-24 border-b border-border/50 bg-background">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Browse by Category</h2>
              <p className="text-lg text-muted-foreground mt-2 font-medium">Explore over 100 tools organized by topic.</p>
            </div>
            <Link href="/categories" className="text-[10px] font-black uppercase tracking-[0.2em] text-signal hover:underline flex items-center gap-2">
              View All Categories <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {(Object.keys(CATEGORIES) as CategoryKey[]).slice(0, 6).map((key) => {
              const cat = CATEGORIES[key];
              const count = CALCULATORS.filter((c) => c.category === key).length;
              return (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className={cn(
                    "bg-surface border border-border dark:border-white/5 rounded-2xl p-8 flex flex-col gap-6 group/cat-mini transition-all hover:border-signal/50 hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative",
                  )}
                >

                  <div className={cn("size-14 rounded-2xl flex items-center justify-center font-mono font-bold text-base shadow-sm group-hover/cat-mini:scale-110 transition-all relative z-10", categoryStyles[key])}>
                    {cat.code}
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg group-hover/cat-mini:text-signal transition-colors">{cat.label}</h3>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 font-black uppercase tracking-widest">{count} tools</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Category filter - High Contrast Navigation */}
      <section className="w-full relative py-12 bg-secondary/30 dark:bg-white/5 border-y border-border/50 overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-signal/5 blur-[100px] pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex p-1.5 bg-surface/50 backdrop-blur-xl border border-border/50 dark:border-white/5 rounded-2xl shadow-sm">
              {(['all', ...Object.keys(CATEGORIES)] as (CategoryKey | "all")[]).map((key) => {
                const label = key === 'all' ? "All Tools" : CATEGORIES[key].label;
                const isActive = active === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={cn(
                      "px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                      isActive
                        ? "bg-signal text-white shadow-xl shadow-signal/20 scale-105 z-10"
                        : "text-muted-foreground hover:text-signal hover:bg-white/80 dark:hover:bg-white/10"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section - Solid Contrast */}
      <section className="container-wide pt-24 pb-24 bg-background">
        <div className="flex items-baseline justify-between mb-8 border-b-2 border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-signal" />
            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.2em]">
              {active === "all" ? (query ? "Search Results" : "Top Tools") : `${CATEGORIES[active as CategoryKey].label} Tools`}
            </h2>
          </div>
          <span className="font-mono text-xs font-bold text-muted-foreground">{filtered.length} Tools</span>
        </div>

        {filtered.length === 0 ? (
          <div className="surface-card p-12 text-center text-muted-foreground">
            No calculators match “{query}”. Try a different keyword.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {(active === "all" && !query ? filtered.slice(0, 24) : filtered).map((calc) => (
                <CalculatorCard key={calc.slug} calc={calc} />
              ))}
            </div>

            {/* View All Button for Home Page - High Impact */}
            {active === "all" && !query && filtered.length > 24 && (
              <div className="mt-16 flex justify-center">
                <Link
                  href="/categories"
                  className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-signal text-white font-bold shadow-xl shadow-signal/20 hover:scale-105 hover:shadow-2xl transition-all group"
                >
                  View All {filtered.length} Tools
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* How-to Guides - Solid Contrast */}
      {!query && active === "all" && guides.length > 0 && (
        <section className="container-wide pt-20 pb-16 border-t border-border/50 bg-background">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-signal mb-2">
                <BookOpen className="size-4" />
                <span className="text-xs font-black uppercase tracking-widest">Library</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Helpful Guides</h2>
              <p className="text-muted-foreground mt-2">Learn how to use our tools effectively.</p>
            </div>
            <Link href="/guides" className="text-xs font-bold uppercase tracking-widest text-signal hover:underline">
              See All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.slice(0, 3).map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {/* Blog Section - Solid Contrast */}
      {!query && active === "all" && posts.length > 0 && (
        <section className="bg-secondary/20 border-t-2 border-border py-24">
          <div className="container-wide">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">From Our Blog</h2>
                <p className="text-muted-foreground mt-2 font-medium">Simple explanations for complex math.</p>
              </div>
              <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-signal hover:underline flex items-center gap-2">
                Read All Posts <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-background rounded-2xl p-2 border border-border/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="aspect-[16/10] rounded-2xl bg-secondary/50 mb-5 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                      <span className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                        Read Full Article <ArrowRight className="size-3" />
                      </span>
                    </div>
                    <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                      <Calculator className="size-20" />
                    </div>
                  </div>
                  <div className="px-4 pb-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-signal mb-3">{post.category || "Insight"}</div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-signal transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="mt-5 flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase font-bold tracking-wider">
                      <span>{post.date}</span>
                      <span className="size-1 rounded-full bg-border" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
