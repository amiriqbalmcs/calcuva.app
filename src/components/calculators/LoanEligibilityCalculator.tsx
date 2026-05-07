"use client";

import { useMemo, useState } from "react";
import {
   Landmark, TrendingUp, Info, BookOpen, Target,
   ChevronRight, Calculator, Scale, RefreshCcw, Activity,
   Sparkles, Globe, Copy, Award, AlertCircle, Banknote, ShieldCheck, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("loan-eligibility-calculator-pakistan")!;

const LoanEligibilityCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
   const [salary, setSalary] = useState<number>(100000);
   const [existingEmi, setExistingEmi] = useState<number>(0);
   const [interestRate, setInterestRate] = useState<number>(14);
   const [tenure, setTenure] = useState<number>(20);
   const [dtiRatio, setDtiRatio] = useState<number>(40);
   const [copied, setCopied] = useState(false);

   const result = useMemo(() => {
      const allowedMonthlyDti = (salary * dtiRatio) / 100;
      const availableForNewEmi = Math.max(0, allowedMonthlyDti - existingEmi);

      // Reverse EMI Formula: P = E * [ (1+r)^n - 1 ] / [ r * (1+r)^n ]
      const r = interestRate / 12 / 100;
      const n = tenure * 12;

      let maxLoan = 0;
      if (r > 0) {
         maxLoan = availableForNewEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      } else {
         maxLoan = availableForNewEmi * n;
      }

      return {
         maxLoan,
         availableForNewEmi,
         allowedMonthlyDti,
         isEligible: salary >= 35000
      };
   }, [salary, existingEmi, interestRate, tenure, dtiRatio]);

   const handleCopy = () => {
      const text = `Loan Eligibility Analysis: Monthly Salary Rs. ${salary.toLocaleString()} | Max Loan: Rs. ${Math.round(result.maxLoan).toLocaleString()} (${Math.round(result.maxLoan / 100000)} Lac) | EMI Allowed: Rs. ${Math.round(result.availableForNewEmi).toLocaleString()}. Check eligibility at ${window.location.href}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   if (!calc) return null;

   return (
      <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
         <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

            {/* Results Panel */}
            <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
               <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden">
                  <div className="space-y-10 relative z-10">
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                              <Calculator className="size-3" /> Max Loan Eligibility
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
                        <div className="text-6xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                           {Math.round(result.maxLoan / 100000).toLocaleString()}<span className="text-xl ml-1 opacity-20">Lac</span>
                        </div>
                        <div className="text-sm font-mono text-muted-foreground opacity-60">
                           ~ Rs. {Math.round(result.maxLoan).toLocaleString()}
                        </div>
                     </div>

                     <div className="space-y-6 pt-8 border-t border-border/40">
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Allowed Monthly EMI</div>
                              <div className="text-2xl font-bold tracking-tight text-health">Rs. {Math.round(result.availableForNewEmi).toLocaleString()}</div>
                           </div>
                        </div>

                        <div className={cn("p-5 rounded-2xl border space-y-3", result.isEligible ? "bg-health/5 border-health/10" : "bg-destructive/5 border-destructive/10")}>
                           <div className="flex items-center gap-2 text-foreground/60">
                              {result.isEligible ? <Award className="size-4 text-health" /> : <AlertCircle className="size-4 text-destructive" />}
                              <span className="text-[10px] font-bold uppercase tracking-widest">{result.isEligible ? "Likely Eligible" : "Action Required"}</span>
                           </div>
                           <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                              {result.isEligible
                                 ? "Your profile meets the basic salary and DTI requirements for major Pakistani commercial banks."
                                 : "Your current salary is below the standard minimum (Rs. 35k) required by most banking institutions."}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Input Panel */}
            <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
               <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
                  <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
                     <div className="flex items-center gap-3 relative z-10">
                        <ShieldCheck className="size-5 text-muted-foreground/60" />
                        <div className="space-y-0.5">
                           <h3 className="text-sm font-bold tracking-tight">Financial Profile</h3>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Verify your bank eligibility</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 space-y-8">
                     <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Net Monthly Salary (PKR)</Label>
                        <div className="relative">
                           <Input
                              type="number"
                              value={salary}
                              onChange={(e) => setSalary(Number(e.target.value) || 0)}
                              className="h-14 bg-background border-border/60 font-mono text-2xl font-bold rounded-xl shadow-sm pl-12 tabular-nums"
                           />
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs font-bold">Rs.</div>
                        </div>
                        {salary < 35000 && (
                           <p className="text-[10px] text-destructive font-bold flex items-center gap-1 animate-in fade-in">
                              <AlertCircle className="size-3" /> Most banks require a minimum salary of PKR 35,000.
                           </p>
                        )}
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Interest Rate (KIBOR+)</Label>
                           <div className="relative">
                              <Input
                                 type="number"
                                 value={interestRate}
                                 onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                                 className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums"
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs">%</div>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Tenure (Years)</Label>
                           <Input
                              type="number"
                              value={tenure}
                              onChange={(e) => setTenure(Number(e.target.value) || 0)}
                              className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums"
                           />
                        </div>
                     </div>

                     <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                           <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Debt-to-Income (DTI) Ratio: {dtiRatio}%</Label>
                           <span className="text-[10px] font-bold text-muted-foreground">SBP Max: 65%</span>
                        </div>
                        <Slider
                           aria-label="DTI Ratio"
                           value={[dtiRatio]}
                           min={20}
                           max={65}
                           step={1}
                           onValueChange={([v]) => setDtiRatio(v)}
                        />
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                           Most banks use 40% for car loans and up to 65% for home loans.
                        </p>
                     </div>
                  </div>
               </div>

               {calc.howTo && (
                  <HowToGuide
                     id="how-to-use"
                     steps={calc.howTo!.steps}
                     proTip={calc.howTo!.proTip}
                  />
               )}
            </div>
         </div>
      </CalculatorPage>
   );
};

export default LoanEligibilityCalculator;
