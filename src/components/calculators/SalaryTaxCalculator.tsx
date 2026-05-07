"use client";

import { useMemo, useState } from "react";
import {
  Landmark, Wallet, TrendingDown, ArrowRight,
  ShieldCheck, Receipt, PieChart, Banknote, Sparkles,
  Info, Calendar, ArrowUpRight, Calculator, ShieldAlert,
  Copy, CheckCircle2, History
} from "lucide-react";
import { HowToGuide } from "@/components/HowToGuide";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const SalaryTaxCalculator = ({ calc: initialCalc, guideHtml, faqs, relatedArticles }: { calc?: any; guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const calc = initialCalc || calculatorBySlug("salary-income-tax-calculator-2026");
  if (!calc) return null;

  const [monthlySalary, setMonthlySalary] = useState<number>(189000);
  const [taxYear, setTaxYear] = useState<"2025" | "2024">("2025");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const annualSalary = monthlySalary * 12;
    let tax = 0;

    if (taxYear === "2025") {
      // OFFICIAL 2025-26 SLABS
      if (annualSalary <= 600000) {
        tax = 0;
      } else if (annualSalary <= 1200000) {
        tax = (annualSalary - 600000) * 0.01;
      } else if (annualSalary <= 2200000) {
        tax = 6000 + (annualSalary - 1200000) * 0.11;
      } else if (annualSalary <= 3200000) {
        tax = 116000 + (annualSalary - 2200000) * 0.23;
      } else if (annualSalary <= 4100000) {
        tax = 346000 + (annualSalary - 3200000) * 0.30;
      } else {
        tax = 616000 + (annualSalary - 4100000) * 0.35;
      }
    } else {
      // PREVIOUS 2024-25 SLABS
      if (annualSalary <= 600000) {
        tax = 0;
      } else if (annualSalary <= 1200000) {
        tax = (annualSalary - 600000) * 0.025;
      } else if (annualSalary <= 2400000) {
        tax = 15000 + (annualSalary - 1200000) * 0.125;
      } else if (annualSalary <= 3600000) {
        tax = 165000 + (annualSalary - 2400000) * 0.225;
      } else if (annualSalary <= 6000000) {
        tax = 435000 + (annualSalary - 3600000) * 0.275;
      } else {
        tax = 1095000 + (annualSalary - 6000000) * 0.35;
      }
    }

    const monthlyTax = tax / 12;
    const monthlyTakeHome = monthlySalary - monthlyTax;
    const annualTakeHome = annualSalary - tax;


    return {
      annualSalary,
      annualTax: tax,
      monthlyTax,
      monthlyTakeHome,
      annualTakeHome
    };
  }, [monthlySalary, taxYear]);

  const handleCopy = () => {
    const text = `Salary Tax Analysis (FY ${taxYear === '2025' ? '2025-26' : '2024-25'}): Monthly Salary Rs. ${monthlySalary.toLocaleString()} | Monthly Take-Home Rs. ${Math.round(results.monthlyTakeHome).toLocaleString()} | Monthly Tax Rs. ${Math.round(results.monthlyTax).toLocaleString()}. Calculate at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">

          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <TrendingDown className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <ShieldCheck className="size-3 text-primary" /> Net Take-Home Pay
                  </div>
                  <h2 className="text-sm font-bold tracking-tight">Monthly Salary After Tax</h2>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 overflow-hidden">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tighter text-foreground tabular-nums leading-none break-all">
                    Rs. {Math.round(results.monthlyTakeHome).toLocaleString()}
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                    "bg-primary/10 text-primary"
                  )}>
                    <Sparkles className="size-3" /> FY {taxYear === "2025" ? "2025-26" : "2024-25"} Rates
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Banknote className="size-3" /> Yearly Net Income
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground/80 tabular-nums">
                    Rs. {Math.round(results.annualTakeHome).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <ShieldAlert className="size-3 text-destructive" /> Total Tax Liability
                  </div>
                  <div className="text-2xl font-mono font-bold text-destructive/80 tabular-nums">
                    Rs. {Math.round(results.annualTax).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Tax Burden Visualization */}
              <div className="mt-10 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tax Burden (% of Gross)</span>
                  <span className="text-[10px] font-bold font-mono">
                    {((results.annualTax / results.annualSalary) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden border border-border/20">
                  <div
                    className="h-full bg-destructive transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${(results.annualTax / results.annualSalary) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { l: "Monthly Tax", v: results.monthlyTax, i: Receipt, c: "text-destructive" },
              { l: "Monthly Gross", v: monthlySalary, i: Wallet, c: "text-muted-foreground" },
              { l: "Effective Rate", v: `${((results.annualTax / results.annualSalary) * 100).toFixed(1)}%`, i: PieChart, c: "text-primary", isRaw: true }
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                </div>
                <div className={cn("text-xl font-mono font-medium tabular-nums leading-tight", item.c)}>
                  {item.isRaw ? item.v : `Rs. ${Math.round(item.v as number).toLocaleString()}`}
                </div>
              </div>
            ))}
          </div>

          {/* Expert Insights & Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
              <Info className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center gap-2 relative z-10 text-[10px] font-bold uppercase tracking-widest text-foreground">
                <Calculator className="size-3 text-primary" /> Taxable Threshold
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Income up to Rs. 600,000 per year (Rs. 50,000/month) is tax-exempt under both FY 2024-25 and FY 2025-26 rules.
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
              <ShieldCheck className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center gap-2 relative z-10 text-[10px] font-bold uppercase tracking-widest text-foreground">
                <History className="size-3 text-primary" /> FY 2025-26 Changes
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                The latest budget has adjusted slabs for high earners, significantly increasing the tax burden for individuals earning above Rs. 2.2 million annually.
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar Panel (Inputs) */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Landmark className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Tax Configuration</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Monthly Income & Period</p>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Main Salary Input */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monthly Salary (PKR)</Label>
                <div className="relative group">
                  <Input
                    type="number"
                    value={monthlySalary || ""}
                    onChange={(e) => setMonthlySalary(Number(e.target.value) || 0)}
                    className="h-14 bg-background border-border/60 font-mono text-xl font-bold rounded-2xl pl-12 focus:ring-primary/20 transition-all"
                    placeholder="0"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-sm font-bold">Rs.</div>
                </div>
              </div>

              {/* Fiscal Year Selection */}
              <div className="space-y-4 pt-4 border-t border-border/20">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Fiscal Year</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "2025", l: "FY 2025 - 2026", d: "Latest Budget Rates" },
                    { id: "2024", l: "FY 2024 - 2025", d: "Previous Year Slabs" }
                  ].map((year) => (
                    <button
                      key={year.id}
                      onClick={() => setTaxYear(year.id as any)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all group/btn relative overflow-hidden",
                        taxYear === year.id
                          ? "bg-background border-primary shadow-sm"
                          : "bg-background border-border/60 hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("text-xs font-bold uppercase tracking-tight", taxYear === year.id ? "text-primary" : "text-foreground")}>
                          {year.l}
                        </span>
                        {taxYear === year.id && <CheckCircle2 className="size-3 text-primary" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-tighter">
                        {year.d}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-border/20 space-y-3">
                <button
                  onClick={handleCopy}
                  className={cn(
                    "w-full h-11 rounded-xl flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-95",
                    copied ? "bg-foreground text-background" : "bg-slate-900 hover:bg-slate-800 text-white"
                  )}
                >
                  {copied ? (
                    <><CheckCircle2 className="size-3" /> Copied Analysis</>
                  ) : (
                    <><Copy className="size-3" /> Share Results</>
                  )}
                </button>
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                    FBR Official Calculator for Salary Income Tax
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {calc.howTo && (
        <div className="mt-12 pt-12 border-t border-border/40">
          <HowToGuide
            id="how-to-use"
            steps={calc.howTo!.steps}
            proTip={calc.howTo!.proTip}
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
  );
};

export default SalaryTaxCalculator;
