"use client";

import { useMemo, useState } from "react";
import { 
  Coins, Wallet, TrendingDown, ArrowRight, 
  ShieldCheck, Landmark, Receipt, PieChart, 
  Globe, Briefcase, CreditCard, Banknote,
  Info, AlertTriangle, Scale, RefreshCw,
  LayoutGrid, MousePointer2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("freelance-fee-optimizer");

const PLATFORMS = [
  { id: "upwork", label: "Upwork", sub: "10% Flat Fee", fee: 0.10, flat: 0 },
  { id: "fiverr", label: "Fiverr", sub: "20% Commission", fee: 0.20, flat: 0 },
  { id: "direct", label: "Direct Client", sub: "Stripe/Paypal (~3%)", fee: 0.03, flat: 0.30 },
];

const WITHDRAWAL_PATHS = [
  { id: "wise", label: "Wise", sub: "Mid-Market Rate", fixedFee: 0, spread: 0.005 },
  { id: "payoneer", label: "Payoneer", sub: "$2 + 2% Spread", fixedFee: 2, spread: 0.02 },
  { id: "wire", label: "Bank Wire", sub: "$30 Fixed Fee", fixedFee: 30, spread: 0.01 },
];

const FreelanceOptimizer = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [amount, setAmount] = useState<number>(1000);
  const [platformId, setPlatformId] = useState<string>("upwork");
  const [pathId, setPathId] = useState<string>("payoneer");
  const [exchangeRate, setExchangeRate] = useState<number>(278);

  const results = useMemo(() => {
    const platform = PLATFORMS.find(p => p.id === platformId)!;
    const path = WITHDRAWAL_PATHS.find(p => p.id === pathId)!;

    const platformFee = (amount * platform.fee) + platform.flat;
    const afterPlatform = amount - platformFee;

    const fixedFee = path.fixedFee;
    const spreadFee = afterPlatform * path.spread;
    const totalWithdrawalFees = fixedFee + spreadFee;
    
    const finalUsd = afterPlatform - totalWithdrawalFees;
    const effectiveExchangeRate = exchangeRate * (1 - path.spread);
    const finalLocal = finalUsd * effectiveExchangeRate; 

    const totalLost = amount - finalUsd;
    const totalLostPercent = (totalLost / amount) * 100;

    return {
      platformFee,
      afterPlatform,
      fixedFee,
      spreadFee,
      totalWithdrawalFees,
      finalUsd,
      finalLocal,
      totalLost,
      totalLostPercent,
      effectiveExchangeRate
    };
  }, [amount, platformId, pathId, exchangeRate]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border/40 bg-background flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                     <Briefcase className="size-6 text-foreground" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Revenue Simulator</h3>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Calculate your real-world take home pay</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 space-y-12">
               {/* STEP 1: AMOUNT */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2">
                     <div className="size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">1</div>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contract Value (USD)</Label>
                  </div>
                  <div className="relative group">
                     <Input
                        type="number"
                        value={amount || ""}
                        onChange={(e) => setAmount(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-5xl font-bold rounded-3xl pl-20 focus:ring-4 ring-primary/5 transition-all"
                        placeholder="0"
                     />
                     <div className="absolute left-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">$</div>
                  </div>
               </div>

               {/* STEP 2: PLATFORM */}
               <div className="space-y-6 pt-6 border-t border-border/40">
                  <div className="flex items-center gap-2">
                     <div className="size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">2</div>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source Platform</Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     {PLATFORMS.map((p) => (
                        <button 
                           key={p.id}
                           onClick={() => setPlatformId(p.id)}
                           className={cn("p-6 border rounded-3xl transition-all text-left group relative overflow-hidden", 
                              platformId === p.id ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-background border-border/60 hover:border-foreground/20")
                           }
                        >
                           <div className="space-y-1 relative z-10">
                              <p className={cn("text-xs font-black uppercase tracking-tight", platformId === p.id ? "text-foreground" : "text-muted-foreground")}>{p.label}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase">{p.sub}</p>
                           </div>
                           {platformId === p.id && (
                              <div className="absolute top-0 right-0 p-3">
                                 <ShieldCheck className="size-4 text-primary" />
                              </div>
                           )}
                        </button>
                     ))}
                  </div>
               </div>

               {/* STEP 3: WITHDRAWAL */}
               <div className="space-y-6 pt-6 border-t border-border/40">
                  <div className="flex items-center gap-2">
                     <div className="size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">3</div>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Withdrawal Method</Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     {WITHDRAWAL_PATHS.map((path) => (
                        <button 
                           key={path.id}
                           onClick={() => setPathId(path.id)}
                           className={cn("p-6 border rounded-3xl transition-all text-left group relative overflow-hidden", 
                              pathId === path.id ? "bg-primary/5 border-primary/40 shadow-sm" : "bg-background border-border/60 hover:border-foreground/20")
                           }
                        >
                           <div className="space-y-1 relative z-10">
                              <p className={cn("text-xs font-black uppercase tracking-tight", pathId === path.id ? "text-foreground" : "text-muted-foreground")}>{path.label}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase">{path.sub}</p>
                           </div>
                           {pathId === path.id && (
                              <div className="absolute top-0 right-0 p-3">
                                 <ShieldCheck className="size-4 text-primary" />
                              </div>
                           )}
                        </button>
                     ))}
                  </div>
               </div>

               {/* STEP 4: EXCHANGE RATE */}
               <div className="space-y-6 pt-6 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">4</div>
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Market Exchange Rate (PKR)</Label>
                    </div>
                    <span className="text-xs font-mono font-bold text-foreground">{exchangeRate} PKR/$</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="400" 
                    step="1"
                    value={exchangeRate} 
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className="w-full accent-foreground"
                  />
                  <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-border/40 flex items-center gap-3">
                     <Info className="size-4 text-muted-foreground" />
                     <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">Adjust to match today's Google/Interbank rate for local bank landing estimation.</p>
                  </div>
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
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Take-Home</div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-health/10 text-health text-[9px] font-black uppercase tracking-tighter">
                         NET LANDING
                      </div>
                   </div>
                   <div className="text-6xl font-mono font-bold tracking-tighter text-foreground">
                      ${Math.round(results?.finalUsd || 0).toLocaleString()}
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">PKR Value (Bank)</div>
                   <div className="text-4xl font-mono font-bold tracking-tighter text-health">
                      Rs.{Math.round(results?.finalLocal || 0).toLocaleString()}
                   </div>
                </div>

                <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                   <Globe className="size-3" /> Effective Rate: {results?.effectiveExchangeRate.toFixed(2)} PKR
                </div>
             </div>

             <div className="space-y-8 relative">
                <div className="space-y-5">
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Total Fees</span>
                      <span className="text-destructive font-mono">-${results?.totalLost.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Fee Leakage</span>
                      <span className="text-destructive font-mono">{results?.totalLostPercent.toFixed(1)}%</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>Platform Cut</span>
                      <span className="text-foreground font-mono">-${results?.platformFee.toFixed(2)}</span>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/60 space-y-4">
                   <div className="flex items-center gap-2 text-foreground/60">
                      <PieChart className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Efficiency</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                         <span>Profitability</span>
                         <span>{(100 - (results?.totalLostPercent || 0)).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/40">
                         <div 
                           className="h-full bg-primary transition-all duration-1000 ease-out" 
                           style={{ width: `${100 - (results?.totalLostPercent || 0)}%` }} 
                         />
                      </div>
                   </div>
                </div>
                
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
                   <ShieldCheck className="size-5 text-primary shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[10px] text-foreground font-bold uppercase">Optimized Path</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
                         Your {WITHDRAWAL_PATHS.find(p => p.id === pathId)?.label} spread is approximately **{((1 - results.effectiveExchangeRate / exchangeRate) * 100).toFixed(1)}%**.
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

export default FreelanceOptimizer;
