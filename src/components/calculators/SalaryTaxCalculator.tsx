"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, Receipt, Info, Plus, Trash2, Globe, 
  History, Landmark, Target, Activity, Zap, Ruler, Gauge, 
  Sparkles, LayoutDashboard, Calculator, Wallet, TrendingDown,
  Settings2, Copy, Banknote, BarChart as BarChartIcon, ChevronRight,
  ShieldCheck, ArrowDownRight, Fingerprint
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";

const calc = calculatorBySlug("income-tax-calculator");

const REGIMES = {
  US: { label: "United States (Federal)", standard: 14600, brackets: [{ upTo: 11600, rate: 0.10 }, { upTo: 47150, rate: 0.12 }, { upTo: 100525, rate: 0.22 }, { upTo: 191950, rate: 0.24 }, { upTo: 243725, rate: 0.32 }, { upTo: 609350, rate: 0.35 }, { upTo: Infinity, rate: 0.37 }] },
  UK: { label: "United Kingdom", standard: 12570, brackets: [{ upTo: 37700, rate: 0.20 }, { upTo: 125140, rate: 0.40 }, { upTo: Infinity, rate: 0.45 }] },
  IN: { label: "India (FY 2024-25)", standard: 75000, brackets: [{ upTo: 300000, rate: 0 }, { upTo: 700000, rate: 0.05 }, { upTo: 1000000, rate: 0.10 }, { upTo: 1200000, rate: 0.15 }, { upTo: 1500000, rate: 0.20 }, { upTo: Infinity, rate: 0.30 }] },
  CUSTOM: { label: "Universal / Manual Config", standard: 0, brackets: [] }
};

type RegimeKey = keyof typeof REGIMES;

const SalaryTaxCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
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
    let status: "optimal" | "warning" | "critical" = "optimal";
    if (effective > 35) {
      status = "critical";
      insight = "High Tax Rate: You are paying a high percentage of your income in taxes. You may want to look into tax-saving investments or deductions.";
    } else if (effective > 20) {
      status = "warning";
      insight = "Average Tax Rate: Your tax rate is fairly standard for your income level.";
    } else {
      status = "optimal";
      insight = "Low Tax Rate: You are keeping most of your money! Your tax rate is very efficient.";
    }

    return { taxable, tax, net, effective, breakdown, monthly: net / 12, insight, status };
  }, [income, regime, otherDeductions, customStandard, customBrackets]);

  const updateBracket = (idx: number, patch: any) => {
    const next = [...customBrackets];
    next[idx] = { ...next[idx], ...patch };
    setCustomBracketsStr(JSON.stringify(next));
  };

  const addBracket = () => setCustomBracketsStr(JSON.stringify([...customBrackets, { upTo: Infinity, rate: 0.25 }]));
  const removeBracket = (idx: number) => setCustomBracketsStr(JSON.stringify(customBrackets.filter((_: any, i: number) => i !== idx)));

  const handleCopy = () => {
    const resultText = `Fiscal Audit: ${result.effective.toFixed(1)}% Effective Tax | Net ${formatCurrency(result.net, currency.code)}. Plan your taxes at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Tax Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Your Info</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Jurisdiction */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Location</Label>
                <Select value={regime} onValueChange={(v) => setRegime(v as RegimeKey)}>
                  <SelectTrigger className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    {(Object.keys(REGIMES) as RegimeKey[]).map(k => (
                      <SelectItem key={k} value={k} className="text-[10px] font-bold uppercase tracking-widest">
                        {REGIMES[k].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Annual Income */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Yearly Income</Label>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={income} 
                    onChange={(e) => setIncome(Number(e.target.value) || 0)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Deductions</Label>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={otherDeductions} 
                    onChange={(e) => setOtherDeductions(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-base rounded-lg shadow-sm pr-12"
                  />
                  <ArrowDownRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
              </div>

              {regime === "CUSTOM" && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Standard Deduction</Label>
                  </div>
                  <Input 
                    type="number" 
                    value={customStandard} 
                    onChange={(e) => setCustomStandard(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-base rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {regime === "CUSTOM" && (
            <div className="surface-card p-6 md:p-8 space-y-6 bg-background border-border/30 relative overflow-hidden group">
               <Fingerprint className="absolute -top-4 -right-4 size-20 text-muted-foreground/5 -rotate-12" />
               <div className="flex items-center justify-between relative z-10">
                 <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Custom Tax Rates</h3>
                 <button onClick={addBracket} className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                    <Plus className="size-4" />
                 </button>
               </div>
               <div className="space-y-3 relative z-10">
                 {customBrackets.map((b: any, i: number) => (
                   <div key={i} className="flex gap-2 items-center p-3 rounded-xl bg-secondary/20 border border-border/40 relative group/row hover:border-foreground/20 transition-colors">
                     <div className="flex-1">
                        <Input 
                          type="number" 
                          value={b.upTo === Infinity ? "" : b.upTo} 
                          placeholder="Upper Bound (∞)" 
                          onChange={(e) => updateBracket(i, { upTo: e.target.value === "" ? Infinity : Number(e.target.value) })} 
                          className="h-9 text-[10px] font-bold bg-background border-border/40 rounded-lg pr-8" 
                        />
                     </div>
                     <div className="w-20 relative">
                        <Input 
                          type="number" 
                          value={Math.round(b.rate * 100)} 
                          onChange={(e) => updateBracket(i, { rate: Number(e.target.value) / 100 })} 
                          className="h-9 text-[10px] font-bold bg-background border-border/40 text-center rounded-lg pr-6" 
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground">%</span>
                     </div>
                     <button onClick={() => removeBracket(i)} className="size-6 text-muted-foreground/30 hover:text-destructive transition-colors">
                        <Trash2 className="size-3" />
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Fiscal Insight */}
          <div className={cn(
            "surface-card p-6 border-border/30 relative overflow-hidden group",
            result.status === "critical" ? "bg-destructive/5 text-destructive" : result.status === "warning" ? "bg-amber-500/5 text-amber-500" : "bg-health/5 text-health"
          )}>
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Receipt className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Tax Analysis</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {result.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Calculator className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Wallet className="size-3" />
                    Annual Take-Home Pay
                  </div>
                  <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                    {formatCurrency(result.net, currency.code)}
                  </div>
                </div>
                <button 
                  onClick={handleCopy} 
                  className={cn(
                    "p-3 rounded-xl transition-all border shadow-sm",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                  title="Copy Results"
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Gauge className="size-3 text-health" />
                    Effective Tax Rate
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {result.effective.toFixed(1)}<span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Receipt className="size-3" />
                    Total Tax Paid
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(result.tax, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progression Matrix */}
          <div className="surface-card overflow-hidden bg-secondary/5 border-border/30 relative group shadow-sm">
            <div className="p-8 border-b border-border/40 flex items-center justify-between bg-background/40 backdrop-blur-sm relative overflow-hidden">
               <BarChartIcon className="absolute -top-4 -right-4 size-24 text-muted-foreground/5 -rotate-12" />
               <div className="space-y-1 relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tax Breakdown</h4>
                  <p className="text-sm font-bold tracking-tight">How Your Tax Is Calculated</p>
               </div>
               <div className="text-right relative z-10">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">Monthly Take-Home</span>
                  <div className="text-xl font-mono font-medium text-foreground">{formatCurrency(result.monthly, currency.code)}</div>
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-background/20 text-[9px] uppercase font-bold text-muted-foreground border-b border-border/40">
                  <tr>
                    <th className="px-8 py-5">Income Bracket ({currency.code})</th>
                    <th className="px-8 py-5 text-center">Tax Rate</th>
                    <th className="px-8 py-5 text-right">Tax Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {result.breakdown.map((b, i) => (
                    <tr key={i} className="hover:bg-foreground/[0.02] transition-colors group/row">
                      <td className="px-8 py-5 text-xs font-mono font-medium opacity-60 group-hover/row:opacity-100 transition-opacity italic">{b.range}</td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-bold tabular-nums border border-border/40">
                          {(b.rate * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right tabular-nums text-sm font-medium font-mono">
                        {formatCurrency(b.tax, currency.code)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-foreground/[0.03]">
                    <td colSpan={2} className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em]">Total Tax</td>
                    <td className="px-8 py-6 text-right tabular-nums text-xl font-mono font-bold text-foreground">{formatCurrency(result.tax, currency.code)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Taxable Income", v: formatCurrency(result.taxable, currency.code), i: Activity },
               { l: "Daily Tax Cost", v: formatCurrency(result.tax / 365, currency.code), i: Zap },
               { l: "Income Kept", v: (100 - result.effective).toFixed(1), i: Target, unit: "%" },
               { l: "Status", v: "Class A", i: Landmark }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                 </div>
                 <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                    {item.v}
                    {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Insights */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Landmark className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Globe className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Where You Pay Taxes</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  You usually pay taxes where you live and work. If you work remotely in different countries, check local tax rules to avoid being taxed twice.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <TrendingDown className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Saving on Taxes</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  Putting money into retirement accounts (like a 401k or ISA) is one of the best ways to lower your tax bill and save for the future.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default SalaryTaxCalculator;
