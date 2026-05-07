"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator, Search, TrendingUp, FileText, Sparkles, PiggyBank, Coins, Percent, Flame, Home, Heart, Banknote, Receipt,
  ArrowLeftRight, ReceiptSwissFranc, TrendingDown, Lock, Car, Activity,
  Weight, Utensils, Timer, Beer, Cigarette, Baby, Droplet, Target, CreditCard, CalendarPlus, CalendarCheck, Ruler, FileType,
  GraduationCap, Dumbbell, BadgeDollarSign, QrCode, BadgeCheck, Droplets, Calendar, Briefcase,
  Leaf, Sun, Wallet, Zap, Battery, Grid3X3, Share, Moon, Landmark, Globe, Smartphone,
  Beef, Stethoscope, Microscope, Brain, Plane, Shield, MapPin,
  Plus, Minus, X, Check, CheckCircle2, Share2, Download, Printer,
  FileCode, Dna, Waves, HeartPulse, LineChart, BarChart3, Gauge, Clock, History,
  Bike, Snowflake, Footprints, Anchor, ArrowUpCircle, Navigation, Train,
  Hash, BookOpen, LayoutGrid, Keyboard, Wifi, Contact2, MessageSquare
} from "lucide-react";

import { CALCULATORS, CategoryKey, CATEGORIES } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

const ICONS: Record<string, any> = {
  Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet, Calendar, Ruler,
  GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound: Calculator, Briefcase, FileType,
  PiggyBank, Weight, Utensils, Coins, Banknote, Timer, Target, CalendarPlus,
  Calculator, Car, Flame, Beer, Cigarette, Percent, Heart, ArrowLeftRight, Lock,
  ActivitySquare: Activity, CreditCard, CalendarCheck, Dumbbell, BadgeDollarSign,
  QrCode, BadgeCheck, Droplets, Leaf, Sun, Wallet, Zap, Battery, Grid3X3, Share,
  "trending-up": TrendingUp, "trending-down": TrendingDown, "scale": Ruler,
  "calculator": Calculator, "activity": Activity, "award": BadgeCheck,
  "alert-circle": Target, "banknote": Banknote, "heart": Heart, "baby": Baby,
  "zap": Zap, "droplets": Droplets, "beef": Beef, "pie-chart": Grid3X3,
  "timer": Timer, "clock": Timer, "stethoscope": Activity, "microscope": Activity,
  "brain": Brain, "briefcase": Briefcase, "graduation-cap": GraduationCap,
  "plane": Plane, "car": Car, "home": Home, "shopping-cart": Calculator,
  "user": Calculator, "users": Calculator, "settings": Calculator, "shield": Lock,
  "fast-forward": Zap, "utensils": Utensils, "calendar": Calendar, "map-pin": MapPin,
  "dna": Dna, "waves": Waves, "heart-pulse": HeartPulse, "dumbbell": Dumbbell,
  "apple": Utensils, "line-chart": LineChart, "bar-chart": BarChart3,
  "gauge": Gauge, "moon": Moon, "sun": Sun, "globe": Globe, "history": History,
  "book-open": BookOpen, "target": Target, "file-text": FileText,
  "bike": Bike, "snowflake": Snowflake, "footprints": Footprints,
  "anchor": Anchor, "arrow-up-circle": ArrowUpCircle, "navigation": Navigation, "train": Train,
  "hash": Hash, "layout-grid": LayoutGrid, "keyboard": Keyboard, "grid-3x3": Grid3X3,
  FileText, Moon, Beef, Stethoscope, Microscope, Brain, Plane, Shield, MapPin,
  Search, Plus, Minus, X, Check, CheckCircle2, Share2, Download, Printer,
  FileCode, Dna, Waves, HeartPulse, LineChart, BarChart3, Gauge, Clock, History, Globe, Smartphone,
  Navigation, Train, Bike, Snowflake, Footprints, Anchor, ArrowUpCircle, Hash, BookOpen, LayoutGrid, Keyboard, Wifi, Contact2, MessageSquare
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

export function GlobalSearch({ variant = "default" }: { variant?: "default" | "glass" }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all ring-1 md:w-28 lg:w-40",
          variant === "glass" 
            ? "bg-white/10 text-white hover:bg-white/20 ring-white/20" 
            : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/60 ring-border/20"
        )}
      >
        <Search className="size-3" />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline-block">Search...</span>
        <kbd className={cn(
          "pointer-events-none ml-auto hidden h-4 select-none items-center gap-1 rounded px-1 font-mono text-[9px] font-medium lg:flex",
          variant === "glass" ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
        )}>
          K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for calculators, guides, or categories..." />
        <CommandList className="max-h-[450px]">
          <CommandEmpty>No results found.</CommandEmpty>


          <CommandSeparator />

          <CommandGroup heading="Popular Tools">
            {CALCULATORS.slice(0, 4).map((t) => (
              <CommandItem
                key={`popular-${t.slug}`}
                value={`popular-${t.slug}-${t.title}`}
                onSelect={() => runCommand(() => router.push(`/calculators/${t.slug}`))}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", categoryStyles[t.category as CategoryKey])}>
                  {(() => {
                    const ToolIcon = ICONS[t.icon] || Calculator;
                    return <ToolIcon className="size-4" />;
                  })()}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground group-data-[selected=true]:text-accent-foreground/70 uppercase font-black tracking-tighter">{t.category}</span>
                </div>
                <Badge variant="secondary" className="text-[9px] font-black uppercase bg-primary/5 text-primary border-primary/10">Tool</Badge>
              </CommandItem>
            ))}
          </CommandGroup>


          <CommandSeparator />

          <CommandGroup heading="All Calculators">
            {CALCULATORS.map((t) => (
              <CommandItem
                key={`all-${t.slug}`}
                value={`all-${t.slug}-${t.title}`}
                onSelect={() => runCommand(() => router.push(`/calculators/${t.slug}`))}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", categoryStyles[t.category as CategoryKey])}>
                  {(() => {
                    const ToolIcon = ICONS[t.icon] || Calculator;
                    return <ToolIcon className="size-4" />;
                  })()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground group-data-[selected=true]:text-accent-foreground/70 line-clamp-1">{t.short}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => runCommand(() => router.push('/blog'))} className="gap-3 p-3">
              <FileText className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold">Expert Strategy Blog</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/guides'))} className="gap-3 p-3">
              <Sparkles className="size-4 text-muted-foreground" />
              <span className="text-xs font-bold">Comprehensive Guides</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
