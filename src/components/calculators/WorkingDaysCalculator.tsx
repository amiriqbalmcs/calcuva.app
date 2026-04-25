"use client";

import { useMemo, useState } from "react";
import { format, differenceInCalendarDays, eachDayOfInterval, isWeekend } from "date-fns";
import { Share, CheckCircle2, Briefcase, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("business-working-days-calculator")!;

const WorkingDaysCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [start, setStart] = useUrlState<string>("sd", "2026-01-01");
  const [end, setEnd] = useUrlState<string>("ed", "2026-02-01");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      if (e < s) return null;
      const total = differenceInCalendarDays(e, s);
      const interval = eachDayOfInterval({ start: s, end: e });
      const working = interval.filter(d => !isWeekend(d)).length;
      const weekends = interval.length - working;
      
      let insight = "";
      const ratio = (working / (total || 1)) * 100;
      if (ratio < 70) insight = "Heavy Weekend Overlap: Over 30% of your requested duration falls on weekends. Expect significant project latency if working with a standard 5-day team.";
      else if (total > 30) insight = "Long-Term Schedule: For task planning over 30 days, ensure you manually subtract relevant national bank holidays not covered by this weekend-only filter.";
      else insight = "Business Standard: Your working-to-calendar ratio is healthy. This timeframe aligns well with standard sprint or project delivery cycles.";

      return { working, total, weekends, insight, ratio };
    } catch { return null; }
  }, [start, end]);

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
      seoContent={<SeoBlock title="Business and Productivity Planning" intro="Calculate business days between any two dates globally." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Date Window</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-utility hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
            <div><Label>Start Date</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-2" /></div>
            <div><Label>End Date</Label><Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-2" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              <ResultGrid cols={2}>
                <ResultStat label="Working Days" value={result.working} accent sub="Weekdays only" />
                <ResultStat label="Calendar Days" value={result.total} />
              </ResultGrid>

              {/* Planning Insight */}
              <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-utility-soft border-utility text-utility">
                <div className="shrink-0 mt-0.5"><Briefcase className="size-5" /></div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Planning Insight</h4>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="surface-card p-5">
                   <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Weekends</div>
                   <div className="text-lg font-bold text-destructive">{result.weekends} <span className="text-xs font-normal opacity-60">days</span></div>
                </div>
                <div className="surface-card p-5">
                   <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Work Ratio</div>
                   <div className="text-lg font-bold">{result.ratio.toFixed(1)}%</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default WorkingDaysCalculator;
