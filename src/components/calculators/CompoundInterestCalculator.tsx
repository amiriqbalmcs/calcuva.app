"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PiggyBank, Copy, CheckCircle2 } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("compound-interest-calculator")!;

const CompoundInterestCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [principal, setPrincipal] = useUrlState<number>("p", 10000);
  const [addition, setAddition] = useUrlState<number>("a", 500);
  const [years, setYears] = useUrlState<number>("y", 10);
  const [rate, setRate] = useUrlState<number>("r", 8);
  const [frequency, setFrequency] = useUrlState<number>("f", 12); // Compounding frequency (e.g., 12 for monthly)
  const [copied, setCopied] = useState(false);

  // Recharts requires stable data arrays
  const data = useMemo(() => {
    const points: { year: number; principal: number; interest: number; balance: number }[] = [];
    const r = rate / 100;
    const n = frequency;
    
    let currentPrincipal = principal;
    // For simplicity, we assume contributions happen at the same frequency as compounding.
    // If compounding is monthly (12), addition is monthly.
    // Let's assume addition is always monthly for standard consumer expectations.
    const monthlyAddition = addition;
    
    for (let y = 1; y <= years; y++) {
      let balance = principal * Math.pow(1 + r / n, n * y);
      
      // Future value of a series for the contributions
      // To handle monthly contributions with any compounding frequency precisely is complex,
      // but standard financial calculators use PMT formulas. 
      // Simplified: Additions happen monthly. Compounding happens 'n' times a year.
      // Usually, if compounding is monthly, n=12.
      // Let's do a month-by-month step to be 100% accurate.
      let runningBalance = principal;
      let totalPrincipal = principal;
      let totalInterest = 0;
      
      // We will re-calculate from year 0 to 'y' using step method
      // Actually doing it year by year inside this loop:
      runningBalance = principal;
      totalPrincipal = principal;
      
      let monthsPassed = y * 12;
      for (let m = 1; m <= monthsPassed; m++) {
         totalPrincipal += monthlyAddition;
         runningBalance += monthlyAddition;
         
         // Apply interest based on frequency
         if (frequency === 12) {
           runningBalance += runningBalance * (r / 12);
         } else if (frequency === 1 && m % 12 === 0) {
           runningBalance += runningBalance * r;
         } else if (frequency === 4 && m % 3 === 0) {
           runningBalance += runningBalance * (r / 4);
         } else if (frequency === 365) {
           // Approximate daily
           runningBalance += runningBalance * (r / 12); // using monthly avg for daily is close enough for simple plot, but let's be precise if needed. Actually:
           // daily compounding on a monthly balance:
           // r * (days_in_month/365)
           // For simplicity let's stick to true formula:
         }
      }
      
      // Let's just use the accurate standard FV formulas instead of loops to be perfectly precise.
      const months = y * 12;
      let fvPrincipal = principal * Math.pow(1 + r / n, n * y);
      
      // If adding monthly:
      let fvAdditions = 0;
      if (addition > 0) {
        if (n === 12) {
          // Standard monthly compounding
          fvAdditions = addition * ((Math.pow(1 + r/12, months) - 1) / (r/12));
        } else {
          // Effective rate per month
          const effectiveAnnualRate = Math.pow(1 + r/n, n) - 1;
          const effectiveMonthlyRate = Math.pow(1 + effectiveAnnualRate, 1/12) - 1;
          fvAdditions = effectiveMonthlyRate > 0 ? addition * ((Math.pow(1 + effectiveMonthlyRate, months) - 1) / effectiveMonthlyRate) : addition * months;
        }
      }
      
      const finalBalance = fvPrincipal + fvAdditions;
      const finalPrincipal = principal + (addition * months);
      
      points.push({
        year: y,
        principal: finalPrincipal,
        interest: finalBalance - finalPrincipal,
        balance: finalBalance
      });
    }
    return points;
  }, [principal, addition, years, rate, frequency]);

  const last = data[data.length - 1] ?? { principal: 0, balance: 0, interest: 0 };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Compound Interest Results:\nInitial Principal: ${formatCurrency(principal, currency)}\nMonthly Addition: ${formatCurrency(addition, currency)}\nYears: ${years} at ${rate}%\n\nTotal Principal: ${formatCurrency(last.principal, currency)}\nTotal Interest: ${formatCurrency(last.interest, currency)}\nFinal Balance: ${formatCurrency(last.balance, currency)}\nCalculated on Calcuva.app`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border mt-0 lg:mt-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <PiggyBank className="size-5 text-signal" />
               Inputs
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Initial Principal</Label>
                  <span className="text-sm font-mono text-muted-foreground">{formatCurrency(principal, currency)}</span>
                </div>
                <Input type="number" min={0} value={principal || ""} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} className="font-mono text-lg" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Monthly Addition</Label>
                  <span className="text-sm font-mono text-muted-foreground">{formatCurrency(addition, currency)}</span>
                </div>
                <Input type="number" min={0} value={addition || ""} onChange={(e) => setAddition(Number(e.target.value) || 0)} className="font-mono text-lg" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Interest Rate (%)</Label>
                  <span className="text-sm font-mono text-signal font-bold">{rate}%</span>
                </div>
                <Slider value={[rate]} min={1} max={30} step={0.1} onValueChange={([v]) => setRate(v)} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Years to Grow</Label>
                  <span className="text-sm font-mono text-muted-foreground">{years} yrs</span>
                </div>
                <Slider value={[years]} min={1} max={50} step={1} onValueChange={([v]) => setYears(v)} />
              </div>

              <div className="space-y-3">
                <Label>Compound Frequency</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setFrequency(1)} className={cn("py-2 px-3 text-sm rounded-xl border transition-all", frequency === 1 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Annually</button>
                  <button onClick={() => setFrequency(12)} className={cn("py-2 px-3 text-sm rounded-xl border transition-all", frequency === 12 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Monthly</button>
                  <button onClick={() => setFrequency(4)} className={cn("py-2 px-3 text-sm rounded-xl border transition-all", frequency === 4 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Quarterly</button>
                  <button onClick={() => setFrequency(365)} className={cn("py-2 px-3 text-sm rounded-xl border transition-all", frequency === 365 ? "bg-signal text-white border-signal font-bold" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>Daily</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <ResultGrid>
            <ResultStat label="Final Balance" value={formatCurrency(last.balance, currency)} className="bg-signal/10" valueClassName="text-signal" />
            <ResultStat label="Total Principal" value={formatCurrency(last.principal, currency)} />
            <ResultStat label="Total Interest" value={formatCurrency(last.interest, currency)} />
            <div className="col-span-2 pt-2">
              <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-sm font-bold text-foreground hover:bg-secondary/80 transition-colors">
                {copied ? <><CheckCircle2 className="size-4 text-green-500" /> Copied</> : <><Copy className="size-4" /> Copy Results</>}
              </button>
            </div>
          </ResultGrid>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <h3 className="font-bold mb-6 text-lg">Balance Projection</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} tickMargin={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} stroke="hsl(var(--muted-foreground))" width={60} />
                  <Tooltip 
                     formatter={(value: any) => formatCurrency(Number(value) || 0, currency)}
                     labelFormatter={(label) => `Year ${label}`}
                     contentStyle={{ borderRadius: "16px", border: "1px solid hsl(var(--border))", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Area type="monotone" dataKey="principal" stackId="1" stroke="#94a3b8" fill="url(#colorPrincipal)" name="Total Principal" strokeWidth={2} />
                  <Area type="monotone" dataKey="interest" stackId="1" stroke="#3b82f6" fill="url(#colorInterest)" name="Total Interest" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
    </CalculatorPage>
  );
}

export default CompoundInterestCalculator;
