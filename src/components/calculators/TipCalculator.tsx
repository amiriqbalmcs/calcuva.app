"use client";

import { useMemo, useState } from "react";
import { 
  Banknote, Copy, CheckCircle2, Users, Receipt, Percent, Landmark, 
  Wallet, ShoppingCart, Info, Zap, Globe, Share, Target, Activity, 
  Sparkles, History, Settings2, LayoutDashboard, ChevronRight, Calculator,
  Scale, Gauge, Coins, CreditCard
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { formatCurrency } from "@/lib/format";
import { useUrlState } from "@/hooks/useUrlState";
import { useCurrency } from "@/context/CurrencyContext";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("tip-calculator");

const TIP_PRESETS = [10, 15, 18, 20, 25];

const TipCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const { currency } = useCurrency();
  const [bill, setBill] = useUrlState<number>("b", 100);
  const [tipPercent, setTipPercent] = useUrlState<number>("t", 15);
  const [split, setSplit] = useUrlState<number>("s", 1);
  const [copied, setCopied] = useState(false);

  const { tipAmount, totalBill, tipPerPerson, totalPerPerson } = useMemo(() => {
    const tip = bill * (tipPercent / 100);
    const total = bill + tip;
    const people = Math.max(1, split);
    
    return {
      tipAmount: tip,
      totalBill: total,
      tipPerPerson: tip / people,
      totalPerPerson: total / people
    };
  }, [bill, tipPercent, split]);

  const handleCopy = () => {
    let text = `Total Bill: ${formatCurrency(totalBill, currency.code)} (${tipPercent}% Tip). ${split > 1 ? `Split ${split} ways: ${formatCurrency(totalPerPerson, currency.code)} each.` : ""} Calculate at ${window.location.href}`;
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
              <h3 className="text-sm font-bold tracking-tight">Tipping Details</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Bill and Tip</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Bill Amount */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bill Amount</Label>
                  <span className="text-[10px] font-bold text-finance">{formatCurrency(bill, currency.code)}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    value={bill} 
                    onChange={(e) => setBill(Number(e.target.value) || 0)} 
                    className="h-12 bg-background border-border/60 focus:border-foreground/20 transition-all font-bold text-lg rounded-xl pr-12 shadow-sm"
                  />
                  <Banknote className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" />
                </div>
                <Slider value={[bill]} min={1} max={5000} step={1} onValueChange={([v]) => setBill(v)} />
              </div>

              {/* Tip Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tip Percentage</Label>
                  <span className="text-[10px] font-bold text-health">{tipPercent}%</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {TIP_PRESETS.map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setTipPercent(p)} 
                      className={cn(
                        "py-2.5 rounded-lg text-[10px] font-bold tracking-widest transition-all border",
                        tipPercent === p ? "bg-foreground text-background border-foreground shadow-md" : "bg-background text-muted-foreground border-border/60 hover:bg-secondary"
                      )}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
                <Slider value={[tipPercent]} min={0} max={50} step={1} onValueChange={([v]) => setTipPercent(v)} />
              </div>

              {/* Split Headcount */}
              <div className="space-y-4 pt-2 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Split Between</Label>
                  <span className="text-[10px] font-bold">{split} Person{split > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSplit(Math.max(1, split - 1))} 
                    className="size-12 rounded-xl bg-background border border-border/60 hover:bg-secondary transition-all flex items-center justify-center font-bold text-lg shadow-sm"
                  >-</button>
                  <div className="flex-1 text-center font-mono font-bold text-2xl tabular-nums">{split}</div>
                  <button 
                    onClick={() => setSplit(split + 1)} 
                    className="size-12 rounded-xl bg-background border border-border/60 hover:bg-secondary transition-all flex items-center justify-center font-bold text-lg shadow-sm"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Info className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Users className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Bill Details</h4>
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {split > 1 
                    ? `Even split: Each person pays ${formatCurrency(totalPerPerson, currency.code)}, including their share of the tip.` 
                    : `Total to pay: ${formatCurrency(totalBill, currency.code)} including a ${formatCurrency(tipAmount, currency.code)} tip for the staff.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <Receipt className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Users className="size-3" />
                    {split > 1 ? "Amount Per Person" : "Total Bill Amount"}
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-finance">
                    {formatCurrency(split > 1 ? totalPerPerson : totalBill, currency.code)}
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
                    <Sparkles className="size-3 text-health" />
                    Total Tip Amount
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                    {formatCurrency(tipAmount, currency.code)}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <CreditCard className="size-3" />
                    Grand Total
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {formatCurrency(totalBill, currency.code)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Precision Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { l: "Bill Amount", v: bill, i: Banknote, isMoney: true },
               { l: "Total Tip", v: tipAmount, i: Percent, isMoney: true },
               { l: "Grand Total", v: totalBill, i: CreditCard, isMoney: true },
               { l: "People", v: split, i: Users, unit: "PAX" }
             ].map((item, idx) => (
               <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                    <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{item.l}</span>
                 </div>
                 <div className="text-lg font-mono font-bold tabular-nums leading-tight">
                    {item.isMoney ? formatCurrency(item.v as number, currency.code) : item.v}
                    {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                 </div>
               </div>
             ))}
          </div>

          {/* Expert Strategy Cards */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Zap className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Gauge className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">How much to tip?</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Tipping 15% to 20% is common for good service. At fancy restaurants, people often tip 20% or more to show appreciation.
                </p>
             </div>
             <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group shadow-sm">
                <Globe className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:-rotate-12 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Landmark className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Tipping around the world</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Tipping rules are different in every country. In some places, the tip is already included in your bill as a service charge.
                </p>
             </div>
          </div>

        </div>
      </div>
    </CalculatorPage>
  );
};

export default TipCalculator;
