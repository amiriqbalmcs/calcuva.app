"use client";

import { useMemo, useState } from "react";
import {
  Target, TrendingUp, Info, BookOpen, 
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Copy, Award, AlertCircle, Banknote, ShieldCheck,
  TrendingDown, Plus, Trash2, ArrowRight
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("debt-payoff-calculator");

interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

const newDebt = (n = 1): Debt => ({
  id: `d-${n}-${Date.now()}`,
  name: `Debt ${n}`,
  balance: 5000,
  rate: 15,
  minPayment: 150
});

const DebtPayoffCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const { currency } = useCurrency();
  const [debts, setDebts] = useState<Debt[]>([
    { id: "d-1", name: "Credit Card A", balance: 3500, rate: 24, minPayment: 120 },
    { id: "d-2", name: "Personal Loan", balance: 12000, rate: 12, minPayment: 350 }
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(200);
  const [debtCount, setDebtCount] = useState(2);

  const addNewDebt = () => {
    const nextNum = debtCount + 1;
    setDebts(ds => [...ds, newDebt(nextNum)]);
    setDebtCount(nextNum);
  };

  const results = useMemo(() => {
    if (debts.length === 0) return null;

    const totalInitialDebt = debts.reduce((s, d) => s + d.balance, 0);

    const calculateStrategy = (strategy: "snowball" | "avalanche") => {
      let currentDebts = debts.map(d => ({ ...d, currentBalance: d.balance }));
      let totalMonths = 0;
      let totalInterest = 0;
      let isInfinite = false;
      
      if (strategy === "snowball") {
        currentDebts.sort((a, b) => a.balance - b.balance);
      } else {
        currentDebts.sort((a, b) => b.rate - a.rate);
      }

      while (currentDebts.some(d => d.currentBalance > 0) && totalMonths < 600) {
        totalMonths++;
        let availableExtra = extraPayment;
        let monthlyTotalPayment = extraPayment + currentDebts.reduce((s, d) => s + (d.currentBalance > 0 ? d.minPayment : 0), 0);
        let monthlyTotalInterest = currentDebts.reduce((s, d) => s + (d.currentBalance > 0 ? (d.currentBalance * (d.rate / 100)) / 12 : 0), 0);

        if (monthlyTotalInterest >= monthlyTotalPayment && totalMonths > 1) {
          isInfinite = true;
          break;
        }
        
        currentDebts.forEach(d => {
          if (d.currentBalance > 0) {
            const interest = (d.currentBalance * (d.rate / 100)) / 12;
            totalInterest += interest;
            d.currentBalance += interest;
            const payment = Math.min(d.currentBalance, d.minPayment);
            d.currentBalance -= payment;
          }
        });

        for (let d of currentDebts) {
          if (d.currentBalance > 0) {
            const extra = Math.min(d.currentBalance, availableExtra);
            d.currentBalance -= extra;
            availableExtra -= extra;
            if (availableExtra <= 0) break;
          }
        }
      }
      return { totalMonths, totalInterest, isInfinite };
    };

    const snowball = calculateStrategy("snowball");
    const avalanche = calculateStrategy("avalanche");
    return { snowball, avalanche, totalInitialDebt };
  }, [debts, extraPayment]);

  const update = (id: string, patch: Partial<Debt>) => setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const remove = (id: string) => setDebts((ds) => ds.filter((d) => d.id !== id));

  const snowballOrder = useMemo(() => {
    return [...debts]
      .sort((a, b) => a.balance - b.balance || a.rate - b.rate)
      .map(d => d.id);
  }, [debts]);

  const avalancheOrder = useMemo(() => {
    return [...debts]
      .sort((a, b) => b.rate - a.rate || b.balance - a.balance)
      .map(d => d.id);
  }, [debts]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
              <div className="flex items-center gap-3 relative z-10">
                <Banknote className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Debt Portfolio</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Add all your loans and credit cards</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addNewDebt}
                className="h-9 px-4 text-[10px] font-bold tracking-widest border-border/60 hover:bg-foreground hover:text-background transition-all rounded-xl"
              >
                <Plus className="size-3 mr-2" /> ADD DEBT
              </Button>
            </div>

            <div className="divide-y divide-border/30">
              {debts.map((d) => (
                <div key={d.id} className="p-6 grid grid-cols-12 gap-6 items-end hover:bg-background transition-all relative group">
                  <div className="col-span-12 md:col-span-4 space-y-2">
                    <div className="flex items-center gap-2">
                       <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Debt Name</Label>
                       <div className="flex gap-1">
                          <span className="text-[8px] px-1 bg-secondary text-muted-foreground rounded border border-border/40 font-mono">#{snowballOrder.indexOf(d.id) + 1} Snow</span>
                          <span className="text-[8px] px-1 bg-health/10 text-health rounded border border-health/20 font-mono">#{avalancheOrder.indexOf(d.id) + 1} Ava</span>
                       </div>
                    </div>
                    <Input
                      value={d.name}
                      onChange={(e) => update(d.id, { name: e.target.value })}
                      className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-3 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center block">Balance</Label>
                    <Input
                      type="number"
                      value={d.balance}
                      onChange={(e) => update(d.id, { balance: Number(e.target.value) || 0 })}
                      className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm text-center tabular-nums"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center block">Rate (%)</Label>
                    <Input
                      type="number"
                      value={d.rate}
                      onChange={(e) => update(d.id, { rate: Number(e.target.value) || 0 })}
                      className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm text-center tabular-nums text-foreground"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center block">Min Pay</Label>
                    <Input
                      type="number"
                      value={d.minPayment}
                      onChange={(e) => update(d.id, { minPayment: Number(e.target.value) || 0 })}
                      className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm text-center tabular-nums"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => remove(d.id)} className="size-11 text-muted-foreground/40 hover:text-destructive transition-all">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-foreground/5 border-t border-border/40">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                     <h4 className="text-sm font-bold">Extra Monthly Payment</h4>
                     <p className="text-xs text-muted-foreground font-medium">Amount you can pay on top of all minimums.</p>
                  </div>
                  <div className="relative w-full md:w-48">
                     <Input
                        type="number"
                        value={extraPayment}
                        onChange={(e) => setExtraPayment(Number(e.target.value) || 0)}
                        className="h-14 bg-background border-border/60 font-mono text-2xl font-bold rounded-xl shadow-lg pl-14 text-center"
                     />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs">{currency.symbol}</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-md space-y-8">
             <div className="space-y-2 border-b border-border/40 pb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Initial Debt</div>
                <div className="text-3xl font-mono font-bold tracking-tight text-foreground">
                   {currency.symbol} {results?.totalInitialDebt.toLocaleString()}
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Snowball Method</div>
                </div>
                <div className="space-y-1">
                   {results?.snowball.isInfinite ? (
                      <div className="text-xl font-bold text-destructive">Never (Int. {">"} Pay)</div>
                   ) : (
                      <div className="text-4xl font-mono font-bold tracking-tighter text-foreground">{results?.snowball.totalMonths} <span className="text-lg opacity-40">Months</span></div>
                   )}
                   <div className="text-xs font-medium text-muted-foreground">Total Interest: {currency.symbol} {Math.round(results?.snowball.totalInterest || 0).toLocaleString()}</div>
                </div>
             </div>

             <div className="space-y-6 pt-8 border-t border-border/40">
                <div className="flex justify-between items-center">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Avalanche Method</div>
                   <span className="bg-health/10 text-health px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">Fastest</span>
                </div>
                <div className="space-y-1">
                   {results?.avalanche.isInfinite ? (
                      <div className="text-xl font-bold text-destructive">Never (Int. {">"} Pay)</div>
                   ) : (
                      <div className="text-4xl font-mono font-bold tracking-tighter text-health">{results?.avalanche.totalMonths} <span className="text-lg opacity-40">Months</span></div>
                   )}
                   <div className="text-xs font-medium text-muted-foreground">Total Interest: {currency.symbol} {Math.round(results?.avalanche.totalInterest || 0).toLocaleString()}</div>
                </div>
             </div>

             <div className="p-5 rounded-2xl bg-foreground/5 border border-border/30 space-y-3 mt-4">
                <div className="flex items-center gap-2 text-foreground/60">
                   <Activity className="size-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Strategy Analysis</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                   {results?.avalanche.isInfinite 
                     ? "Warning: Your monthly payments are less than the monthly interest. Your debt will grow forever unless you increase your extra payment."
                     : results && results.avalanche.totalInterest < results.snowball.totalInterest 
                     ? `Avalanche is the winner. It clears your debt in the same time but saves you ${currency.symbol} ${Math.round(results.snowball.totalInterest - results.avalanche.totalInterest).toLocaleString()} in wasted interest fees.`
                     : "Both methods provide the same payoff timeline and interest cost for your current debt profile."}
                </p>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default DebtPayoffCalculator;
