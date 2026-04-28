"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRight, Landmark, Receipt, TrendingUp, Home, Activity, Baby, Droplet,
  Calendar, Ruler, GraduationCap, ReceiptSwissFranc, TrendingDown, UserRound,
  Briefcase, FileType, PiggyBank, Weight, Utensils, Coins, Banknote, Timer,
  Target, CalendarPlus, Calculator, Car, Flame, Beer, Cigarette, Percent
} from "lucide-react";
import { Seo } from "./Seo";
import { CalcMeta, CATEGORIES, CALCULATORS } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { Lightbulb, ArrowRight, BookOpen, FileText, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCurrency, CurrencyCode } from "@/context/CurrencyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  /** Long-form SEO content shown at the bottom of the page */
  seoContent?: ReactNode;
  faqs?: { q: string; a: string }[];
  guideHtml?: string;
  relatedArticles?: PostSummary[];
}

import { ExportButton } from "./ExportButton";

export const CalculatorPage = ({ calc, children, seoContent, faqs, guideHtml, relatedArticles }: Props) => {
  const { currency, setCurrency } = useCurrency();
  const cat = CATEGORIES[calc.category];
  const Icon = ICONS[calc.icon] || Landmark;
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const baseUrl = "https://calcuva.app"; // Ensure consistency

  // Intelligent lateral discovery logic
  const relatedTools = calc.relatedSlugs
    ? calc.relatedSlugs.map(s => CALCULATORS.find(c => c.slug === s)).filter(Boolean) as CalcMeta[]
    : CALCULATORS.filter(c => c.category === calc.category && c.slug !== calc.slug).slice(0, 3);

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
      <div className="container-wide pt-20 sm:pt-28">
        <div className="print-header">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-black flex items-center justify-center text-white"><Calculator className="size-4" /></div>
            <span className="text-xl font-bold">Calcuva Report</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{calc.slug.toUpperCase()} TOOL</div>
            <div className="text-xs font-bold font-mono">{now}</div>
          </div>
        </div>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono uppercase tracking-widest mb-10 no-print">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-3" />
          <Link href={`/category/${calc.category}`} className="hover:text-foreground">{cat.label}</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground/80 truncate">{calc.title.replace(/ Calculator$/, "")}</span>
        </nav>

        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 sm:mb-10">
          <div className="flex items-start gap-4">
            <div className={cn("size-14 rounded-xl flex items-center justify-center shrink-0", categoryStyles[calc.category])}>
              <Icon className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-1">{cat.code} · {cat.label.toUpperCase()}</div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{calc.title}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">{calc.description}</p>
            </div>
          </div>
          <div className="no-print flex items-center gap-3">
            {(calc.category === "finance" || calc.category === "business") && (
              <div className="flex items-center gap-2 pr-3 border-r border-border mr-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Currency</span>
                <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
                  <SelectTrigger className="w-[85px] h-9 text-xs font-bold bg-secondary/50 border-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="AED">AED (د.إ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <ExportButton title={calc.title} />
          </div>
        </header>

        <section className="animate-fade-up">{children}</section>

        {guideHtml && (
          <section className="mt-20 sm:mt-24 border-t border-border pt-12 no-print">
            <div className="flex items-center gap-2 mb-8 text-finance">
              <GraduationCap className="size-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Theory & Expert Strategy</h3>
            </div>
            <div
              className="prose prose-slate dark:prose-invert max-w-none 
                prose-h3:text-lg prose-h3:font-bold prose-h3:mb-4
                prose-p:text-sm prose-p:text-muted-foreground prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: guideHtml }}
            />

            {faqs && faqs.length > 0 && (
              <div className="mt-16 bg-secondary/10 rounded-3xl p-6 sm:p-10 border border-border/50">
                <div className="flex items-center gap-3 mb-10">
                  <div className="size-10 rounded-xl bg-background flex items-center justify-center text-finance shadow-inner">
                    <HelpCircle className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Technical Knowledge Base</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase font-mono tracking-widest font-bold">Expert Q&A</p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-none bg-background rounded-xl px-4 py-1 shadow-sm overflow-hidden">
                      <AccordionTrigger className="hover:no-underline py-4 text-sm font-semibold text-left leading-relaxed">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </section>
        )}

        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-20 sm:mt-24 border-t border-border pt-12 no-print">
            <div className="flex items-center gap-2 mb-8 text-signal">
              <FileText className="size-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Related Research & Analysis</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedArticles.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="surface-card p-6 glass-hover group flex flex-col gap-3"
                >
                  <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{article.category} · {new Date(article.date).toLocaleDateString()}</div>
                  <h4 className="font-bold group-hover:text-signal transition-colors">{article.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Smart Discovery Section */}
        <section className="mt-20 sm:mt-24 border-t border-border pt-12 no-print">
          <div className="flex items-center gap-2 mb-8 text-signal">
            <Lightbulb className="size-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Expand Your Analysis</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {relatedTools.map((t) => {
              const RelatedIcon = ICONS[t.icon] || Landmark;
              return (
                <Link
                  key={t.slug}
                  href={`/calculators/${t.slug}`}
                  className="surface-card p-6 glass-hover transition-all duration-300 flex flex-col gap-4 group"
                >
                  <div className={cn("size-10 rounded-lg flex items-center justify-center shrink-0", categoryStyles[t.category])}>
                    <RelatedIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1 group-hover:text-signal transition-colors">{t.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.short}</p>
                  </div>
                  <div className="mt-auto flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-signal transition-colors pt-2">
                    Try This Tool <ArrowRight className="size-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Legacy SEO Content fallback — only shown if no specialized Markdown guide exists */}
        {!guideHtml && seoContent && (
          <article className="mt-20 sm:mt-24 pb-16 border-t border-border pt-12 no-print">
            {seoContent}
          </article>
        )}
      </div>
    </>
  );
};
