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
  Dna, Waves, HeartPulse, LineChart, BarChart3, Gauge
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
  "history": History, "target": Target
};

const categoryStyles: Record<CalcMeta["category"], string> = {
  finance: "bg-finance-soft text-finance dark:bg-finance/20 dark:text-finance border-finance/20",
  health: "bg-health-soft text-health dark:bg-health/20 dark:text-health border-health/20",
  education: "bg-education-soft text-education dark:bg-education/20 dark:text-education border-education/20",
  utility: "bg-utility-soft text-utility dark:bg-utility/20 dark:text-utility border-utility/20",
  business: "bg-business-soft text-business dark:bg-business/20 dark:text-business border-business-soft/20",
  sustainability: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/10",
};

const categoryGradients: Record<CalcMeta["category"], string> = {
  finance: "from-finance/5 via-transparent to-transparent",
  health: "from-health/5 via-transparent to-transparent",
  education: "from-education/5 via-transparent to-transparent",
  utility: "from-utility/5 via-transparent to-transparent",
  business: "from-business/5 via-transparent to-transparent",
  sustainability: "from-emerald-500/5 via-transparent to-transparent",
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
  const baseUrl = SITE_URL;

  const relatedTools = calc.relatedSlugs
    ? calc.relatedSlugs.map(s => CALCULATORS.find(c => c.slug === s)).filter(Boolean) as CalcMeta[]
    : CALCULATORS.filter(c => c.category === calc.category && c.slug !== calc.slug).slice(0, 3);

  const hasCurrency = (["finance", "business"].includes(calc.category) ||
    ["inflation-calculator", "hourly-to-salary-calculator", "freelance-rate-calculator", "tax-bracket-calculator", "smoking-cost-calculator", "crypto-profit-calculator", "gst-vat-tax-calculator", "discount-calculator", "tip-calculator"].includes(calc.slug)) && !calc.hideCurrencySwitcher;

  return (
    <>
      <Seo
        title={`${calc.title} — Free Online Tool | Calcuva`}
        description={calc.description}
        faqs={faqs}
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": calc.title,
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Any",
              "description": calc.description,
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
                { "@type": "ListItem", "position": 2, "name": cat.label, "item": `${baseUrl}/category/${calc.category}` },
                { "@type": "ListItem", "position": 3, "name": calc.title, "item": `${baseUrl}/calculators/${calc.slug}` }
              ]
            }
          ]
        }}
      />
      <div className={cn("relative min-h-screen", isEmbed && "min-h-0")}>
        {!isEmbed && <div className={cn("fixed inset-0 bg-gradient-to-br -z-10 opacity-60 pointer-events-none", categoryGradients[calc.category])} />}

        <div className={cn("container-wide pb-20", isEmbed ? "pt-4 px-4" : "pt-20 sm:pt-28")}>
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

          {!isEmbed && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono uppercase tracking-widest mb-10 no-print">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="size-3 opacity-50" />
              <Link href={`/category/${calc.category}`} className="hover:text-foreground transition-colors">{cat.label}</Link>
              <ChevronRight className="size-3 opacity-50" />
              <span className="text-foreground/80 truncate font-bold">{calc.title.replace(/ Calculator$/, "")}</span>
            </nav>
          )}

          {!isEmbed && (
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12 sm:mb-16">
              <div className="flex items-start gap-5">
                <div className={cn("size-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/5", categoryStyles[calc.category])}>
                  <Icon className="size-8" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 mb-2">{cat.code} · {cat.label.toUpperCase()} ENGINE</div>
                  <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter leading-tight">{calc.title}</h1>
                  <p className="text-muted-foreground mt-3 max-w-2xl text-base sm:text-lg font-medium leading-relaxed">{calc.description}</p>
                </div>
              </div>
              <div className="no-print flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                {hasCurrency && !hideHeaderCurrency && <CurrencySwitcher />}
                <button
                  onClick={() => setIsEmbedDialogOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary hover:border-border transition-all text-xs font-bold font-mono uppercase tracking-wider"
                >
                  <FileCode className="size-3.5" />
                  Embed
                </button>
                <ExportButton title={calc.title} />
              </div>
            </header>
          )}

          <section className="animate-fade-up relative z-10">{children}</section>

          {isEmbed && (
            <div className="mt-8 flex justify-center">
              <Link
                href={`/calculators/${calc.slug}`}
                target="_blank"
                className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground hover:text-signal transition-colors group"
              >
                <Calculator className="size-3" />
                Powered by Calcuva
                <ArrowRight className="size-2.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

          {!isEmbed && guideHtml && (
            <section className="mt-28 sm:mt-40 pt-20 border-t border-border/30 no-print">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <aside className="md:w-1/4 sticky top-32 space-y-10 hidden md:block">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-signal">
                      <BookOpen className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Documentation</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Expert Strategy Guide</h3>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/10 border border-border/20 text-xs text-muted-foreground leading-relaxed">
                    Learn more about how these calculations work and how to use the results to reach your goals.
                  </div>

                  <div className="space-y-6 pt-6 border-t border-border/20">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lightbulb className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Smart Suggest</span>
                    </div>
                    <div className="space-y-3">
                      {relatedTools.map((t) => {
                        const RelatedIcon = ICONS[t.icon] || Landmark;
                        return (
                          <Link
                            key={t.slug}
                            href={`/calculators/${t.slug}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary border border-transparent hover:border-border transition-all group"
                          >
                            <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", categoryStyles[t.category])}>
                              <RelatedIcon className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold truncate group-hover:text-foreground transition-colors">{t.title}</div>
                              <div className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">{t.category}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <div className="flex-1">
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none 
                    prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-0 prose-h2:mb-8
                    prose-h3:text-xl prose-h3:font-bold prose-h3:tracking-tight prose-h3:mt-12
                    prose-p:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-8"
                    dangerouslySetInnerHTML={{ __html: guideHtml }}
                  />

                  {faqs && faqs.length > 0 && (
                    <div className="mt-24 space-y-12">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-signal">
                          <HelpCircle className="size-4" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Knowledge Base</span>
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h3>
                      </div>

                      <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((f, i) => (
                          <AccordionItem key={i} value={`item-${i}`} className="border border-border/30 bg-background rounded-2xl px-8 py-2 hover:border-signal/30 transition-all duration-300">
                            <AccordionTrigger className="hover:no-underline py-5 text-lg font-bold text-left leading-tight group">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-muted-foreground/40 group-hover:text-signal transition-colors">0{i + 1}</span>
                                {f.q}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-lg text-muted-foreground leading-relaxed pb-8 pt-2 pl-9 border-t border-border/10 mt-2">
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

          {relatedArticles && relatedArticles.length > 0 && (
            <section className="mt-24 sm:mt-32 border-t border-border/50 pt-16 no-print">
              <div className="flex items-center gap-3 mb-10 text-signal">
                <div className="size-8 rounded-lg bg-signal/10 flex items-center justify-center border border-signal/20">
                  <FileText className="size-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] font-mono">Related Helpful Guides</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                {relatedArticles.map(article => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="surface-card p-8 group flex flex-col gap-4 hover:border-signal/40 hover:shadow-xl hover:shadow-signal/5 transition-all duration-300"
                  >
                    <div className="text-[10px] font-mono font-bold text-muted-foreground/60 uppercase tracking-widest">{article.category} · {new Date(article.date).toLocaleDateString()}</div>
                    <h4 className="text-xl font-bold group-hover:text-signal transition-colors leading-tight">{article.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-24 sm:mt-32 border-t border-border/50 pt-16 no-print">
            <div className="flex items-center gap-3 mb-10 text-signal">
              <div className="size-8 rounded-lg bg-signal/10 flex items-center justify-center border border-signal/20">
                <Lightbulb className="size-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] font-mono">Other Tools You Might Like</h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {relatedTools.map((t) => {
                const RelatedIcon = ICONS[t.icon] || Landmark;
                return (
                  <Link
                    key={t.slug}
                    href={`/calculators/${t.slug}`}
                    className="surface-card p-8 transition-all duration-500 flex flex-col gap-5 group hover:border-signal/40 hover:shadow-2xl hover:shadow-signal/10"
                  >
                    <div className={cn("size-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm", categoryStyles[t.category])}>
                      <RelatedIcon className="size-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold mb-2 group-hover:text-signal transition-colors">{t.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">{t.short}</p>
                    </div>
                    <div className="mt-auto flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-signal transition-all pt-4">
                      Initialize Tool <ArrowRight className="size-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {!isEmbed && !guideHtml && seoContent && (
            <article className="mt-24 sm:mt-32 pb-20 border-t border-border/50 pt-16 no-print">
              {seoContent}
            </article>
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
