"use client";

import { useMemo, useState } from "react";
import { format, addHours, parse } from "date-fns";
import { Share, CheckCircle2, Clock, Info, Zap } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("intermittent-fasting-calculator")!;

const PROTOCOLS = {
  "16-8": { fast: 16, eat: 8, label: "16:8 (LeanGains)" },
  "18-6": { fast: 18, eat: 6, label: "18:6 (Advanced)" },
  "20-4": { fast: 20, eat: 4, label: "20:4 (Warrior Diet)" },
  "23-1": { fast: 23, eat: 1, label: "OMAD (One Meal a Day)" },
};

const FastingCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [lastMeal, setLastMeal] = useUrlState<string>("lm", "20:00");
  const [protocol, setProtocol] = useUrlState<keyof typeof PROTOCOLS>("p", "16-8");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    try {
      const startTime = parse(lastMeal, "HH:mm", new Date());
      const p = PROTOCOLS[protocol];
      const fastEnds = addHours(startTime, p.fast);
      const eatEnds = addHours(fastEnds, p.eat);
      
      let insight = "";
      if (p.fast >= 20) insight = "Autophagy Focus: Long fasts (20h+) are linked to deeper cellular repair and significant metabolic switching to fat-burning.";
      else if (p.fast >= 16) insight = "Fat-Burning Zone: 16 hours is the classic threshold where insulin levels drop low enough to facilitate fat oxidation.";
      else insight = "Circadian Rhythm: Short fasts are excellent for improving sleep quality and reducing late-night insulin spikes.";

      return { fastStart: format(startTime, "h:mm aa"), fastEnd: format(fastEnds, "h:mm aa"), eatEnd: format(eatEnds, "h:mm aa"), fastHours: p.fast, eatHours: p.eat, insight };
    } catch { return null; }
  }, [lastMeal, protocol]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={<SeoBlock title="Intermittent Fasting Schedules" intro="Optimize your metabolic health by scheduling your eating windows." faqs={[{ q: "Drink water?", a: "Yes, black coffee and water are allowed." }]} />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Protocol</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
            <div><Label>Schedule</Label>
              <Select value={protocol} onValueChange={(v) => setProtocol(v as any)}>
                <SelectTrigger className="mt-2 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.keys(PROTOCOLS).map((k) => <SelectItem key={k} value={k}>{PROTOCOLS[k as keyof typeof PROTOCOLS].label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Finish Last Meal At</Label><Input type="time" value={lastMeal} onChange={(e) => setLastMeal(e.target.value)} className="mt-2 text-lg font-bold" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {results && (
            <>
              <ResultGrid cols={2}>
                <ResultStat label="Fast Ends" value={results.fastEnd} sub="Eating window begins" accent />
                <ResultStat label="Fast Starts" value={results.fastStart} sub="Window closed" />
              </ResultGrid>

              {/* Fasting Insight */}
              <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-health-soft border-health text-health">
                <div className="shrink-0 mt-0.5"><Zap className="size-5" /></div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Metabolic Insight</h4>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{results.insight}</p>
                </div>
              </div>

              <div className="surface-card p-6">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Biological Cycle</h3>
                <div className="flex h-10 rounded-xl overflow-hidden border border-border/50">
                  <div className="bg-health text-white flex items-center justify-center font-mono text-[9px] font-bold" style={{ width: `${(results.fastHours / 24) * 100}%` }}>FAST ({results.fastHours}h)</div>
                  <div className="bg-secondary text-muted-foreground flex items-center justify-center font-mono text-[9px] font-bold" style={{ width: `${(results.eatHours / 24) * 100}%` }}>EAT ({results.eatHours}h)</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default FastingCalculator;
