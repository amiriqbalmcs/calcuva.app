"use client";

import { useMemo, useState } from "react";
import { 
  Share, CheckCircle2, Receipt, Info, Wallet, Calculator, 
  Coins, TrendingUp, Zap, History, Landmark, Briefcase, 
  FileText, Sparkles, LayoutDashboard, Target, Activity, 
  Globe, Ruler, Gauge, Copy, Settings2, Banknote, 
  ArrowDownRight, ShieldCheck, ChevronRight, Scale
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("gst-vat-tax-calculator");

const COMMON_RATES = [5, 12, 18, 20, 25];

const GstVatCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const { currency } = useCurrency();
  const [mode, setMode] = useUrlState<"add" | "remove">("m", "add");
  const [amount, setAmount] = useUrlState<number>("iv", 1000);
  const [rate, setRate] = useUrlState<number>("r", 18);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = rate / 100;
    if (mode === "add") {
      const tax = amount * r;
      return { net: amount, tax, total: amount + tax };
    } else {
      const net = amount / (1 + r);
      const tax = amount - net;
      return { net, tax, total: amount };
    }
  }, [mode, amount, rate]);

  const handleCopy = () => {
    let text = `Tax Audit: ${formatCurrency(result.total, currency.code)} Total (${rate}% Statutory Rate). Analysis at ${SITE_DOMAIN}`;
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
            <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Fiscal Parameters</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Statutory Tax Protocol</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Mode Switcher */}
              <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11">
                <button 
                  onClick={() => setMode("add")} 
                  className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", mode === 'add' ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:bg-secondary/40")}
                >
                  Add Tax
                </button>
                <button 
                  onClick={() => setMode("remove")} 
                  className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", mode === 'remove' ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:bg-secondary/40")}
                >
                  Extract Tax
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {mode === "add" ? "Base Net Revenue" : "Gross Invoice Amount"}
                  </Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(amount, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value) || 0)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[amount]} min={0} max={100000} step={100} onValueChange={([v]) => setAmount(v)} />
              </div>

              {/* Rate Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Statutory Rate (%)</Label>
                  <span className="text-[10px] font-bold text-finance">{rate}%</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COMMON_RATES.map((r) => (
                    <button 
                      key={r} 
                      onClick={() => setRate(r)} 
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border", 
                        rate === r 
                          ? "bg-foreground text-background border-foreground shadow-sm" 
                          : "bg-background text-muted-foreground border-border/60 hover:border-foreground/20"
                      )}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={rate} 
                    onChange={(e) => setRate(Number(e.target.value) || 0)} 
                    className="h-11 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-base rounded-lg shadow-sm pr-12"
                  />
                  <Scale className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[rate]} min={0} max={50} step={0.1} onValueChange={([v]) => setRate(v)} />
              </div>
            </div>
          </div>

          {/* Insight Panel */}
          <div className="surface-card p-6 border-border/30 bg-health/5 text-health relative overflow-hidden group">
            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Receipt className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Fiscal Analysis</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {mode === "add" 
                    ? `Applying a ${rate}% statutory surcharge to your base revenue results in an aggregate liability of ${formatCurrency(result.tax, currency.code)}.` 
                    : `Reverse-engineering the ${rate}% tax component from your gross total reveals a net pre-tax valuation of ${formatCurrency(result.net, currency.code)}.`
                  }
                </p>
              </div>
            </div>
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
                    Final Aggregate Liability
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-finance">
                    {formatCurrency(result.total, currency.code)}
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
                    <Coins className="size-3 text-health" />
                    Tax Component
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(result.tax, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Briefcase className="size-3" />
                    Effective Base
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(result.net, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Tax Matrix */}
          <div className="surface-card p-10 bg-secondary/5 border-border/30 relative overflow-hidden group shadow-sm">
             <Sparkles className="absolute -top-4 -right-4 size-48 text-muted-foreground/5 opacity-40 group-hover:rotate-12 transition-transform duration-1000" />
             <div className="flex items-center gap-3 mb-10 relative z-10">
               <div className="size-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-lg">
                 <LayoutDashboard className="size-4" />
               </div>
               <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Integrated Protocol Matrix</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
               {[
                 { l: "Net Val", v: result.net, i: Target },
                 { l: "Burden Rate", v: (result.tax / result.total) * 100, i: TrendingUp, unit: "%" },
                 { l: "Multiplier", v: (result.total / (result.net || 1)).toFixed(3), i: History, unit: "x" },
                 { l: "Status", v: "Compliant", i: ShieldCheck, unit: "" }
               ].map((item, idx) => (
                 <div key={idx} className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 group/item hover:border-foreground/20 transition-all shadow-sm">
                   <div className="flex items-center gap-2 mb-3">
                      <item.i className="size-3 text-muted-foreground group-hover/item:text-foreground transition-colors" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                   </div>
                   <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                      {typeof item.v === 'number' ? (item.unit === '%' ? item.v.toFixed(1) : (item.unit === 'x' ? item.v : formatCurrency(item.v, currency.code))) : item.v}
                      {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Professional Contexts */}
          <div className="grid md:grid-cols-2 gap-6">
             <div className="surface-card p-8 flex items-center gap-6 group hover:border-foreground/20 transition-all bg-background shadow-sm">
                <div className="size-16 rounded-2xl bg-secondary/30 flex items-center justify-center shrink-0">
                   <Briefcase className="size-8 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider">Corporate Procurement</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Accurately reverse-engineer net prices from inclusive vendor quotes to determine precise budgetary allocation.
                  </p>
                </div>
             </div>
             <div className="surface-card p-8 flex items-center gap-6 group hover:border-foreground/20 transition-all bg-background shadow-sm">
                <div className="size-16 rounded-2xl bg-secondary/30 flex items-center justify-center shrink-0">
                   <FileText className="size-8 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider">Audit-Ready Audit</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Maintain high-fidelity separation of tax and net valuations for professional bookkeeping and statutory compliance.
                  </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default GstVatCalculator;
