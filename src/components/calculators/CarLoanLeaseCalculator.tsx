"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, Car, Info, Settings2, Copy, 
  TrendingUp, Wallet, Landmark, Zap, Target, Activity, 
  ArrowUpRight, Sparkles, History, Banknote, ShieldCheck,
  RefreshCcw, Calculator, Scale, Ruler, Gauge, ChevronRight,
  ArrowDownRight
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import { SITE_DOMAIN } from "@/lib/constants";

const calc = calculatorBySlug("car-loan-vs-lease-calculator");

const CarLoanLeaseCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const { currency } = useCurrency();
  const [carPrice, setCarPrice] = useUrlState<number>("cp", 35000);
  const [downPayment, setDownPayment] = useUrlState<number>("dp", 5000);
  const [loanRate, setLoanRate] = useUrlState<number>("lr", 5.5);
  const [loanTerm, setLoanTerm] = useUrlState<number>("lt", 60);
  const [leasePayment, setLeasePayment] = useUrlState<number>("lp", 450);
  const [leaseTerm, setLeaseTerm] = useUrlState<number>("lst", 36);
  const [dueAtSigning, setDueAtSigning] = useUrlState<number>("ds", 2500);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const principal = carPrice - downPayment;
    const i = loanRate / 100 / 12;
    let loanMonthly = 0;
    
    if (i === 0) {
      loanMonthly = principal / loanTerm;
    } else {
      loanMonthly = principal * (i * Math.pow(1 + i, loanTerm)) / (Math.pow(1 + i, loanTerm) - 1);
    }

    const totalLoanCost = (loanMonthly * loanTerm) + downPayment;
    const totalLeaseCost = (leasePayment * leaseTerm) + dueAtSigning;

    let status: "optimal" | "warning" | "critical" = "optimal";
    let insight = "";
    if (loanMonthly > leasePayment * 1.5) {
      status = "warning";
      insight = "Liquidity Priority: Buying requires 50% more monthly cash-flow than leasing. This has a high short-term impact on your disposable income.";
    } else if (totalLoanCost < totalLeaseCost * 1.2) {
      status = "optimal";
      insight = "Equity Advantage: Buying is significantly more cost-effective long-term, providing full asset ownership and residual value recovery.";
    } else {
      status = "optimal";
      insight = "Flexibility Win: Lease terms are aggressive. Leasing is likely superior if you prefer vehicle turnover every 3 years without resale risk.";
    }

    return { loanMonthly, totalLoanCost, totalLeaseCost, insight, status };
  }, [carPrice, downPayment, loanRate, loanTerm, leasePayment, leaseTerm, dueAtSigning]);

  const handleCopy = () => {
    const resultText = `Vehicle Finance: Loan ${formatCurrency(stats.loanMonthly, currency.code)} vs Lease ${formatCurrency(leasePayment, currency.code)}. Audit at ${window.location.href}`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Financing Architecture</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Ownership vs Flex Protocol</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Car Price */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vehicle Value</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(carPrice, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={carPrice} 
                    onChange={(e) => setCarPrice(Number(e.target.value) || 0)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Car className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[carPrice]} min={5000} max={150000} step={1000} onValueChange={([v]) => setCarPrice(v)} />
              </div>

              {/* Loan Parameters */}
              <div className="space-y-6 pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="size-3 text-muted-foreground opacity-60" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Ownership Logic (Loan)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">Down Payment</Label>
                    <Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value) || 0)} className="h-10 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">APR Rate %</Label>
                    <Input type="number" step="0.1" value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value) || 0)} className="h-10 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Loan Term</span>
                      <span className="text-foreground">{loanTerm} Mo</span>
                   </div>
                   <Slider value={[loanTerm]} min={12} max={96} step={12} onValueChange={([v]) => setLoanTerm(v)} />
                </div>
              </div>

              {/* Lease Parameters */}
              <div className="space-y-6 pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCcw className="size-3 text-muted-foreground opacity-60" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Flex Protocol (Lease)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">Monthly Pay</Label>
                    <Input type="number" value={leasePayment} onChange={(e) => setLeasePayment(Number(e.target.value) || 0)} className="h-10 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">Due at signing</Label>
                    <Input type="number" value={dueAtSigning} onChange={(e) => setDueAtSigning(Number(e.target.value) || 0)} className="h-10 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Panel */}
          <div className={cn(
            "surface-card p-6 border-border/30 relative overflow-hidden group",
            stats.status === "warning" ? "bg-amber-500/5 text-amber-600" : "bg-health/5 text-health"
          )}>
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Info className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Asset Verdict</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {stats.insight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Car className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Scale className="size-3" />
                    Monthly Payment Difference
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums">
                    {formatCurrency(Math.abs(stats.loanMonthly - leasePayment), currency.code)}
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
                    <Landmark className="size-3" />
                    Loan Payment
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(stats.loanMonthly, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <RefreshCcw className="size-3" />
                    Lease Payment
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(leasePayment, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Total Loan Payout", v: stats.totalLoanCost, i: Landmark },
               { l: "Total Lease Cost", v: stats.totalLeaseCost, i: Wallet },
               { l: "Lease Savings", v: Math.max(0, stats.totalLoanCost - stats.totalLeaseCost), i: Sparkles },
               { l: "Equity Premium", v: ((stats.totalLoanCost / stats.totalLeaseCost - 1) * 100).toFixed(1), i: Target, unit: "%" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                 </div>
                 <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                    {typeof item.v === 'number' ? formatCurrency(item.v, currency.code) : item.v}
                    {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Contexts */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <TrendingUp className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Activity className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Equity Velocity</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  Buying a vehicle serves as a forced savings mechanism. While the asset depreciates, you retain residual equity at the end of the term, whereas lease payments are purely expense-based.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <ShieldCheck className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <RefreshCcw className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Maintenance Risk</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed relative z-10 font-medium">
                  Leasing typically aligns with the manufacturer's warranty lifecycle, shielding you from expensive long-term mechanical friction and depreciatory spikes associated with aging vehicles.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default CarLoanLeaseCalculator;
