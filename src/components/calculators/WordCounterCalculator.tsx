"use client";

import { useMemo, useState } from "react";
import { 
  Copy, Trash2, Clock, Volume2, Type, Info, CheckCircle2, Zap, 
  FileText, Share, MessageSquare, Globe, 
  History, Target, Activity, Cpu, Terminal, ShieldAlert, Sparkles, 
  LayoutDashboard, Search, Eye, Settings2, RefreshCcw, Watch,
  TrendingUp, Ruler, Gauge, Landmark, ChevronRight, Calculator
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { calculatorBySlug } from "@/lib/calculators";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("word-character-counter-tool");

const WordCounterCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    
    const readSeconds = (words / 225) * 60;
    const speakSeconds = (words / 130) * 60;

    let insight = "";
    if (characters === 0) insight = "Waiting for Text: Paste your content here to see detailed statistics and tips.";
    else if (characters <= 60) insight = "Good for Search: This title is the perfect length for Google Search results (max 60).";
    else if (characters <= 155) insight = "Good for Mobile: This text is a great length for mobile search results.";
    else if (characters <= 280) insight = "Social Media Ready: This content fits within standard social media character limits.";
    else if (words > 1500) insight = "Detailed Guide: This is a great length for a deep-dive article or helpful guide.";
    else insight = "Professional Article: This is a professional length for a blog post or news story.";

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readSeconds, speakSeconds, insight };
  }, [text]);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = () => {
    let textSummary = `Text Stats: ${stats.words} Words | ${stats.characters} Characters. Check yours at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(textSummary);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Content Matrix */}
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
              <div className="flex items-center gap-3 relative z-10">
                <Terminal className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Writing Area</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Statistics Updated Live</p>
                </div>
              </div>
              <div className="flex gap-2 relative z-10">
                <button 
                  onClick={copyText} 
                  className="h-9 px-4 rounded-xl bg-background border border-border/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-foreground hover:text-background transition-all shadow-sm"
                >
                  {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />}
                  {copied ? "COPIED" : "COPY"}
                </button>
                <button 
                  onClick={() => setText("")} 
                  className="h-9 px-4 rounded-xl bg-background border border-border/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm text-muted-foreground"
                >
                  <Trash2 className="size-3" /> CLEAR
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here to count words and characters..."
              className="w-full min-h-[500px] p-8 md:p-12 bg-transparent border-none focus:ring-0 resize-y text-lg leading-relaxed placeholder:text-muted-foreground/20 font-medium font-serif selection:bg-foreground/10"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group shadow-sm">
                <Search className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Globe className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">SEO Check</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  We check if your text fits perfectly in Google Search results and social media posts to help more people find your content.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group shadow-sm">
                <Eye className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Activity className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Reader Engagement</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Find out how long it will take someone to read your text or hear it spoken out loud before you publish it.
                </p>
             </div>
          </div>
        </div>

        {/* Results & Auditing */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <FileText className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Type className="size-3" />
                    Total Word Count
                  </div>
                  <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums">
                    {stats.words.toLocaleString()}
                  </div>
                </div>
                <button 
                  onClick={handleCopy} 
                  className={cn(
                    "p-3 rounded-xl transition-all border shadow-sm",
                    shareCopied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {shareCopied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-border/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Ruler className="size-3" />
                    Characters
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {stats.characters.toLocaleString()} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Total</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Watch className="size-3" />
                    Estimated Reading
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatTime(stats.readSeconds)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Semantic Insight */}
          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Zap className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Text Details</h4>
                <p className="text-xs leading-relaxed font-medium">
                  {stats.insight}
                </p>
              </div>
            </div>
          </div>

          {/* Temporal Metrics */}
          <div className="surface-card p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <Clock className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Timing Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Reading & Speaking Speed</p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="bg-background p-5 rounded-2xl border border-border/40 shadow-sm">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase mb-2 opacity-60">Reading Time</div>
                  <div className="text-xl font-mono font-bold tabular-nums">{formatTime(stats.readSeconds)}</div>
               </div>
               <div className="bg-background p-5 rounded-2xl border border-border/40 shadow-sm">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase mb-2 opacity-60">Speaking Time</div>
                  <div className="text-xl font-mono font-bold tabular-nums">{formatTime(stats.speakSeconds)}</div>
               </div>
            </div>

            <div className="pt-4 space-y-3 relative z-10">
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="opacity-40">Paragraphs</span>
                  <span className="font-mono text-foreground">{stats.paragraphs}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="opacity-40">Characters (no spaces)</span>
                  <span className="font-mono text-foreground">{stats.charactersNoSpaces}</span>
               </div>
            </div>
          </div>

          {/* Compliance Audit */}
          <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <Globe className="size-4 text-muted-foreground/60" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Social Media Limits</h4>
             </div>
             <div className="space-y-6">
                {[
                  { l: "Google Search Title", max: 60 },
                  { l: "Short Description", max: 155 },
                  { l: "Twitter Post", max: 280 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2.5">
                     <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground/60">{item.l}</span>
                        <span className={cn(stats.characters > item.max ? "text-red-500" : "text-foreground")}>{stats.characters} / {item.max}</span>
                     </div>
                     <div className="h-1 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000 ease-out", stats.characters > item.max ? "bg-red-500" : "bg-foreground")}
                          style={{ width: `${Math.min(100, (stats.characters / item.max) * 100)}%` }}
                        />
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default WordCounterCalculator;
