"use client";

import { useMemo, useState, useEffect } from "react";
import { Share, CheckCircle2, Calendar, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("age-calculator-date-of-birth")!;

const AgeCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [birth, setBirth] = useUrlState<string>("b", "1995-06-15");
  const [target, setTarget] = useUrlState<string>("t", "2024-01-01");
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const result = useMemo(() => {
    const b = new Date(birth);
    const t = new Date(target);
    if (isNaN(b.getTime()) || isNaN(t.getTime()) || t < b) return null;

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(totalMs / 86400000);
    const totalHours = Math.floor(totalMs / 3600000);
    const totalMinutes = Math.floor(totalMs / 60000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const nextBday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysToBday = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
    const liveSeconds = Math.floor((now.getTime() - b.getTime()) / 1000);

    let insight = "";
    if (daysToBday === 0) insight = "Happy Birthday! Today is your day. Enjoy the milestone.";
    else if (daysToBday < 7) insight = "Birthday Week: Only a few days left! Start the celebration countdown.";
    else if (totalDays > 10000) insight = "10k Club: You have lived over 10,000 days. That is roughly 240,000 hours of memories.";
    else insight = "Time Horizon: Every day is a chance to build something new. Make those minutes count.";

    return { years, months, days, totalDays, totalHours, totalMinutes, totalWeeks, totalMonths, daysToBday, liveSeconds, insight };
  }, [birth, target, now]);

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
      seoContent={
        <SeoBlock
          title="The Mathematics of Time"
          intro="Age calculation comparison for years, months, days, and seconds."
          sections={[{ heading: "How it works", body: <p>We compare Gregorian calendar segments precisely.</p> }]}
          faqs={[{ q: "Leap years?", a: "Yes, fully accounted for." }]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Date Input</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-utility hover:text-white transition flex items-center gap-1">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>
          <div className="space-y-4">
            <div><Label>Date of Birth</Label><Input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="mt-2" /></div>
            <div><Label>Age at Date</Label><Input type="date" value={target} onChange={(e) => setTarget(e.target.value)} className="mt-2" /></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              <div className="surface-card p-6 sm:p-8 bg-utility-soft border-utility text-utility">
                <div className="text-[10px] font-mono uppercase font-bold tracking-widest mb-3 opacity-70">Duration Summary</div>
                <div className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tighter">
                  {result.years} <span className="text-lg opacity-60">yr</span> {result.months} <span className="text-lg opacity-60">mo</span> {result.days} <span className="text-lg opacity-60">day</span>
                </div>
                <div className="mt-4 text-xs font-mono opacity-80 tabular-nums">Live Counter: {result.liveSeconds.toLocaleString()} seconds</div>
              </div>

              {/* Time Insight */}
              <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-utility-soft border-utility text-utility">
                <div className="shrink-0 mt-0.5"><Calendar className="size-5" /></div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Time Insight</h4>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
                </div>
              </div>

              <ResultGrid cols={4}>
                <ResultStat label="Total Mon" value={result.totalMonths} />
                <ResultStat label="Total Wk" value={result.totalWeeks} />
                <ResultStat label="Total Day" value={result.totalDays} />
                <ResultStat label="Next Bday" value={`${result.daysToBday} d`} />
              </ResultGrid>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default AgeCalculator;
