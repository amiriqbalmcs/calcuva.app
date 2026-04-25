"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Share, CheckCircle2, Flame, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatCompact } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("retirement-fire-calculator")!;

const RetirementFireCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [currentAge, setCurrentAge] = useUrlState<number>("age", 30);
  const [retireAge, setRetireAge] = useUrlState<number>("ret", 60);
  const [currentSavings, setCurrentSavings] = useUrlState<number>("sav", 50000);
  const [monthlyContribution, setMonthlyContribution] = useUrlState<number>("ms", 1000);
  const [expectedReturn, setExpectedReturn] = useUrlState<number>("r", 8);
  const [monthlyExpensesAtRetirement, setMonthlyExpensesAtRetirement] = useUrlState<number>("ex", 3000);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const years = Math.max(1, retireAge - currentAge);
    const r = expectedReturn / 100 / 12;
    const n = years * 12;

    const fvSavings = currentSavings * Math.pow(1 + r, n);
    const fvContrib = r === 0 ? monthlyContribution * n : monthlyContribution * (Math.pow(1 + r, n) - 1) / r;

    const totalCorpus = fvSavings + fvContrib;
    const fireNumber = monthlyExpensesAtRetirement * 12 * 25;
    
    const data = [];
    let balance = currentSavings;
    for (let y = 0; y <= years; y++) {
      data.push({ age: currentAge + y, balance });
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + (expectedReturn / 100 / 12)) + monthlyContribution;
      }
    }

    let insight = "";
    let status: "ready" | "near" | "gap" = "gap";
    if (totalCorpus >= fireNumber) {
      status = "ready";
      insight = "Fully Independent: Your projected corpus exceeds your 25x FIRE number. You are set for a perpetual retirement.";
    } else if (totalCorpus >= fireNumber * 0.7) {
      status = "near";
      insight = "Nearly There: You are at 70%+ of your target. A small increase in savings or delaying retirement by 2 years will bridge the gap.";
    } else {
      insight = "Savings Gap: Your current plan has a shortfall. Consider increasing contributions or targeting a higher return asset class.";
    }

    return { totalCorpus, fireNumber, data, insight, status };
  }, [currentAge, retireAge, currentSavings, monthlyContribution, expectedReturn, monthlyExpensesAtRetirement]);

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
          title="The Road to Financial Independence"
          intro="Retirement planning is about sustainability. The FIRE movement has shown that with aggressive saving and smart investing, financial independence can be achieved early."
          sections={[
            { heading: "The 4% Rule", icon: "info", body: <p>If you withdraw 4% of your portfolio annually, your money is likely to last 30+ years. Multiply annual expenses by 25 to find your 'Number'.</p> },
          ]}
          faqs={[{ q: "What about inflation?", a: "We recommend using a 'Real Rate of Return' (Nominal Return - Inflation) for accuracy." }]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 surface-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Plan Config</h3>
            <button 
              onClick={handleShare}
              className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-signal hover:text-white transition flex items-center gap-1"
            >
              {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
              {copied ? "COPIED" : "SHARE PLAN"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Current Age</Label><Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value) || 0)} className="mt-2" /></div>
              <div><Label>Retire Age</Label><Input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value) || 0)} className="mt-2" /></div>
            </div>
            <div><div className="flex justify-between mb-2"><Label>Current Savings</Label><span className="font-mono text-xs font-bold">{formatCurrency(currentSavings, currency)}</span></div>
              <Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)} />
            </div>
            <div><div className="flex justify-between mb-2"><Label>Monthly Contribution</Label><span className="font-mono text-xs font-bold text-signal">{formatCurrency(monthlyContribution, currency)}</span></div>
              <Input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Exp. Return (%)</Label><Input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)} className="mt-2" /></div>
              <div><Label>Target Expense/mo</Label><Input type="number" value={monthlyExpensesAtRetirement} onChange={(e) => setMonthlyExpensesAtRetirement(Number(e.target.value) || 0)} className="mt-2" /></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Estimated Corpus" value={formatCurrency(stats.totalCorpus, currency)} sub={`At age ${retireAge}`} accent />
            <ResultStat label="FIRE Number" value={formatCurrency(stats.fireNumber, currency)} sub="25x annual expenses" />
          </ResultGrid>
          
          {/* FIRE Insight */}
          <div className={cn(
            "p-5 rounded-xl flex gap-4 items-start border-l-4",
            stats.status === "ready" && "bg-health/5 border-health text-health",
            stats.status === "near" && "bg-yellow-500/5 border-yellow-500 text-yellow-500",
            stats.status === "gap" && "bg-signal/5 border-signal text-signal"
          )}>
            <div className="shrink-0 mt-0.5">
              <Flame className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Financial Independence Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{stats.insight}</p>
            </div>
          </div>

          <div className="surface-card p-6">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest font-mono">Portfolio Projection</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.data}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--signal))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--signal))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => formatCompact(v)} />
                  <Tooltip formatter={(v: any) => [formatCurrency(v, currency), "Balance"]} labelFormatter={(l) => `Age ${l}`} />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--signal))" fillOpacity={1} fill="url(#colorBal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default RetirementFireCalculator;
