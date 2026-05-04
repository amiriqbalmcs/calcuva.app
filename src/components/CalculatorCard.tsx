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
  Hash, BookOpen, LayoutGrid, Keyboard
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
  Navigation, Train, Bike, Snowflake, Footprints, Anchor, ArrowUpCircle, Hash, BookOpen, LayoutGrid, Keyboard
};

const categoryStyles: Record<CalcMeta["category"], string> = {
  finance: "bg-finance-soft text-finance dark:bg-finance/20 dark:text-finance",
  health: "bg-health-soft text-health dark:bg-health/20 dark:text-health",
  education: "bg-education-soft text-education dark:bg-education/20 dark:text-education",
  utility: "bg-utility-soft text-utility dark:bg-utility/20 dark:text-utility",
  business: "bg-business-soft text-business dark:bg-business/20 dark:text-business",
  sustainability: "bg-sustainability-soft text-sustainability dark:bg-sustainability/20 dark:text-sustainability",
  benchmarks: "bg-benchmarks-soft text-benchmarks dark:bg-benchmarks/20 dark:text-benchmarks",
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
