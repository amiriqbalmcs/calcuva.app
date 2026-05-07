"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight, Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet,
  Calendar, Ruler, GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound,
  Briefcase, FileType, PiggyBank, Weight, Utensils, Coins, Banknote, Timer,
  Target, CalendarPlus, Calculator, Car, Flame, Beer, Cigarette, Percent,
  Heart, ArrowLeftRight, Lock, Activity as ActivityIcon, CreditCard, CalendarCheck,
  Dumbbell, BadgeDollarSign, QrCode, BadgeCheck, Droplets, Leaf, Sun, Wallet,
  Zap, Battery, Grid3X3, Share, Moon, Globe, History, BookOpen, FileText,
  HelpCircle, Apple, Zap as ZapIcon, Beef, PieChart, Clock, Stethoscope, Microscope,
  Brain, Plane, ShoppingCart, User, Users, Settings, Shield, MapPin, Search,
  Plus, Minus, X, Check, CheckCircle2, Share2, Download, Printer, FileCode,
  Dna, Waves, HeartPulse, LineChart, BarChart3, Gauge, Bike, Snowflake, Footprints,
  Anchor, ArrowUpCircle, Navigation, Train, Divide
} from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Seo } from "./Seo";
import { CalcMeta, CATEGORIES, CALCULATORS } from "@/lib/calculators";
import { EmbedDialog } from "./EmbedDialog";
import { cn } from "@/lib/utils";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCurrency } from "@/context/CurrencyContext";
import { ExportButton } from "./ExportButton";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { SITE_URL } from "@/lib/constants";

const ICONS: Record<string, any> = {
  Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet, Calendar, Ruler,
  GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound, Briefcase, FileType,
  PiggyBank, Weight, Utensils, Coins, Banknote, Timer, Target, CalendarPlus,
  Calculator, Car, Flame, Beer, Cigarette, Percent, Heart, ArrowLeftRight, Lock,
  ActivitySquare: ActivityIcon, CreditCard, CalendarCheck, Dumbbell, BadgeDollarSign,
  QrCode, BadgeCheck, Droplets, Leaf, Sun, Wallet, Zap, Battery, Grid3X3, Share,
  Moon, Globe, History, "book-open": BookOpen, "file-text": FileText, "help-circle": HelpCircle,
  Apple, ZapIcon, Beef, PieChart, Clock, Stethoscope, Microscope, Brain, Plane,
  ShoppingCart, User, Users, Settings, Shield, MapPin, Search, Plus, Minus, X, Check,
  CheckCircle2, Share2, Download, Printer, FileCode, Dna, Waves, HeartPulse,
  Navigation, Train, Bike, Snowflake, Footprints, Anchor, ArrowUpCircle,
  LineChart, BarChart3, Gauge, "trending-up": TrendingUp, "trending-down": TrendingDown,
  "scale": Ruler, "activity": Activity, "award": BadgeCheck, "alert-circle": HelpCircle,
  "banknote": Banknote, "heart": Heart, "baby": Baby, "zap": Zap, "droplets": Droplets,
  "beef": Beef, "pie-chart": PieChart, "timer": Timer, "clock": Clock, "stethoscope": Stethoscope,
  "microscope": Microscope, "brain": Brain, "briefcase": Briefcase, "graduation-cap": GraduationCap,
  "plane": Plane, "car": Car, "home": Home, "shopping-cart": ShoppingCart, "user": User,
  "users": Users, "settings": Settings, "shield": Shield, "fast-forward": Zap,
  "utensils": Utensils, "calendar": Calendar, "map-pin": MapPin, "dna": Dna, "waves": Waves,
  "heart-pulse": HeartPulse, "dumbbell": Dumbbell, "apple": Apple, "line-chart": LineChart,
  "bar-chart": BarChart3, "gauge": Gauge, "moon": Moon, "sun": Sun, "globe": Globe,
  "history": History, "target": Target,
  "bike": Bike, "cycling": Bike, "bicycle": Bike,
  "snowflake": Snowflake, "ski": Snowflake, "snowboard": Snowflake,
  "footprints": Footprints, "running": Footprints,
  "anchor": Anchor, "boat": Anchor, "marine": Anchor,
  "arrow-up-circle": ArrowUpCircle, "elevator": ArrowUpCircle,
  "navigation": Navigation, "gps": Navigation,
  "train": Train, "rail": Train
};

const categoryStyles: Record<CalcMeta["category"], string> = {
  finance: "bg-finance-soft text-finance dark:bg-finance/20 dark:text-finance border-finance/20",
  health: "bg-health-soft text-health dark:bg-health/20 dark:text-health border-health/20",
  education: "bg-education-soft text-education dark:bg-education/20 dark:text-education border-education/20",
  utility: "bg-utility-soft text-utility dark:bg-utility/20 dark:text-utility border-utility/20",
  business: "bg-business-soft text-business dark:bg-business/20 dark:text-business border-business-soft/20",
  sustainability: "bg-sustainability-soft text-sustainability dark:bg-sustainability/20 dark:text-sustainability border-sustainability/20",
  benchmarks: "bg-benchmarks-soft text-benchmarks dark:bg-benchmarks/20 dark:text-benchmarks border-benchmarks/20",
  tax: "bg-tax-soft text-tax dark:bg-tax/20 dark:text-tax border-tax/20",
  productivity: "bg-productivity-soft text-productivity dark:bg-productivity/20 dark:text-productivity border-productivity/20",
  travel: "bg-travel-soft text-travel dark:bg-travel/20 dark:text-travel border-travel/20",
  lifestyle: "bg-lifestyle-soft text-lifestyle dark:bg-lifestyle/20 dark:text-lifestyle border-lifestyle/20",
};

interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

interface Props {
  calc: CalcMeta;
  children: ReactNode;
  seoContent?: ReactNode;
  faqs?: { q: string; a: string }[];
  guideHtml?: string;
  relatedArticles?: PostSummary[];
  hideHeaderCurrency?: boolean;
}

export const CalculatorPage = ({ calc, children, seoContent, faqs, guideHtml, relatedArticles, hideHeaderCurrency }: Props) => {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);

  if (!calc) return <>{children}</>;
  const { currency } = useCurrency();
  const cat = CATEGORIES[calc.category] || { label: "General", color: "bg-foreground/10 text-foreground", code: "GEN" };
  const Icon = ICONS[calc.icon] || Landmark;
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const relatedTools = calc.relatedSlugs
    ? calc.relatedSlugs.map(s => CALCULATORS.find(c => c.slug === s)).filter(Boolean) as CalcMeta[]
    : CALCULATORS.filter(c => c.category === calc.category && c.slug !== calc.slug).slice(0, 3);

  const hasCurrency = (["finance", "business"].includes(calc.category) ||
    ["inflation-calculator", "hourly-to-salary-calculator", "freelance-rate-calculator", "tax-bracket-calculator", "smoking-cost-calculator", "crypto-profit-calculator", "gst-vat-tax-calculator", "discount-calculator", "tip-calculator"].includes(calc.slug)) && !calc.hideCurrencySwitcher;

  return (
    <>
      <Seo
        title={`${calc.title} — Free Online Tool`}
        description={calc.description}
      />
      <div className={cn("bg-background min-h-screen", isEmbed && "min-h-0 bg-transparent")}>
        {!isEmbed && (
          <header className="relative min-h-[60vh] flex flex-col items-center justify-start border-b border-border/50 bg-hero pt-32 sm:pt-40 pb-16 overflow-visible">
            {/* Background Layers Container */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Dynamic Texture Layer */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-900/10 rounded-full blur-[120px] hidden sm:block animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 dark:bg-indigo-900/10 rounded-full blur-[120px] hidden sm:block animate-pulse" style={{ animationDelay: "2s" }} />

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
                <div className="absolute top-[10%] left-[10%] rotate-12"><Plus className="size-20" /></div>
                <div className="absolute top-[15%] right-[15%] -rotate-45"><Percent className="size-16" /></div>
                <div className="absolute bottom-[20%] left-[15%] -rotate-12"><Divide className="size-20" /></div>
                <div className="absolute bottom-[10%] right-[10%] rotate-12"><ActivityIcon className="size-24" /></div>
              </div>
            </div>

            <div className="container-wide relative z-10 text-hero-text">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[10px] text-white/40 font-mono uppercase font-black tracking-widest sm:tracking-[0.3em] mb-12 no-print">
                <Link href="/" className="hover:text-white transition-colors shrink-0">Home</Link>
                <ChevronRight className="size-3 opacity-30 shrink-0" />
                <Link href={`/category/${calc.category}`} className="hover:text-white transition-colors shrink-0">{cat.label}</Link>
                <ChevronRight className="size-3 opacity-30 shrink-0" />
                <span className="text-white break-words">{calc.title.replace(/ Calculator$/, "")}</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex items-start gap-6">
                  <div className={cn("size-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl shadow-black/10 border border-white/10 backdrop-blur-xl", categoryStyles[calc.category])}>
                    <Icon className="size-8" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] font-black tracking-[0.3em] text-white/40 mb-3 uppercase">{cat.code} · {cat.label} Engine</div>
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter leading-tight mb-4">{calc.title}</h1>
                    <p className="text-white/60 max-w-2xl text-lg font-medium leading-relaxed">{calc.description}</p>
                  </div>
                </div>
                <div className="no-print flex items-center gap-3 shrink-0">
                  {calc.howTo && (
                    <button
                      onClick={() => document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' })}
                      className="h-12 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2 group shadow-xl backdrop-blur-sm"
                    >
                      <HelpCircle className="size-4 text-white/70 group-hover:text-white transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">Help</span>
                    </button>
                  )}
                  {hasCurrency && !hideHeaderCurrency && <CurrencySwitcher />}
                  <ExportButton title={calc.title} onEmbedClick={() => setIsEmbedDialogOpen(true)} />
                </div>
              </div>
            </div>
          </header>
        )}

        <div className={cn("container-wide pb-24", isEmbed ? "pt-4 px-4" : "pt-24 sm:pt-32")}>
          {!isEmbed && (
            <div className="print-header">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-md bg-black flex items-center justify-center text-white"><Calculator className="size-4" /></div>
                <span className="text-xl font-bold">Calcuva Analysis</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{calc.slug.toUpperCase()} TOOL</div>
                <div className="text-xs font-bold font-mono">{now}</div>
              </div>
            </div>
          )}

          <section className="animate-fade-up relative z-9">{children}</section>

          {isEmbed && (
            <div className="mt-8 flex justify-center">
              <Link
                href={`/calculators/${calc.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground hover:text-signal transition-colors group"
              >
                <Calculator className="size-3" />
                Powered by Calcuva
                <ArrowRight className="size-2.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {!isEmbed && guideHtml && (
            <section className="mt-32 pt-24 border-t border-border/30 no-print">
              <div className="flex flex-col md:flex-row gap-16 items-start">
                <aside className="md:w-1/4 sticky top-32 space-y-12 hidden md:block">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-signal">
                      <BookOpen className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Knowledge Base</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Strategy Guide</h3>
                    <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed">
                      Master the math and logic behind this tool to reach your goals faster.
                    </p>
                  </div>

                  <div className="space-y-8 pt-8 border-t border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground/60">
                      <Lightbulb className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Related Tools</span>
                    </div>
                    <div className="space-y-4">
                      {relatedTools.map((t) => {
                        const RelatedIcon = ICONS[t.icon] || Landmark;
                        return (
                          <Link
                            key={t.slug}
                            href={`/calculators/${t.slug}`}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border dark:border-white/5 hover:border-signal/50 transition-all group overflow-hidden relative shadow-sm"
                          >

                            <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0 relative z-10", categoryStyles[t.category])}>
                              <RelatedIcon className="size-4.5" />
                            </div>
                            <div className="min-w-0 relative z-10">
                              <div className="text-xs font-bold truncate group-hover:text-signal transition-colors">{t.title}</div>
                              <div className="text-[8px] text-muted-foreground/50 font-black uppercase tracking-widest mt-1">{cat.code} Engine</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <div className="flex-1 min-w-0 w-full">
                  <div
                    className="prose prose-zinc dark:prose-invert max-w-none w-full"
                    dangerouslySetInnerHTML={{ __html: guideHtml }}
                  />

                  {faqs && faqs.length > 0 && (
                    <div className="mt-32 space-y-16">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-signal">
                          <HelpCircle className="size-5" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono">Common Questions</span>
                        </div>
                        <h3 className="text-4xl font-bold tracking-tight">Expert FAQ</h3>
                      </div>

                      <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((f, i) => (
                          <AccordionItem key={i} value={`item-${i}`} className="border border-border dark:border-white/5 bg-surface rounded-2xl px-10 py-2 hover:border-signal/30 transition-all duration-500 shadow-sm overflow-hidden relative group">

                            <AccordionTrigger className="hover:no-underline py-8 text-xl font-bold text-left leading-tight group relative z-10">
                              <div className="flex items-center gap-6">
                                <span className="text-[10px] font-mono text-muted-foreground/30 group-hover:text-signal transition-colors">0{i + 1}</span>
                                {f.q}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-lg text-muted-foreground leading-relaxed pb-10 pt-4 pl-12 border-t border-border/10 mt-4 relative z-10 font-medium">
                              {f.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {!isEmbed && relatedArticles && relatedArticles.length > 0 && (
            <section className="mt-32 border-t border-border/40 pt-20 no-print">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-10 px-4 rounded-xl bg-signal/10 flex items-center justify-center border border-signal/20 text-signal gap-2">
                  <FileText className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">Expert Analysis</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Related Reading</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                {relatedArticles.map(article => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-surface border border-border dark:border-white/5 rounded-2xl p-10 group flex flex-col gap-6 hover:border-signal/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                  >

                    <div className="text-[9px] font-mono font-black text-muted-foreground/40 uppercase tracking-[0.3em] relative z-10">{article.category} · {new Date(article.date).toLocaleDateString()}</div>
                    <h4 className="text-2xl font-bold group-hover:text-signal transition-colors leading-tight relative z-10">{article.title}</h4>
                    <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed relative z-10 font-medium">{article.excerpt}</p>
                    <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover:text-signal transition-all relative z-10">
                      Read Analysis <ArrowRight className="size-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <EmbedDialog
        isOpen={isEmbedDialogOpen}
        onClose={() => setIsEmbedDialogOpen(false)}
        slug={calc.slug}
        title={calc.title}
      />
    </>
  );
};

export default CalculatorPage;
