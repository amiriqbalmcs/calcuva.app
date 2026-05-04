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
  finance: "bg-finance-soft text-finance border-finance/10",
  health: "bg-health-soft text-health border-health/10",
  education: "bg-education-soft text-education border-education/10",
  utility: "bg-utility-soft text-utility border-utility/10",
  business: "bg-business-soft text-business border-business/10",
  sustainability: "bg-emerald-50 text-emerald-600 border-emerald-500/10",
  benchmarks: "bg-purple-50 text-purple-600 border-purple-500/10",
};

export const GuideCard = ({ guide }: GuideCardProps) => {
  const cat = CATEGORIES[guide.category as CategoryKey] || CATEGORIES.utility;
  
  return (
    <Link
      href={`/calculators/${guide.slug}`}
      className="surface-card p-6 flex flex-col gap-4 group transition-all hover:bg-secondary/10"
    >
      <div className="flex items-center justify-between">
        <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", categoryStyles[guide.category as CategoryKey])}>
          {cat.label}
        </div>
        {guide.readingTime && (
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            <Clock className="size-3" />
            {guide.readingTime}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-bold leading-tight group-hover:text-signal transition-colors mb-2">
          {guide.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {guide.excerpt || "Explore our expert strategy guide on the mathematical foundations and professional insights for this tool."}
        </p>
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50 group/btn">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <BookOpen className="size-3" />
          <span>Expert Strategy</span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground group-hover:text-signal group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};
