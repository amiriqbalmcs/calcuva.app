"use client";

import { useMemo, useState } from "react";
import { Share, CheckCircle2, Receipt, Info, Plus, Trash2 } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useCurrency } from "@/context/CurrencyContext";

const calc = calculatorBySlug("income-tax-calculator")!;

const REGIMES = {
  US: { label: "United States (Federal)", standard: 14600, brackets: [{ upTo: 11600, rate: 0.10 }, { upTo: 47150, rate: 0.12 }, { upTo: 100525, rate: 0.22 }, { upTo: 191950, rate: 0.24 }, { upTo: 243725, rate: 0.32 }, { upTo: 609350, rate: 0.35 }, { upTo: Infinity, rate: 0.37 }] },
  UK: { label: "United Kingdom", standard: 12570, brackets: [{ upTo: 37700, rate: 0.20 }, { upTo: 125140, rate: 0.40 }, { upTo: Infinity, rate: 0.45 }] },
  IN: { label: "India (New Regime)", standard: 75000, brackets: [{ upTo: 300000, rate: 0 }, { upTo: 700000, rate: 0.05 }, { upTo: 1000000, rate: 0.10 }, { upTo: 1200000, rate: 0.15 }, { upTo: 1500000, rate: 0.20 }, { upTo: Infinity, rate: 0.30 }] },
  CUSTOM: { label: "Universal / Custom", standard: 0, brackets: [] }
};

type RegimeKey = keyof typeof REGIMES;

const SalaryTaxCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const { currency } = useCurrency();
  const [regime, setRegime] = useUrlState<RegimeKey>("rg", "US");
  const [income, setIncome] = useUrlState<number>("inc", 85000);
  const [otherDeductions, setOtherDeductions] = useUrlState<number>("ded", 0);
  const [customStandard, setCustomStandard] = useUrlState<number>("cstd", 0);
  const [customBracketsStr, setCustomBracketsStr] = useUrlState<string>("cb", JSON.stringify([{ upTo: 20000, rate: 0.1 }, { upTo: 50000, rate: 0.2 }, { upTo: Infinity, rate: 0.3 }]));
  const [copied, setCopied] = useState(false);

  const customBrackets = useMemo(() => {
    try { return JSON.parse(customBracketsStr); } catch { return []; }
  }, [customBracketsStr]);

  const result = useMemo(() => {
    const isCustom = regime === "CUSTOM";
    const standard = isCustom ? customStandard : REGIMES[regime].standard;
    const brackets = isCustom ? customBrackets : REGIMES[regime].brackets;

    const taxable = Math.max(0, income - (Number(standard) || 0) - otherDeductions);
    let tax = 0;
    let prev = 0;
    const breakdown = [];

    for (const b of brackets) {
      if (taxable <= prev) break;
      const upTo = b.upTo ?? Infinity;
      const taxedHere = Math.min(taxable, upTo) - prev;
      tax += taxedHere * b.rate;
      
      const rangeStart = (Number(prev) || 0).toLocaleString();
      const rangeEnd = upTo === Infinity ? "∞" : (Number(upTo) || 0).toLocaleString();
      
      breakdown.push({ 
        range: `${rangeStart} – ${rangeEnd}`, 
        amount: taxedHere, 
        rate: b.rate, 
        tax: taxedHere * b.rate 
      });
      prev = upTo;
    }

    const net = income - tax;
    const effective = income > 0 ? (tax / income) * 100 : 0;
    
    let insight = "";
    if (effective > 30) insight = "Global High-Tax: Your effective rate is over 30%. This is typical for high earners in developed nations. Seek localized tax advice for legal deductions.";
    else if (effective > 15) insight = "Progressive Average: You are in the mid-tier of global tax brackets. Your contributions support public infrastructure and services.";
    else insight = "Optimized / Low-Rate: Your tax burden is low relative to income, common in emerging markets or through effective standard deductions.";

    return { taxable, tax, net, effective, breakdown, monthly: net / 12, insight };
  }, [income, regime, otherDeductions, customStandard, customBrackets]);

  const updateBracket = (idx: number, patch: any) => {
    const next = [...customBrackets];
    next[idx] = { ...next[idx], ...patch };
    setCustomBracketsStr(JSON.stringify(next));
  };

  const addBracket = () => setCustomBracketsStr(JSON.stringify([...customBrackets, { upTo: Infinity, rate: 0.25 }]));
  const removeBracket = (idx: number) => setCustomBracketsStr(JSON.stringify(customBrackets.filter((_: any, i: number) => i !== idx)));

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
          title="Universal Income Tax Planning" 
          intro="Calculate net salary for any country using manual or regional tax brackets." 
          faqs={[
            { q: "What is Net Salary?", a: "Net salary, also known as take-home pay, is the amount of income an employee receives after all mandatory taxes, social security contributions, and other deductions are subtracted from the gross salary." },
            { q: "What is a Progressive Tax System?", a: "A progressive tax system is one where the tax rate increases as the taxable amount increases. This is usually implemented through 'tax brackets' where higher slices of income are taxed at higher percentages." },
            { q: "How do deductions reduce my tax?", a: "Deductions are specific expenses or allowances that you can subtract from your gross income. This lowers your 'Taxable Income,' which can sometimes push you into a lower tax bracket and always reduces the total tax owed." }
          ]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="surface-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Global Settings</h3>
              <button onClick={handleShare} className="p-1 px-2 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-finance hover:text-white transition flex items-center gap-1">
                {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
                {copied ? "COPIED" : "SHARE"}
              </button>
            </div>

            <div className="space-y-4">
              <div><Label>Country / Regime</Label>
                <Select value={regime} onValueChange={(v) => setRegime(v as RegimeKey)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>{(Object.keys(REGIMES) as RegimeKey[]).map(k => <SelectItem key={k} value={k}>{REGIMES[k].label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><div className="flex justify-between mb-2"><Label>Annual Gross Income</Label><span className="font-mono text-xs font-bold text-finance">{formatCurrency(income, currency)}</span></div>
                <Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value) || 0)} className="text-lg font-bold" />
              </div>
              
              {regime === "CUSTOM" && (
                <div><div className="flex justify-between mb-2"><Label>Standard Tax-Free Allowance</Label><span className="font-mono text-xs font-bold">{formatCurrency(customStandard, currency)}</span></div>
                  <Input type="number" value={customStandard} onChange={(e) => setCustomStandard(Number(e.target.value) || 0)} />
                </div>
              )}
            </div>
          </div>

          {regime === "CUSTOM" && (
            <div className="surface-card p-6 space-y-4">
               <div className="flex items-center justify-between">
                 <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Custom Brackets</h3>
                 <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={addBracket}><Plus className="size-3 mr-1" /> Add</Button>
               </div>
               <div className="space-y-3">
                 {customBrackets.map((b: any, i: number) => (
                   <div key={i} className="flex gap-2 items-center">
                     <div className="flex-1"><Label className="text-[9px] uppercase opacity-50">Up To</Label><Input type="number" value={b.upTo === Infinity ? "" : b.upTo} placeholder="∞" onChange={(e) => updateBracket(i, { upTo: e.target.value === "" ? Infinity : Number(e.target.value) })} className="h-8 text-xs" /></div>
                     <div className="w-16"><Label className="text-[9px] uppercase opacity-50">Rate %</Label><Input type="number" value={Math.round(b.rate * 100)} onChange={(e) => updateBracket(i, { rate: Number(e.target.value) / 100 })} className="h-8 text-xs" /></div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 mt-4" onClick={() => removeBracket(i)}><Trash2 className="size-3 text-destructive" /></Button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ResultGrid cols={2}>
            <ResultStat label="Net Salary (Year)" value={formatCurrency(result.net, currency)} accent />
            <ResultStat label="Effective Tax rate" value={`${result.effective.toFixed(1)}%`} />
          </ResultGrid>

          {/* Tax Insight */}
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-finance-soft border-finance text-finance">
            <div className="shrink-0 mt-0.5"><Receipt className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Fiscal Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
            </div>
          </div>

          <div className="surface-card overflow-hidden">
             <div className="p-5 border-b border-border bg-secondary/20 flex justify-between items-center">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Progression Breakdown</h3>
               <span className="text-[10px] font-mono opacity-50">MONTHLY: {formatCurrency(result.monthly, currency)}</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="bg-secondary/10 text-[9px] uppercase font-bold text-muted-foreground">
                   <tr><th className="text-left px-6 py-3">Income Slice</th><th className="text-right px-6 py-3">Rate</th><th className="text-right px-6 py-3">Tax Amount</th></tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {result.breakdown.map((b, i) => (
                     <tr key={i} className="hover:bg-secondary/5 transition">
                       <td className="px-6 py-3 font-mono text-xs">{b.range}</td>
                       <td className="px-6 py-3 text-right font-bold">{(b.rate * 100).toFixed(0)}%</td>
                       <td className="px-6 py-3 text-right tabular-nums">{formatCurrency(b.tax, currency)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default SalaryTaxCalculator;
