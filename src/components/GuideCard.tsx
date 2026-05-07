"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, CategoryKey } from "@/lib/calculators";

interface GuideCardProps {
  guide: {
    slug: string;
    title: string;
    excerpt?: string;
    category: string;
    readingTime?: string;
  };
}

const categoryStyles: Record<CategoryKey, string> = {
  finance: "bg-finance-soft text-finance border-finance/10 dark:bg-finance/20 dark:text-finance",
  health: "bg-health-soft text-health border-health/10 dark:bg-health/20 dark:text-health",
  education: "bg-education-soft text-education border-education/10 dark:bg-education/20 dark:text-education",
  utility: "bg-utility-soft text-utility border-utility/10 dark:bg-utility/20 dark:text-utility",
  business: "bg-business-soft text-business border-business/10 dark:bg-business/20 dark:text-business",
  sustainability: "bg-emerald-50 text-emerald-600 border-emerald-500/10 dark:bg-emerald-500/20 dark:text-emerald-500",
  benchmarks: "bg-purple-50 text-purple-600 border-purple-500/10 dark:bg-purple-500/20 dark:text-purple-500",
  tax: "bg-tax-soft text-tax border-tax/10 dark:bg-tax/20 dark:text-tax",
  productivity: "bg-productivity-soft text-productivity border-productivity/10 dark:bg-productivity/20 dark:text-productivity",
  travel: "bg-travel-soft text-travel border-travel/10 dark:bg-travel/20 dark:text-travel",
  lifestyle: "bg-lifestyle-soft text-lifestyle border-lifestyle/10 dark:bg-lifestyle/20 dark:text-lifestyle",
};

export const GuideCard = ({ guide }: GuideCardProps) => {
  const cat = CATEGORIES[guide.category as CategoryKey] || CATEGORIES.utility;
  
  return (
    <Link
      href={`/calculators/${guide.slug}`}
      className="group relative bg-surface border border-border dark:border-white/5 rounded-2xl p-8 flex flex-col gap-6 transition-all duration-500 hover:border-signal/50 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-border dark:border-white/10", categoryStyles[guide.category as CategoryKey])}>
          {cat.label}
        </div>
        {guide.readingTime && (
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] font-mono">
            <Clock className="size-3.5" />
            {guide.readingTime}
          </div>
        )}
      </div>
      
      <div className="space-y-4 relative z-10">
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-signal transition-colors leading-tight">
          {guide.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-medium">
          {guide.excerpt || "Explore our expert strategy guide on the mathematical foundations and professional insights for this tool."}
        </p>
      </div>

      <div className="mt-auto pt-8 flex items-center justify-between border-t border-border dark:border-white/5 relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 font-mono group-hover:text-signal transition-colors">
          <BookOpen className="size-4 opacity-40" />
          <span>Full Strategy Guide</span>
        </div>
        <div className="size-9 rounded-xl bg-secondary dark:bg-zinc-900 flex items-center justify-center group-hover:bg-signal transition-all shadow-sm">
          <ArrowRight className="size-4 text-muted-foreground group-hover:text-white transition-all" />
        </div>
      </div>
    </Link>
  );
};
