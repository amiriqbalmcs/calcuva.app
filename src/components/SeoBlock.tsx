"use client";

import { ReactNode } from "react";
import { HelpCircle, Info, BookOpen, Quote, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Section {
  heading: string;
  body: ReactNode;
  icon?: "info" | "book" | "quote";
}

interface FAQ {
  q: string;
  a: string;
}

interface SeoBlockProps {
  title: string;
  intro: string;
  sections?: Section[];
  faqs?: FAQ[];
  className?: string;
}

const IconMap = {
  info: Info,
  book: BookOpen,
  quote: Quote,
};

/** 
 * Editorial-style long-form SEO content block.
 * Designed for high readability, trustworthy aesthetics, and better semantic structure.
 */
export const SeoBlock = ({
  title,
  intro,
  sections,
  faqs,
  className,
}: SeoBlockProps) => {
  return (
    <div className={cn("space-y-16 sm:space-y-24", className)}>
      {/* Intro Header */}
      <header className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          {title}
        </h2>
        <div className="text-lg text-muted-foreground leading-relaxed font-medium">
          {intro}
        </div>
      </header>

      {/* Main Sections Grid */}
      {sections && sections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {sections.map((s, idx) => {
            const Icon = s.icon ? IconMap[s.icon] : null;
            return (
              <section key={s.heading} className="space-y-4">
                <div className="flex items-center gap-2 text-signal">
                  {Icon ? <Icon className="size-4" /> : <div className="size-1 w-4 bg-signal h-[2px]" />}
                  <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
                    Section {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {s.heading}
                </h3>
                <div className="text-muted-foreground leading-relaxed text-sm prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2">
                  {s.body}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="bg-secondary/20 rounded-2xl p-6 sm:p-10 border border-border/50">
          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 rounded-xl bg-background flex items-center justify-center text-signal shadow-inner">
              <HelpCircle className="size-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Technical Knowledge Base</h3>
              <p className="text-xs text-muted-foreground mt-0.5 uppercase font-mono tracking-widest">Q&A Integration</p>
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
        </section>
      )}

      {/* Content footer marker */}
      <footer className="pt-8 border-t border-border/50 text-center">
        <div className="inline-flex items-center gap-4 text-muted-foreground/30 font-mono text-[10px] tracking-[0.3em] uppercase">
          <span className="h-px w-8 bg-border/50" />
          Data Verified for Accuracy
          <span className="h-px w-8 bg-border/50" />
        </div>
      </footer>
    </div>
  );
};
