"use client";

import { SITE_DOMAIN } from "@/lib/constants";
import { useMemo, useState } from "react";
import { 
  Heart, Copy, CheckCircle2, Sparkles, RefreshCw, Share, Zap, History, Target, 
  Activity, Flame, HeartHandshake, Stars, Settings2, Lock, Server 
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("love-calculator")!;

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

const getCompatibility = (name1: string, name2: string) => {
  if (!name1.trim() || !name2.trim()) return 0;
  const names = [name1.trim().toLowerCase(), name2.trim().toLowerCase()].sort();
  const pairStr = names.join(" loves ");
  const hash = Math.abs(hashCode(pairStr));
  return 20 + (hash % 81);
};

const LoveCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [name1, setName1] = useUrlState<string>("n1", "");
  const [name2, setName2] = useUrlState<string>("n2", "");
  const [copied, setCopied] = useState(false);

  const score = useMemo(() => getCompatibility(name1, name2), [name1, name2]);
  const hasInput = name1.trim().length > 0 && name2.trim().length > 0;

  let message = "";
  let subMessage = "";
  let color = "text-muted-foreground";
  let icon = <Heart className="size-5" />;

  if (hasInput) {
    if (score >= 90) {
      message = "Destined Soulmates";
      subMessage = "A cosmic connection written in the stars. Pure magic! ✨";
      color = "text-red-500";
      icon = <Flame className="size-4" />;
    } else if (score >= 70) {
      message = "True Romance";
      subMessage = "A very powerful connection with deep resonance. ❤️";
      color = "text-pink-500";
      icon = <Heart className="size-4" />;
    } else if (score >= 50) {
      message = "Strong Potential";
      subMessage = "Good compatibility. There's a spark worth exploring! 👍";
      color = "text-amber-500";
      icon = <HeartHandshake className="size-4" />;
    } else {
      message = "Challenging Match";
      subMessage = "A bit rocky. This might require some serious work. 💔";
      color = "text-blue-500";
      icon = <Activity className="size-4" />;
    }
  }

  const handleShare = () => {
    let text = `Love Match: ${name1} + ${name2} = ${score}%! ${message}. Test your crush at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Input Architecture */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-gradient-to-b from-red-500/[0.02] to-pink-500/[0.02] border-red-500/20 relative overflow-hidden group shadow-sm">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-red-500/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight text-red-500/80">Match Input</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Resonance Entry</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Person One */}
              <div className="space-y-3 relative group/input">
                <Heart className="absolute -top-6 -right-6 size-12 text-red-500/[0.08] group-hover/input:scale-125 transition-transform" />
                <Label className="text-[10px] font-bold uppercase tracking-wider text-red-500/60">Person One</Label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Enter Name..."
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    className="h-11 bg-background border-red-500/20 focus:border-red-500/40 transition-all font-bold text-base rounded-lg shadow-sm"
                  />
                  <Heart className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-red-500/30" />
                </div>
              </div>

              <div className="flex justify-center opacity-40">
                <Heart className="size-4 text-red-500 animate-pulse fill-red-500/10" />
              </div>

              {/* Person Two */}
              <div className="space-y-3 relative group/input">
                <Heart className="absolute -bottom-6 -left-6 size-12 text-pink-500/[0.08] group-hover/input:scale-125 transition-transform" />
                <Label className="text-[10px] font-bold uppercase tracking-wider text-pink-500/60">Person Two</Label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Enter Name..."
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    className="h-11 bg-background border-pink-500/20 focus:border-pink-500/40 transition-all font-bold text-base rounded-lg shadow-sm"
                  />
                  <Heart className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-pink-500/30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => { setName1(""); setName2(""); }}
                  className="h-11 rounded-xl bg-background border border-red-500/20 hover:bg-red-500/10 hover:text-red-600 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm text-red-500/60"
                >
                  <RefreshCw className="size-3" /> Reset
                </button>
                <button
                  onClick={handleShare}
                  className="h-11 rounded-xl bg-red-500 text-white border border-red-400 hover:bg-red-600 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/20"
                >
                  {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
                  {copied ? "Copied" : "Share"}
                </button>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-pink-500/20 bg-pink-500/[0.03] text-pink-600 relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Target className="size-5 text-pink-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-pink-500/80">Deterministic Fun</h4>
                <p className="text-xs leading-relaxed font-medium">
                  This algorithm uses name resonance to calculate compatibility. For entertainment purposes only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {hasInput ? (
            <>
              {/* Executive Summary */}
              <div className="surface-card p-8 md:p-12 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group transition-all duration-1000">
                <Stars className="absolute -top-12 -right-12 size-64 text-red-500/[0.04] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
                <Heart className="absolute -bottom-24 -left-24 size-96 text-red-500/[0.05] -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 text-center md:text-left">
                    <div className="space-y-2 mx-auto md:mx-0">
                      <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Heart className="size-3" />
                        Compatibility Index
                      </div>
                      <div className={cn("text-7xl md:text-8xl font-mono font-bold tracking-tighter tabular-nums drop-shadow-sm", color)}>
                        {score}%
                      </div>
                    </div>
                    <button 
                      onClick={handleShare} 
                      className={cn(
                        "p-3 rounded-xl transition-all border shadow-sm absolute top-0 right-0",
                        copied ? "bg-red-500 text-white border-red-500" : "bg-background text-foreground border-border hover:bg-secondary"
                      )}
                    >
                      {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                    </button>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Flame className="size-3 text-pink-500" />
                        Resonance Level
                      </div>
                      <div className={cn("text-3xl md:text-4xl font-mono font-bold tabular-nums", color)}>
                        {message}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Activity className="size-3" />
                        Match Intensity
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                        {score > 80 ? "Peak" : score > 50 ? "Stable" : "Mid"} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Vibration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Block */}
              <div className="surface-card p-8 bg-gradient-to-r from-red-500/[0.05] to-transparent border-red-500/20 shadow-sm flex gap-6 items-start relative overflow-hidden group">
                <div className="shrink-0 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-red-500/20 shadow-md text-red-500">
                  <Sparkles className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500/60">Resonance Insight</h4>
                  <p className="text-lg font-bold leading-relaxed">{subMessage}</p>
                </div>
              </div>

              {/* Precision Analytics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Match Index", v: (score / 10).toFixed(1), i: Target, unit: "", c: "text-red-500" },
                  { l: "Resonance", v: score > 50 ? "High" : "Mid", i: Activity, unit: "", c: "text-pink-500" },
                  { l: "Stability", v: (100 - Math.abs(50 - score)).toFixed(0), i: History, unit: "%", c: "text-rose-500" },
                  { l: "Intensity", v: score > 80 ? "Peak" : "Stable", i: Zap, unit: "", c: "text-orange-500" }
                ].map((item, idx) => (
                  <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-red-500/30 transition-all group shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <item.i className={cn("size-3 opacity-60 group-hover:opacity-100 transition-opacity", item.c)} />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                    </div>
                    <div className={cn("text-2xl font-mono font-bold tabular-nums leading-tight", item.c)}>
                      {item.v}
                      {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expert Strategy Cards */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <div className="surface-card p-8 border-red-500/10 space-y-4 bg-gradient-to-br from-red-500/[0.02] to-transparent relative overflow-hidden group shadow-sm">
                  <Heart className="absolute -bottom-4 -right-4 size-20 text-red-500/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="flex items-center gap-3 relative z-10">
                    <Lock className="size-4 text-red-400" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-500/80">Alchemy of Names</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                    Ancient traditions suggest that names carry specific vibrations that influence compatibility and long-term relationship dynamics.
                  </p>
                </div>
                <div className="surface-card p-8 border-pink-500/10 space-y-4 bg-gradient-to-br from-pink-500/[0.02] to-transparent relative overflow-hidden group shadow-sm">
                  <Zap className="absolute -bottom-4 -right-4 size-20 text-pink-500/5 group-hover:scale-110 transition-transform duration-500" />
                  <div className="flex items-center gap-3 relative z-10">
                    <Server className="size-4 text-pink-400" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-pink-500/80">Algorithmic Fun</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                    Our deterministic model ensures the same pairing always yields the same result, creating a persistent resonance signature for every match.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="surface-card p-32 flex flex-col items-center justify-center text-center space-y-6 opacity-40 border-dashed border-red-500/20 bg-gradient-to-b from-red-500/[0.01] to-transparent">
              <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                <Heart className="size-8 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500/60">Initialization Required</h3>
                <p className="text-xs font-medium">Enter two names to generate resonance metrics</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </CalculatorPage>
  );
};

export default LoveCalculator;
