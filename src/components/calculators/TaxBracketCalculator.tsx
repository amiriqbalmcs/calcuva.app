"use client";

import { useState, useMemo } from "react";
import { 
  Receipt, Landmark, TrendingUp, Info, DollarSign, Wallet, 
  PieChart as PieIcon, ArrowRight, Share, CheckCircle2,
  Copy, LayoutDashboard, Calculator, Gauge, Banknote,
  Target, Activity, Zap, ShieldCheck, ArrowDownRight,
  ChevronRight, BarChart3, Scale
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";

const brackets2024 = {
  single: [
    { rate: 0.10, min: 0, max: 11600 },
    { rate: 0.12, min: 11601, max: 47150 },
    { rate: 0.22, min: 47151, max: 100525 },
    { rate: 0.24, min: 100526, max: 191950 },
    { rate: 0.32, min: 191951, max: 243725 },
    { rate: 0.35, min: 243726, max: 609350 },
    { rate: 0.37, min: 609351, max: Infinity },
  ],
  married: [
    { rate: 0.10, min: 0, max: 23200 },
    { rate: 0.12, min: 23201, max: 94300 },
    { rate: 0.22, min: 94301, max: 201050 },
    { rate: 0.24, min: 201051, max: 383900 },
    { rate: 0.32, min: 383901, max: 487450 },
    { rate: 0.35, min: 487451, max: 731200 },
    { rate: 0.37, min: 731201, max: Infinity },
  ]
};

export default function TaxBracketCalculator({ calc: initialCalc, guideHtml, faqs, relatedArticles }: { calc?: any; guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) {
  const calc = initialCalc || calculatorBySlug("tax-bracket-calculator");
  if (!calc) return null;
  const { currency } = useCurrency();
  const [income, setIncome] = useUrlState<number>("i", 75000);
  const [filingStatus, setFilingStatus] = useUrlState<string>("s", "single");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const selectedBrackets = filingStatus === "married" ? brackets2024.married : brackets2024.single;
    let totalTax = 0;
    const bracketBreakdown = [];

    for (const b of selectedBrackets) {
      if (income > b.min) {
        const taxableInThisBracket = Math.min(income, b.max) - b.min;
        const taxInThisBracket = taxableInThisBracket * b.rate;
        totalTax += taxInThisBracket;

        bracketBreakdown.push({
          range: `${formatNumber(b.min)} – ${b.max === Infinity ? "∞" : formatNumber(b.max)}`,
          rate: (b.rate * 100).toFixed(0) + "%",
          amount: taxInThisBracket,
          taxable: taxableInThisBracket,
          rateVal: b.rate
        });
      }
    }

    const effectiveRate = totalTax / (income || 1);
    const takeHome = income - totalTax;

    let status: "optimal" | "warning" | "critical" = "optimal";
    let insight = "";
    if (effectiveRate > 0.30) {
      status = "critical";
      insight = "High Tax Burden: You are in a higher tax bracket. Look into ways to increase your deductions to lower your tax bill.";
    } else if (effectiveRate > 0.15) {
      status = "warning";
      insight = "Average Tax Rate: Your tax rate is fairly standard. Basic tax-saving strategies will work well for you.";
    } else {
      status = "optimal";
      insight = "Low Tax Rate: You are in a lower tax bracket and keeping most of what you earn.";
    }

    return {
      totalTax,
      effectiveRate,
      takeHome,
      bracketBreakdown,
      status,
      insight,
      pieData: [
        { name: "Take-Home", value: takeHome, color: "hsl(var(--health))" },
        { name: "Federal Tax", value: totalTax, color: "hsl(var(--destructive))" },
      ]
    };
  }, [income, filingStatus, formatNumber]);

  const handleCopy = () => {
    let text = `Effective Tax Rate: ${(results.effectiveRate * 100).toFixed(1)}% | Estimated Tax: ${formatCurrency(results.totalTax, currency.code)}. Audit at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <LayoutDashboard className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Tax Setup</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Income Details</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Filing Status */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Filing Status</Label>
                <Select value={filingStatus} onValueChange={setFilingStatus}>
                  <SelectTrigger className="h-11 bg-background border-border/60 font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="single" className="text-[10px] font-bold uppercase">Single Filer</SelectItem>
                    <SelectItem value="married" className="text-[10px] font-bold uppercase">Married (Joint)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Annual Income */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Income</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(income, currency.code)}</span>
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
                <Slider value={[income]} min={10000} max={1000000} step={5000} onValueChange={([v]) => setIncome(v)} />
              </div>
            </div>
          </div>

          {/* Insight Panel */}
          <div className={cn(
            "surface-card p-6 border-border/30 relative overflow-hidden group",
            results.status === "critical" ? "bg-destructive/5 text-destructive" : results.status === "warning" ? "bg-amber-500/5 text-amber-500" : "bg-health/5 text-health"
          )}>
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Target className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Tax Analysis</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {results.insight}
                </p>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 bg-secondary/5 border-border/30 flex gap-4 items-start">
            <Info className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
              Calculations based on 2024 Federal Tax Brackets. Does not include state taxes or FICA.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Landmark className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Receipt className="size-3" />
                    Federal Income Tax
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-destructive">
                    {formatCurrency(results.totalTax, currency.code)}
                  </div>
                </div>
                <button 
                  onClick={handleCopy} 
                  className={cn(
                    "p-3 rounded-xl transition-all border shadow-sm",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Gauge className="size-3" />
                    Effective Rate
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {(results.effectiveRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Wallet className="size-3 text-health" />
                    Take-Home Pay
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(results.takeHome, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="surface-card p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm bg-secondary/5">
              <PieIcon className="absolute -top-4 -right-4 size-24 text-muted-foreground/5 -rotate-12" />
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8 relative z-10">Where Your Money Goes</h3>
              <div className="size-48 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={results.pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {results.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => formatCurrency(v, currency.code)}
                      contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'hsl(var(--background))', boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.2)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Money Kept</span>
                  <span className="text-xl font-mono font-bold">{(100 - (results.effectiveRate * 100)).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex gap-6 mt-8 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-health" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Take-Home</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-destructive" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Taxes</span>
                </div>
              </div>
            </div>

            {/* Visual Stacks */}
            <div className="surface-card p-8 space-y-6 bg-background border-border/40 shadow-sm relative overflow-hidden group">
               <Scale className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-700" />
               <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest relative z-10">How Your Tax is Calculated</h3>
               <div className="space-y-6 relative z-10">
                  {results.bracketBreakdown.map((b, i) => (
                    <div key={i} className="group/item">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-bold font-mono text-muted-foreground opacity-60">Tier: {b.rate}</span>
                        <span className="text-[10px] font-bold text-foreground">{formatCurrency(b.amount, currency.code)}</span>
                      </div>
                      <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-finance h-full transition-all duration-1000 ease-out shadow-sm"
                          style={{ width: `${Math.max(2, (b.amount / results.totalTax) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Bracket Matrix */}
          <div className="surface-card overflow-hidden bg-secondary/5 border-border/30 relative group shadow-sm">
            <div className="p-8 border-b border-border/40 flex items-center justify-between bg-background/40 backdrop-blur-sm relative overflow-hidden">
               <BarChart3 className="absolute -top-4 -right-4 size-24 text-muted-foreground/5 -rotate-12" />
               <div className="space-y-1 relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tax Breakdown</h4>
                  <p className="text-sm font-bold tracking-tight">See How the Brackets Work</p>
               </div>
               <div className="text-right relative z-10">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1 opacity-40">Highest Tax Rate</span>
                  <div className="text-xl font-mono font-bold text-foreground">{results.bracketBreakdown[results.bracketBreakdown.length - 1]?.rate}</div>
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
                  {results.bracketBreakdown.map((b, i) => (
                    <tr key={i} className="hover:bg-foreground/[0.02] transition-colors group/row">
                      <td className="px-8 py-5 text-xs font-mono font-medium opacity-60 group-hover/row:opacity-100 transition-opacity italic">{b.range}</td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 rounded-full bg-secondary text-[10px] font-bold tabular-nums border border-border/40">
                          {b.rate}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right tabular-nums text-sm font-medium font-mono">
                        {formatCurrency(b.amount, currency.code)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-foreground/[0.03]">
                    <td colSpan={2} className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em]">Total Federal Tax</td>
                    <td className="px-8 py-6 text-right tabular-nums text-xl font-mono font-bold text-foreground">{formatCurrency(results.totalTax, currency.code)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Total Income", v: formatCurrency(income, currency.code), i: Activity },
               { l: "Daily Tax Cost", v: formatCurrency(results.totalTax / 365, currency.code), i: Zap },
               { l: "Income Kept", v: (100 - (results.effectiveRate * 100)).toFixed(1), i: Target, unit: "%" },
               { l: "Status", v: "Calibrated", i: Landmark }
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

        </div>
      </div>
    </CalculatorPage>
  );
}
