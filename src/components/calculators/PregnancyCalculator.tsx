"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, Baby, Info, Heart } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("pregnancy-ovulation-calculator")!;
const fmtDate = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "long", day: "numeric" });

const PregnancyCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [lmp, setLmp] = useUrlState<string>("d", "2026-01-01");
  const [cycle, setCycle] = useUrlState<number>("cy", 28);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return null;
    const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
    const conception = new Date(lmpDate.getTime() + (cycle - 14) * 24 * 60 * 60 * 1000);
    const ovulation = conception;
    const fertileStart = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000);
    const fertileEnd = new Date(ovulation.getTime() + 1 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysSinceLmp = Math.floor((now.getTime() - lmpDate.getTime()) / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(daysSinceLmp / 7);
    const days = daysSinceLmp % 7;
    const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    const daysToDue = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    let insight = "";
    if (trimester === 1) insight = "First Trimester: Vital organs are forming. Focus on prenatal vitamins and rest. Morning sickness is common.";
    else if (trimester === 2) insight = "Second Trimester: The 'golden period'. Energy often returns, and regular baby movements begin.";
    else insight = "Third Trimester: Peak growth phase. Prepare your birth plan and rest frequently.";

    return { dueDate, conception, ovulation, fertileStart, fertileEnd, weeks, days, trimester, daysToDue, daysSinceLmp, insight };
  }, [lmp, cycle]);

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
      seoContent={<SeoBlock title="Pregnancy and Ovulation Roadmap" intro="Calculate due dates and fertile windows using Naegele's rule." faqs={[{ q: "Due date?", a: "Estimated at 280 days from LMP." }]} />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Entry Stats</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
            <div><Label>Last Period First Day (LMP)</Label><Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="mt-2" /></div>
            <div><Label>Cycle Length (Days)</Label><Input type="number" value={cycle} onChange={(e) => setCycle(Number(e.target.value) || 28)} className="mt-2" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              <ResultGrid cols={2}>
                <ResultStat label="Estimated Due Date" value={fmtDate(result.dueDate)} accent sub={`${result.daysToDue} days remaining`} />
                <ResultStat label="Current Progress" value={`${result.weeks}w ${result.days}d`} sub={`Trimester ${result.trimester}`} />
              </ResultGrid>

              {/* Pregnancy Insight */}
              <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-health-soft border-health text-health">
                <div className="shrink-0 mt-0.5"><Baby className="size-5" /></div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Development Insight</h4>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="surface-card p-5">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Fertile Highlights</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span>Peak Ovulation</span><span className="font-bold">{fmtDate(result.ovulation)}</span></div>
                    <div className="flex justify-between"><span>Conception Range</span><span className="font-bold">{fmtDate(result.conception)}</span></div>
                  </div>
                </div>
                <div className="surface-card p-5 flex flex-col justify-center">
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-health" style={{ width: `${Math.min(100, Math.max(0, (result.daysSinceLmp / 280) * 100))}%` }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono mt-2 uppercase opacity-50"><span>W0</span><span>W13</span><span>W27</span><span>W40</span></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default PregnancyCalculator;
