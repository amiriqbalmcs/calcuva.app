"use client";

import { useMemo, useState } from "react";
import {
   Landmark, Wallet, TrendingDown, ArrowRight,
   ShieldCheck, Receipt, PieChart, Banknote,
   Info, Calendar, ArrowUpRight, Calculator, ShieldAlert,
   Copy, CheckCircle2
} from "lucide-react";
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
            <div className="lg:col-span-8 space-y-6">
               <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-border/40 bg-background flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                           <Landmark className="size-6 text-foreground" />
                        </div>
                        <div className="space-y-0.5">
                           <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">{calc.title.includes('Pakistan') ? 'Income Tax Configuration' : calc.title}</h3>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{calc.title.includes('Pakistan') ? 'FBR Official Salary Slabs (Pakistan)' : 'Salary Tax Analysis'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 space-y-10">
                     <div className="space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Income (PKR)</Label>
                        <div className="relative group">
                           <Input
                              type="number"
                              value={monthlySalary || ""}
                              onChange={(e) => setMonthlySalary(Number(e.target.value) || 0)}
                              className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-3xl pl-20 focus:ring-4 ring-primary/5 transition-all"
                              placeholder="0"
                           />
                           <div className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">Rs.</div>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-border/40">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Fiscal Year</Label>
                        <div className="grid grid-cols-2 gap-4">
                           <button
                              onClick={() => setTaxYear("2025")}
                              className={cn("p-6 border rounded-3xl transition-all text-left space-y-2",
                                 taxYear === "2025" ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-background border-border/60 hover:border-foreground/20")
                              }
                           >
                              <div className="flex items-center gap-2">
                                 <Calendar className={cn("size-4", taxYear === "2025" ? "text-primary" : "text-muted-foreground")} />
                                 <span className={cn("text-xs font-bold uppercase tracking-tight", taxYear === "2025" ? "text-foreground" : "text-muted-foreground")}>FY 2025 - 2026</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-relaxed">Current Year (Post-Budget June 2025 Rates).</p>
                           </button>
                           <button
                              onClick={() => setTaxYear("2024")}
                              className={cn("p-6 border rounded-3xl transition-all text-left space-y-2",
                                 taxYear === "2024" ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-background border-border/60 hover:border-foreground/20")
                              }
                           >
                              <div className="flex items-center gap-2">
                                 <History className="size-4" />
                                 <span className={cn("text-xs font-bold uppercase tracking-tight", taxYear === "2024" ? "text-foreground" : "text-muted-foreground")}>FY 2024 - 2025</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-relaxed">Previous Year (Old Slabs).</p>
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-foreground/5 border-t border-border/40 flex items-center gap-6">
                     <div className="size-12 rounded-2xl bg-background border border-border/40 flex items-center justify-center shrink-0 shadow-sm">
                        <ShieldCheck className="size-5 text-primary" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">Verified FBR Slabs</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase">
                           Calculated using official progressive slabs. Rs. {monthlySalary.toLocaleString()} monthly income generates Rs. {Math.round(results.monthlyTax).toLocaleString()} tax for {taxYear === "2025" ? "2025-26" : "2024-25"}.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-28 overflow-hidden">
                  <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                  <div className="space-y-6 relative border-b border-border/40 pb-10">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Monthly Take-Home</div>
                           <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-health/10 text-health text-[9px] font-black uppercase tracking-tighter">
                                 {taxYear === "2025" ? "NEW RATES" : "OLD RATES"}
                              </div>
                              <button 
                                 onClick={handleCopy}
                                 className={cn(
                                    "p-2 rounded-lg transition-all border shadow-sm",
                                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                                 )}
                              >
                                 {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                              </button>
                           </div>
                        </div>
                        <div className={cn(
                           "font-mono font-bold tracking-tighter text-foreground leading-none",
                           results.monthlyTakeHome > 999999 ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
                        )}>
                           {Math.round(results?.monthlyTakeHome || 0).toLocaleString()}
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-border/40">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Yearly (After Tax)</div>
                        <div className={cn(
                           "font-mono font-bold tracking-tighter text-health leading-none",
                           results.annualTakeHome > 9999999 ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
                        )}>
                           Rs.{Math.round(results?.annualTakeHome || 0).toLocaleString()}
                        </div>
                     </div>

                     <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                        <Banknote className="size-3" /> Pakistan Rupees (PKR)
                     </div>
                  </div>

                  <div className="space-y-4 relative">
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Tax Analysis</div>

                     <div className="space-y-3 relative">
                        {/* MONTHLY TAX CARD */}
                        <div className="surface-card p-4 bg-destructive/5 border-destructive/20 shadow-lg shadow-destructive/5 space-y-1.5 transition-all hover:scale-[1.02] border-2">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-destructive/70">Monthly Tax</span>
                              <TrendingDown className="size-4 text-destructive" />
                           </div>
                           <p className="text-2xl font-mono font-black text-destructive leading-none">
                              -Rs.{Math.round(results?.monthlyTax || 0).toLocaleString()}
                           </p>
                           <p className="text-[9px] text-destructive/60 font-bold uppercase tracking-tight">Deducted from your monthly payout</p>
                        </div>

                        {/* YEARLY TAX CARD */}
                        <div className="surface-card p-4 bg-destructive/5 border-destructive/20 shadow-lg shadow-destructive/5 space-y-1.5 transition-all hover:scale-[1.02] border-2">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-destructive/70">Yearly Tax</span>
                              <ShieldAlert className="size-4 text-destructive" />
                           </div>
                           <p className="text-2xl font-mono font-black text-destructive leading-none">
                              -Rs.{Math.round(results?.annualTax || 0).toLocaleString()}
                           </p>
                           <p className="text-[9px] text-destructive/60 font-bold uppercase tracking-tight">Total annual liability to FBR</p>
                        </div>

                        {/* GROSS ANNUAL CARD */}
                        <div className="surface-card p-4 bg-secondary/10 border-border/40 shadow-lg space-y-1.5 transition-all hover:scale-[1.02] border-2">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gross Annual</span>
                              <Wallet className="size-4 text-muted-foreground/40" />
                           </div>
                           <p className="text-2xl font-mono font-black text-foreground leading-none">
                              Rs.{Math.round(results?.annualSalary || 0).toLocaleString()}
                           </p>
                           <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight">Total compensation before tax</p>
                        </div>
                     </div>

                     <div className="p-6 rounded-3xl bg-secondary/30 border border-border/60 space-y-4">
                        <div className="flex items-center gap-2 text-foreground/60">
                           <PieChart className="size-4" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Summary</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                           Your yearly income after tax is <strong>Rs. {Math.round(results.annualTakeHome).toLocaleString()}</strong>.
                        </p>
                     </div>

                     <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
                        <Info className="size-5 text-primary shrink-0" />
                        <div className="space-y-1">
                           <p className="text-[10px] text-foreground font-bold uppercase">Official Source</p>
                           <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
                              Calculations based on <strong>Income Tax Ordinance 2001</strong> as amended by the <strong>Finance Act 2025</strong>.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </CalculatorPage>
   );
};

export default SalaryTaxCalculator;

// Helper icons
function History(props: any) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
         <path d="M3 3v5h5" />
         <path d="M12 7v5l4 2" />
      </svg>
   );
}
