"use client";

import Link from "next/link";
import {
  ChevronRight, Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet,
  Calendar, Ruler, GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound,
  Briefcase, FileType, PiggyBank, Weight, Utensils, Coins, Banknote, Timer,
  Target, CalendarPlus, Calculator, Car, Flame, Beer, Cigarette, Percent,
  Heart, ArrowLeftRight, Lock, Activity as ActivityIcon, CreditCard, CalendarCheck,
  Dumbbell, BadgeDollarSign, QrCode, BadgeCheck, Droplets, Leaf, Sun, Wallet,
  Zap, Battery, Grid3X3, Share, FileText, Moon, ShoppingCart, Settings,
  Beef, Stethoscope, Microscope, Brain, Plane, Shield, MapPin, Search,
  Plus, Minus, X, Check, CheckCircle2, Share2, Download, Printer, FileCode,
  Dna, Waves, HeartPulse, LineChart, BarChart3, Gauge, Clock, History, Globe, Smartphone,
  Bike, Snowflake, Footprints, Anchor, ArrowUpCircle, Navigation, Train,
  Hash, BookOpen, LayoutGrid, Keyboard, Wifi, Contact2, MessageSquare
} from "lucide-react";
import { CalcMeta, CATEGORIES } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = {
  Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet, Calendar, Ruler,
  GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound, Briefcase, FileType,
  PiggyBank, Weight, Utensils, Coins, Banknote, Timer, Target, CalendarPlus,
  Calculator, Car, Flame, Beer, Cigarette, Percent, Heart, ArrowLeftRight, Lock,
  ActivitySquare: ActivityIcon, CreditCard, CalendarCheck, Dumbbell, BadgeDollarSign,
  QrCode, BadgeCheck, Droplets, Leaf, Sun, Wallet, Zap, Battery, Grid3X3, Share,
  "trending-up": TrendingUp, "trending-down": TrendingDown, "scale": Ruler,
  "calculator": Calculator, "activity": Activity, "award": BadgeCheck,
  "alert-circle": Target, "banknote": Banknote, "heart": Heart, "baby": Baby,
  "zap": Zap, "droplets": Droplets, "beef": Beef, "pie-chart": Grid3X3,
  "timer": Timer, "clock": Timer, "stethoscope": Activity, "microscope": Activity,
  "brain": Brain, "briefcase": Briefcase, "graduation-cap": GraduationCap,
  "plane": Plane, "car": Car, "home": Home, "shopping-cart": ShoppingCart,
  "user": UserRound, "users": UserRound, "settings": Settings, "shield": Lock,
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

const categoryStyles: Record<CalcMeta["category"], string> = {
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

export const CalculatorCard = ({ calc }: { calc: CalcMeta }) => {
  const Icon = ICONS[calc.icon] || Landmark;
  const cat = CATEGORIES[calc.category];
  return (
    <Link
      href={`/calculators/${calc.slug}`}
      className="group relative bg-surface backdrop-blur-2xl border border-border dark:border-white/5 rounded-2xl p-6 transition-all duration-500 hover:border-signal/50 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] flex flex-col h-full overflow-hidden"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-signal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Precision Inner Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '16px 16px'
        }}
      />

      {/* Subtle Permanent Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={cn("size-11 rounded-2xl flex items-center justify-center transition-all shadow-sm group-hover:scale-110 group-hover:shadow-md border border-black/5 dark:border-white/10", categoryStyles[calc.category])}>
          <Icon className="size-5.5" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="px-2.5 py-1 rounded-lg bg-secondary/80 dark:bg-white/10 border border-border/80 text-[8px] font-black uppercase tracking-[0.15em] text-foreground/70 font-mono transition-all group-hover:bg-signal/10 group-hover:text-signal group-hover:border-signal/20">
            {cat.label}
          </div>
          <div className="text-[7px] font-bold text-muted-foreground/50 uppercase tracking-widest font-mono group-hover:text-signal/60 transition-colors">SEC-TOOL-{cat.code}</div>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-signal transition-colors line-clamp-1 leading-tight">{calc.title.replace(/ Calculator$/, "")}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-medium">{calc.short}</p>
      </div>

      <div className="mt-auto pt-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="size-1.5 rounded-full bg-signal animate-pulse group-hover:animate-none transition-colors" />
          <div className="flex flex-col">
            <span className="font-mono text-[8px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] group-hover:text-muted-foreground transition-colors leading-none">{cat.code}</span>
          </div>
        </div>
        <div className="size-9 rounded-xl bg-secondary dark:bg-white/10 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-signal group-hover:border-signal group-hover:translate-x-1 transition-all shadow-lg shadow-signal/20">
          <ChevronRight className="size-5 text-white" />
        </div>
      </div>
    </Link>
  );
};
