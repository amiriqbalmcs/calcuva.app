"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2, Clock, Volume2, Type, Info, CheckCircle2 } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("word-character-counter-tool")!;

const WordCounterCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    
    // Average reading/speaking speeds
    const readSeconds = (words / 225) * 60;
    const speakSeconds = (words / 130) * 60;

    let insight = "";
    if (characters === 0) insight = "Start typing or paste content to see platform analysis.";
    else if (characters <= 60) insight = "SEO Title Optimization: This is the perfect length for a Google Search title (max 60 chars).";
    else if (characters <= 155) insight = "Meta Description: This fits perfectly within the standard 155 char limit for mobile search snippets.";
    else if (characters <= 280) insight = "X (Twitter) Limit: This post fits within the 280 character limit for a single tweet.";
    else if (words > 1500) insight = "Pillar Content: This word count is ideal for high-ranking blog posts and comprehensive guides.";
    else insight = "Article Body: You have a solid amount of content for a standard blog post or email update.";

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readSeconds, speakSeconds, insight };
  }, [text]);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={<SeoBlock title="Content Analysis & Word Counts" intro="Hit the right limits for SEO, social media, and readability." />}
    >
      <div className="space-y-6">
        <div className="surface-card p-5 sm:p-7 relative border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Editor Workspace</Label>
            <div className="flex gap-2">
              <button onClick={copyText} className="text-[10px] flex items-center gap-1.5 font-bold uppercase hover:text-primary transition text-muted-foreground bg-secondary/80 px-2.5 py-1.5 rounded-md">
                {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />}
                {copied ? "COPIED" : "COPY"}
              </button>
              <button onClick={() => setText("")} className="text-[10px] flex items-center gap-1.5 font-bold uppercase hover:text-destructive transition text-muted-foreground bg-secondary/80 px-2.5 py-1.5 rounded-md">
                <Trash2 className="size-3" /> CLEAR
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here..."
            className="w-full min-h-[320px] bg-transparent border-none focus:ring-0 resize-y text-lg leading-relaxed placeholder:text-muted-foreground/20 font-medium"
          />
        </div>

        <ResultGrid cols={2}>
          <ResultStat label="Words" value={stats.words} accent />
          <ResultStat label="Characters" value={stats.characters} sub={`Incl. spaces`} />
        </ResultGrid>

        {/* Content Insight */}
        <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-primary-soft border-primary text-primary">
          <div className="shrink-0 mt-0.5"><Type className="size-5" /></div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Content Insight</h4>
            <p className="text-sm opacity-90 leading-relaxed font-medium">{stats.insight}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="surface-card p-5">
             <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Reading</div>
             <div className="text-lg font-bold">{formatTime(stats.readSeconds)}</div>
          </div>
          <div className="surface-card p-5">
             <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Speaking</div>
             <div className="text-lg font-bold">{formatTime(stats.speakSeconds)}</div>
          </div>
          <div className="surface-card p-5">
             <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Sentences</div>
             <div className="text-lg font-bold">{stats.sentences}</div>
          </div>
          <div className="surface-card p-5">
             <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Paragraphs</div>
             <div className="text-lg font-bold">{stats.paragraphs}</div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default WordCounterCalculator;
