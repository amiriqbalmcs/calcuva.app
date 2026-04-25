"use client";

import Link from "next/link";
import { 
  ChevronRight, Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet, 
  Calendar, Ruler, GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound, 
  Briefcase, FileType, PiggyBank, Weight, Utensils, Coins, Banknote, Timer, 
  Target, CalendarPlus, Calculator, Car, Flame, Beer, Cigarette, Percent
} from "lucide-react";
import { CalcMeta, CATEGORIES } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = {
  Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet, Calendar, Ruler, 
  GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound, Briefcase, FileType,
  PiggyBank, Weight, Utensils, Coins, Banknote, Timer, Target, CalendarPlus, 
  Calculator, Car, Flame, Beer, Cigarette, Percent
};

const categoryStyles: Record<CalcMeta["category"], string> = {
  finance: "bg-finance-soft text-finance",
  health: "bg-health-soft text-health",
  education: "bg-education-soft text-education",
  utility: "bg-utility-soft text-utility",
  business: "bg-business-soft text-business",
};

export const CalculatorCard = ({ calc }: { calc: CalcMeta }) => {
  const Icon = ICONS[calc.icon] || Landmark;
  const cat = CATEGORIES[calc.category];
  return (
    <Link
      href={`/calculators/${calc.slug}`}
      className="surface-card surface-card-hover p-5 sm:p-6 flex flex-col gap-4 group"
    >
      <div className="flex items-start justify-between">
        <div className={cn("size-11 rounded-lg flex items-center justify-center", categoryStyles[calc.category])}>
          <Icon className="size-5" />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{cat.code}</span>
      </div>
      <div>
        <h3 className="text-base font-semibold leading-snug mb-1.5">{calc.title.replace(/ Calculator$/, "")}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{calc.short}</p>
      </div>
      <div className="mt-auto flex items-center text-xs font-medium text-signal opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool <ChevronRight className="size-3 ml-1" />
      </div>
    </Link>
  );
};
