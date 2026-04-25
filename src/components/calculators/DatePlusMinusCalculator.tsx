"use client";

import { useMemo, useState } from "react";
import { format, addDays, subDays, isWeekend } from "date-fns";
import { Share, CheckCircle2, CalendarDays, Info, Briefcase } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("date-plus-minus-calculator")!;

const DatePlusMinusCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [date, setDate] = useUrlState<string>("sd", "2024-01-01");
  const [amount, setAmount] = useUrlState<number>("n", 30);
  const [mode, setMode] = useUrlState<"add" | "sub">("m", "add");
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      let current = new Date(date);
      if (isNaN(current.getTime())) return null;

      if (!skipWeekends) {
        current = mode === "add" ? addDays(current, amount) : subDays(current, amount);
      } else {
        let count = 0;
        while (count < amount) {
          current = mode === "add" ? addDays(current, 1) : subDays(current, 1);
          if (!isWeekend(current)) count++;
        }
      }
      
      let insight = "";
      if (skipWeekends) insight = "Business Cycle: Your calculation excludes Saturdays and Sundays. This is ideal for defining project milestones or legal response windows.";
      else if (amount >= 30) insight = "Standard Horizon: Your calculation includes all calendar days. The result precisely accounts for varying month lengths.";
      else insight = "Operational Timeline: Accurate for immediate logistics, event tracking, or personal scheduling.";

      return { 
        date: format(current, "EEEE, MMMM do, yyyy"), 
        weekday: format(current, "EEEE"), 
        week: format(current, "I"), 
        dayOfYear: format(current, "DDD"), 
        isWeekend: isWeekend(current),
        insight 
      };
    } catch { return null; }
  }, [date, amount, mode, skipWeekends]);

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
      seoContent={<SeoBlock title="Event and Deadline Sequencing" intro="Forecast future dates or audit past events with calendar precision." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Date Control</h3>
             <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-utility hover:text-white transition flex items-center gap-1 font-mono">
                {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
                {copied ? "COPIED" : "SHARE"}
             </button>
          </div>
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="add">Add Time</TabsTrigger><TabsTrigger value="sub">Subtract</TabsTrigger></TabsList>
          </Tabs>
          <div className="space-y-5">
            <div><Label>Starting Point</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2" /></div>
            <div><Label>Offset Value (Days)</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" />
              <div className="flex flex-wrap gap-2 mt-4">
                {[7, 14, 30, 90].map(v => <button key={v} onClick={() => setAmount(v)} className="px-2 py-1 rounded bg-secondary text-[10px] font-bold hover:bg-utility hover:text-white transition">{v} days</button>)}
              </div>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
               <div className="space-y-0.5">
                  <Label>Exclude Weekends</Label>
                  <p className="text-[10px] text-muted-foreground italic">Count only Mon-Fri</p>
               </div>
               <Switch checked={skipWeekends} onCheckedChange={setSkipWeekends} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              <ResultGrid cols={1}>
                <ResultStat label={mode === "add" ? "Calculated Target Date" : "Calculated History Date"} value={result.date} accent sub={result.isWeekend ? "(Weekend)" : "(Working Day)"} />
              </ResultGrid>
              
              <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-utility-soft border-utility text-utility">
                <div className="shrink-0 mt-0.5"><Briefcase className="size-5" /></div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Time Horizon Insight</h4>
                  <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <ResultStat label="Calendar Day" value={result.weekday} />
                <ResultStat label="ISO Week" value={result.week} />
                <ResultStat label="Year Day #" value={result.dayOfYear} />
              </div>
            </>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default DatePlusMinusCalculator;
