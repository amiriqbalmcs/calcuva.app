"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Sparkles, TrendingUp, Calculator, ArrowRight } from "lucide-react";
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
  sustainability: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
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
      {/* Hero Section with Premium Pattern */}
      <div className="relative overflow-hidden border-border bg-gradient-to-b from-background to-secondary/20">
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 0H0V32' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 3'/%3E%3C/svg%3E")`,
          }}
        />
        <section className="container-wide relative pt-16 sm:pt-28 pb-16 sm:pb-24">
          <div className="flex items-center gap-2 mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground animate-fade-up">
            <Sparkles className="size-3.5 text-signal" />
            <span>70+ Smart Online Tools</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter max-w-[20ch] animate-fade-up">
            Calculate anything in{" "}
            <span className="text-signal">seconds.</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
            Fast, free, and incredibly precise tools for your daily math.
            From finance to health, get the results you need instantly.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mt-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="home-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools... (Press ⌘K to focus)"
              className="w-full bg-background border border-border pl-11 pr-20 py-4 rounded-2xl text-base shadow-xl focus:ring-4 focus:ring-signal/10 focus:border-signal/40 focus:outline-none transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{filtered.length} found</span>
            </div>
          </div>
        </section>
      </div>

      {/* Trending Section */}
      {active === "all" && !query && (
        <section className="container-wide py-12 animate-fade-up border-b border-border/50">
          <div className="flex items-center gap-2 mb-6 text-signal">
            <TrendingUp className="size-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Trending Now</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {["salary-income-tax-calculator-2026", "university-merit-aggregate-calculator", "calorie-deficit-calculator", "compound-interest-calculator"].map(slug => {
              const c = CALCULATORS.find(c => c.slug === slug);
              return c ? <CalculatorCard key={c.slug} calc={c} /> : null;
            })}
          </div>
        </section>
      )}

      {/* Category filter */}
      <section className="container-wide py-12 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {(["all", ...Object.keys(CATEGORIES)] as const).map((key) => {
            const label = key === "all" ? "All Tools" : CATEGORIES[key as CategoryKey].label;
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => setActive(key as CategoryKey | "all")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="container-wide pb-20">
        <div className="flex items-baseline justify-between mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-signal animate-pulse" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {active === "all" ? "Complete Toolkit" : `${CATEGORIES[active as CategoryKey].label} Suite`}
            </h2>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground uppercase">{filtered.length} Power Tools</span>
        </div>

        {filtered.length === 0 ? (
          <div className="surface-card p-12 text-center text-muted-foreground">
            No calculators match “{query}”. Try a different keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((calc) => (
              <CalculatorCard key={calc.slug} calc={calc} />
            ))}
          </div>
        )}
      </section>

      {/* Categories overview */}
      <section className="container-wide pb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Specialized Domains</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
            const cat = CATEGORIES[key];
            const count = CALCULATORS.filter((c) => c.category === key).length;
            return (
              <Link
                key={key}
                href={`/category/${key}`}
                className="surface-card surface-card-hover p-6 flex flex-col gap-3"
              >
                <div className={cn("size-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm", categoryStyles[key])}>
                  {cat.code}
                </div>
                <div>
                  <h3 className="font-semibold text-base">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                </div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-auto">{count} modules →</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Expert Insights - Authoritative Section at Bottom */}
      {!query && active === "all" && guides.length > 0 && (
        <section className="container-wide pt-16 pb-12 border-t border-border/50">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-signal mb-1">
                <TrendingUp className="size-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Knowledge Hub</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Expert Strategy Insights</h2>
            </div>
            <Link href="/guides" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-signal transition-colors">
              Explore Library →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.slice(0, 3).map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>
      )}

      {/* Blog / Editorial Section with high contrast background */}
      {!query && active === "all" && posts.length > 0 && (
        <section className="bg-secondary/30 border-t border-border py-20 mt-12">
          <div className="container-wide">
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Editorial Columns</h2>
                <p className="text-muted-foreground mt-2">Deep dives into the math of daily life.</p>
              </div>
              <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-signal transition-colors flex items-center gap-2">
                Read All Posts <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-background rounded-3xl p-2 border border-border/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
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
