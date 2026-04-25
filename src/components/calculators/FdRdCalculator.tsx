"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, PiggyBank, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("fixed-deposit-calculator")!;

const COMPOUND_PERIODS = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Half-Yearly", value: 2 },
  { label: "Yearly", value: 1 },
];

const FdRdCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [mode, setMode] = useUrlState<"fd" | "rd">("m", "fd");
  const [amount, setAmount] = useUrlState<number>("iv", 50000);
  const [rate, setRate] = useUrlState<number>("r", 7.5);
  const [years, setYears] = useUrlState<number>("y", 5);
  const [compounding, setCompounding] = useUrlState<number>("cp", 4);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100;
    const n = compounding;
    const t = years;

    if (mode === "fd") {
      const maturity = amount * Math.pow(1 + r / n, n * t);
      const interest = maturity - amount;
      let insight = "";
      if (interest > amount) insight = "Yield Mastery: Your earned interest exceeds your original principal. This only happens with high discipline and long-term time deposits.";
      else if (interest > amount * 0.3) insight = "Portfolio Boost: Your savings have grown by over 30%. Maintaining this rate will significantly outperform standard inflation.";
      else insight = "Capital Safety: Your principal is protected while generating guaranteed yield. Consider extending the tenure to cross the 50% growth mark.";
      return { maturity, interest, invested: amount, insight };
    } else {
      let maturity = 0;
      const totalMonths = t * 12;
      for (let m = 1; m <= totalMonths; m++) {
        const timeRemaining = (totalMonths - m + 1) / 12;
        maturity += amount * Math.pow(1 + r / n, n * timeRemaining);
      }
      const invested = amount * totalMonths;
      const interest = maturity - invested;
      let insight = "";
      if (interest > invested * 0.4) insight = "Habit-Driven Wealth: Your recurring deposits are generating massive leverage. This automated saving style is the most reliable way to build a corpus.";
      else insight = "Consistent Saver: Regular contributions are creating a guaranteed safety net. You are successfully automating your future wealth.";
      return { maturity, interest, invested, insight };
    }
  }, [mode, amount, rate, years, compounding]);

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
      seoContent={<SeoBlock title="Guaranteed Yield Savings" intro="Plan time deposits or recurring savings plans with accurate compounding arithmetic." />}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Savings Type</h3>
            <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-health hover:text-white transition flex items-center gap-1 font-mono">
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE"}
            </button>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="fd">Fixed</TabsTrigger>
              <TabsTrigger value="rd">Recurring</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4 pt-2">
            <div><Label>{mode === "fd" ? "Initial Deposit" : "Monthly Installment"}</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="mt-2 text-lg font-bold" /></div>
            <div><Label>Interest Rate (% p.a.)</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} className="mt-2" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tenure (Years)</Label><Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} className="mt-2" /></div>
              <div><Label>Compounding</Label>
                <Select value={compounding.toString()} onValueChange={(v) => setCompounding(Number(v))}>
                  <SelectTrigger className="mt-2 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{COMPOUND_PERIODS.map((p) => <SelectItem key={p.value} value={p.value.toString()}>{p.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Maturity Value" value={formatCurrency(result.maturity, currency)} accent />
            <ResultStat label="Total Interest" value={formatCurrency(result.interest, currency)} />
          </ResultGrid>

          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-health-soft border-health text-health">
            <div className="shrink-0 mt-0.5"><PiggyBank className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Savings Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="surface-card p-5">
               <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Contributions</div>
               <div className="text-lg font-bold">{formatCurrency(result.invested, currency)}</div>
             </div>
             <div className="surface-card p-5">
               <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Interest Weight</div>
               <div className="text-lg font-bold">{((result.interest / result.maturity) * 100).toFixed(1)}%</div>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default FdRdCalculator;
