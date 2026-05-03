"use client";

import { useMemo, useState } from "react";
import { 
  Briefcase, TrendingUp, Landmark, ShieldCheck, 
  ArrowRight, Info, AlertTriangle, 
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, Wallet, Globe, Banknote, Building2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("freelance-tax-residency-optimizer");

const FreelanceTaxOptimizer = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [monthlyIncome, setMonthlyIncome] = useState<number>(3000); // USD
  const [exchangeRate, setExchangeRate] = useState<number>(285);
  const [isFiler, setIsFiler] = useState<boolean>(true);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(10); // e.g., Upwork
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const grossPKR = monthlyIncome * exchangeRate;
    const platformFeePKR = grossPKR * (platformFeePercent / 100);
    const netAfterPlatform = grossPKR - platformFeePKR;

    // 2026 Estimated Tax Slabs for IT Exports (Pakistan)
    // 0.25% - 1% for filers, significantly higher for non-filers
    const taxRate = isFiler ? 0.01 : 0.05; 
    const taxAmount = netAfterPlatform * taxRate;
    
    // Bank transfer/arbitrage loss (approx 2% for standard banks vs 0.5% for Wise)
    const withdrawalLoss = netAfterPlatform * 0.015; 
    
    const takeHomePay = netAfterPlatform - taxAmount - withdrawalLoss;

    return {
      grossPKR,
      platformFeePKR,
      taxAmount,
      withdrawalLoss,
      takeHomePay,
      effectiveTaxRate: (taxAmount / grossPKR) * 100,
      monthlySavingsPotential: withdrawalLoss * 0.66 // Potential savings by switching to optimized withdrawal
    };
  }, [monthlyIncome, exchangeRate, isFiler, platformFeePercent]);

  const handleCopy = () => {
    const text = `Freelance ROI 2026: $${monthlyIncome} income gives Rs. ${Math.round(results.takeHomePay).toLocaleString()} take-home as a ${isFiler ? 'Filer' : 'Non-Filer'}. Optimize yours at ${window.location.href}`;
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
                  <Globe className="size-6 text-foreground" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Income & Platform</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">2026 Export Remittance Logic</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Income (USD)</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      value={monthlyIncome || ""}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-3xl pl-12 focus:ring-4 ring-primary/5 transition-all"
                      placeholder="3000"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">$</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expected Exchange Rate</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={exchangeRate || ""}
                      onChange={(e) => setExchangeRate(Number(e.target.value) || 0)}
                      className="h-20 bg-background border-border/60 font-mono text-3xl font-bold rounded-3xl pl-16 opacity-80 focus:opacity-100 transition-opacity"
                      placeholder="285"
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm font-bold">Rs.</div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-border/40">
                <div className="space-y-4">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform Fee (%)</Label>
                   <div className="flex gap-2">
                      {[0, 5, 10, 20].map((fee) => (
                        <button 
                          key={fee}
                          onClick={() => setPlatformFeePercent(fee)}
                          className={cn(
                            "flex-1 h-12 rounded-xl text-[10px] font-bold uppercase transition-all border",
                            platformFeePercent === fee ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground border-border hover:bg-secondary"
                          )}
                        >
                          {fee === 0 ? 'Direct' : `${fee}%`}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">FBR Status</Label>
                   <div className="flex gap-2">
                      {[true, false].map((status) => (
                        <button 
                          key={status ? 'filer' : 'non-filer'}
                          onClick={() => setIsFiler(status)}
                          className={cn(
                            "flex-1 h-12 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-2",
                            isFiler === status ? "bg-health/10 text-health border-health/20" : "bg-background text-muted-foreground border-border hover:bg-secondary"
                          )}
                        >
                          {status ? <ShieldCheck className="size-3" /> : null}
                          {status ? 'Filer' : 'Non-Filer'}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-foreground/5 border-t border-border/40 grid sm:grid-cols-3 gap-6">
               <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Building2 className="size-3" /> Gross PKR
                  </span>
                  <div className="text-xl font-mono font-bold">Rs.{Math.round(results.grossPKR).toLocaleString()}</div>
               </div>
               <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="size-3" /> Platform Fee
                  </span>
                  <div className="text-xl font-mono font-bold text-destructive">Rs.{Math.round(results.platformFeePKR).toLocaleString()}</div>
               </div>
               <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Landmark className="size-3" /> FBR Tax
                  </span>
                  <div className="text-xl font-mono font-bold text-destructive">Rs.{Math.round(results.taxAmount).toLocaleString()}</div>
               </div>
            </div>
          </div>

          <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="size-4" /> 2026 Optimization Strategies
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-health/5 border border-health/20 space-y-2">
                <p className="text-[10px] font-black text-health uppercase tracking-widest">SECP Company Benefit</p>
                <p className="text-[9px] text-muted-foreground leading-relaxed">
                  By registering a Private Limited company, you could save an additional Rs. {Math.round(results.taxAmount * 0.4).toLocaleString()} in annual tax liabilities.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Withdrawal Arbitrage</p>
                <p className="text-[9px] text-muted-foreground leading-relaxed">
                  Switching to Optimized Path (Wise &rarr; Digital Bank) can save Rs. {Math.round(results.monthlySavingsPotential).toLocaleString()} in conversion losses.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-28 overflow-hidden">
             <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

             <div className="space-y-6 relative border-b border-border/40 pb-10">
                 <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Net Take Home</div>
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
                <div className="text-4xl font-mono font-bold tracking-tighter text-foreground">
                   Rs.{Math.round(results.takeHomePay).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded bg-foreground text-background text-[9px] font-black uppercase tracking-widest">
                    {((results.takeHomePay / results.grossPKR) * 100).toFixed(1)}% Efficiency
                  </div>
                </div>
             </div>

             <div className="space-y-8 relative">
                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/60 space-y-4">
                   <div className="flex items-center gap-2 text-foreground/60">
                      <Banknote className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Loss Breakdown</span>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground">
                            <span>Tax & Fees</span>
                            <span>{Math.round((results.grossPKR - results.takeHomePay) / results.grossPKR * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/40">
                            <div 
                              className="h-full bg-destructive transition-all duration-1000 ease-out" 
                              style={{ width: `${(results.grossPKR - results.takeHomePay) / results.grossPKR * 100}%` }} 
                            />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-health/5 border border-health/10 rounded-2xl flex gap-4">
                   <Lightbulb className="size-5 text-health shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[10px] text-foreground font-bold uppercase">Pro Tip</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
                        Ensure you are registered under the correct Business Category (IT Export) to avail the 2026 concessionary tax rates.
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

export default FreelanceTaxOptimizer;
