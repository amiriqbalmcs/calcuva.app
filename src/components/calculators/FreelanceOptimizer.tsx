"use client";

import { useMemo, useState } from "react";
import {
   Coins, Wallet, TrendingDown, ArrowRight,
   ShieldCheck, Landmark, Receipt, PieChart,
   Globe, Briefcase, CreditCard, Banknote,
   Info, AlertTriangle, Scale, RefreshCw, Activity,
   LayoutGrid, MousePointer2, ShieldAlert, CheckCircle2, Copy, Zap
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("freelance-fee-optimizer")!;

const PLATFORMS = [
   { id: "upwork", label: "Upwork", sub: "10% Flat Fee", fee: 0.10, flat: 0 },
   { id: "fiverr", label: "Fiverr", sub: "20% Commission", fee: 0.20, flat: 0 },
   { id: "direct", label: "Direct Client", sub: "Stripe/Paypal (~3%)", fee: 0.03, flat: 0.30 },
];

const WITHDRAWAL_PATHS = [
   { id: "wise", label: "Wise (Direct)", sub: "Mid-Market (0.5%)", fixedFee: 0, spread: 0.005 },
   { id: "payoneer", label: "Payoneer", sub: "$2 + 2% Spread", fixedFee: 2, spread: 0.02 },
   { id: "binance", label: "Binance P2P", sub: "Premium Rate (+1%)", fixedFee: 0, spread: -0.01 }, // Negative spread means premium
   { id: "wire", label: "Direct Wire", sub: "$30 + Local Fee", fixedFee: 45, spread: 0.005 },
];

const FreelanceOptimizer = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
   const [amount, setAmount] = useState<number>(1000);
   const [platformId, setPlatformId] = useState<string>("upwork");
   const [pathId, setPathId] = useState<string>("wise");
   const [exchangeRate, setExchangeRate] = useState<number>(278);
   const [copied, setCopied] = useState(false);

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
         platform,
         path,
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

   const handleCopy = () => {
      const text = `Freelance Fee Optimizer: $${amount} contract -> $${Math.round(results.finalUsd)} take-home. Efficiency: ${(100 - results.totalLostPercent).toFixed(1)}%. Optimized via Calcuva.`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   if (!calc) return null;

   return (
      <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles} hideHeaderCurrency={true}>
         <div className="max-w-5xl mx-auto space-y-10">

            {/* Phase 1: The Contract */}
            <div className="surface-card p-8 md:p-12 bg-background border-border/60 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 size-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <Zap className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 group-hover:-rotate-6 transition-transform duration-1000" />

               <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                           <Briefcase className="size-3" /> Freelance Contract
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">How much are you charging?</h2>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">We'll help you calculate the exact amount that hits your bank account.</p>
                     </div>

                     <div className="relative max-w-sm group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-2xl font-mono font-bold text-muted-foreground group-focus-within:text-primary transition-colors">$</div>
                        <Input
                           type="number"
                           value={amount || ""}
                           onChange={(e) => setAmount(Number(e.target.value) || 0)}
                           className="h-20 bg-secondary/10 border-border/40 font-mono text-4xl font-bold rounded-2xl pl-12 pr-6 focus:ring-4 ring-primary/5 transition-all shadow-inner"
                           placeholder="1000"
                        />
                     </div>
                  </div>

                  <div className="bg-secondary/5 border border-border/40 rounded-2xl p-8 space-y-8">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Exchange Rate</span>
                        <span className="text-xs font-mono font-bold">{exchangeRate} PKR/$</span>
                     </div>
                     <input
                        type="range" min="250" max="320" value={exchangeRate}
                        onChange={(e) => setExchangeRate(Number(e.target.value))}
                        className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                     />
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter text-muted-foreground/40">
                        <span>Min (250)</span>
                        <span>Current Market</span>
                        <span>Max (320)</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Phase 2: Selection & Flow */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">

               {/* Left: Configuration */}
               <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 px-2">
                        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">1</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Select Platform</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                        {PLATFORMS.map((p) => (
                           <button
                              key={p.id}
                              onClick={() => setPlatformId(p.id)}
                              className={cn(
                                 "p-5 border rounded-2xl transition-all text-left flex items-center justify-between group",
                                 platformId === p.id ? "bg-background border-primary shadow-md ring-1 ring-primary/10" : "bg-secondary/10 border-border/40 hover:border-foreground/20"
                              )}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={cn("size-10 rounded-xl flex items-center justify-center transition-colors", platformId === p.id ? "bg-primary/10 text-primary" : "bg-background text-muted-foreground")}>
                                    <Globe className="size-5" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-bold text-foreground uppercase tracking-tight">{p.label}</p>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{p.sub}</p>
                                 </div>
                              </div>
                              {platformId === p.id && <CheckCircle2 className="size-4 text-primary" />}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-3 px-2">
                        <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">2</div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Withdrawal Method</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                        {WITHDRAWAL_PATHS.map((path) => (
                           <button
                              key={path.id}
                              onClick={() => setPathId(path.id)}
                              className={cn(
                                 "p-5 border rounded-2xl transition-all text-left flex items-center justify-between group",
                                 pathId === path.id ? "bg-background border-primary shadow-md ring-1 ring-primary/10" : "bg-secondary/10 border-border/40 hover:border-foreground/20"
                              )}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={cn("size-10 rounded-xl flex items-center justify-center transition-colors", pathId === path.id ? "bg-primary/10 text-primary" : "bg-background text-muted-foreground")}>
                                    <Landmark className="size-5" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-bold text-foreground uppercase tracking-tight">{path.label}</p>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{path.sub}</p>
                                 </div>
                              </div>
                              {pathId === path.id && <CheckCircle2 className="size-4 text-primary" />}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right: Analysis & Summary */}
               <div className="lg:col-span-7 space-y-8">
                  <div className="surface-card p-8 md:p-10 bg-background border-border/60 shadow-xl space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Calculation Summary</div>
                        <button onClick={handleCopy} className="p-2 rounded-xl border border-border/40 hover:bg-secondary transition-colors">
                           {copied ? <CheckCircle2 className="size-4 text-health" /> : <Copy className="size-4 text-muted-foreground" />}
                        </button>
                     </div>

                     <div className="space-y-10">
                        <div className="flex flex-col gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-health">Est. Local Bank Deposit</span>
                           <div className="text-4xl sm:text-5xl md:text-6xl font-mono font-black text-foreground tracking-tighter tabular-nums leading-none break-all">
                              Rs. {Math.round(results.finalLocal).toLocaleString()}
                           </div>
                           <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-2">
                              EQUIVALENT TO <span className="text-foreground">${Math.round(results.finalUsd).toLocaleString()} USD</span> AFTER ALL FEES
                           </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                           <div className="p-6 rounded-2xl bg-secondary/5 border border-border/40 space-y-2">
                              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                 <Activity className="size-3" /> Payout Efficiency
                              </div>
                              <div className="text-2xl font-mono font-black text-foreground">{(100 - results.totalLostPercent).toFixed(1)}%</div>
                              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                 <div className="h-full bg-health transition-all duration-1000" style={{ width: `${100 - results.totalLostPercent}%` }} />
                              </div>
                           </div>
                           <div className="p-6 rounded-2xl bg-destructive/5 border-destructive/10 space-y-2">
                              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-destructive">
                                 <TrendingDown className="size-3" /> Total Fee Leakage
                              </div>
                              <div className="text-2xl font-mono font-black text-destructive">-${Math.round(results.totalLost).toLocaleString()}</div>
                              <p className="text-[9px] text-destructive/60 font-bold uppercase tracking-tight">Amount lost to intermediaries</p>
                           </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border/40">
                           <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Detailed Breakdown</div>

                           <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-border/40">
                              <div className="flex items-center gap-3">
                                 <Globe className="size-4 text-muted-foreground" />
                                 <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{results.platform.label} Fee</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-destructive">-${results.platformFee.toFixed(2)}</span>
                           </div>

                           <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-border/40">
                              <div className="flex items-center gap-3">
                                 <Landmark className="size-4 text-muted-foreground" />
                                 <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{results.path.label} Withdrawal</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-destructive">-${results.totalWithdrawalFees.toFixed(2)}</span>
                           </div>

                           <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                              <div className="flex items-center gap-3">
                                 <Coins className="size-4 text-primary" />
                                 <span className="text-[10px] font-bold text-primary uppercase tracking-tight">Effective FX Rate</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-primary">{results.effectiveExchangeRate.toFixed(2)} PKR</span>
                           </div>
                        </div>

                        <div className="p-6 bg-finance/5 border border-finance/20 rounded-2xl space-y-3">
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-finance">
                              <Info className="size-4" /> Pro Optimization Tip
                           </div>
                           <p className="text-[11px] text-muted-foreground leading-relaxed font-medium uppercase italic">
                              {results.platform.id === 'fiverr'
                                 ? "Fiverr takes a flat 20%. Moving a long-term client to a direct invoicing platform could save you **$" + (amount * 0.17).toFixed(0) + "** on this contract."
                                 : "Your current path is **" + (100 - results.totalLostPercent).toFixed(1) + "%** efficient. Switching to a direct Wise transfer could potentially improve your yield by another 1-2%."
                              }
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Documentation Footer */}
            {calc.howTo && (
               <div className="mt-16 pt-16 border-t border-border/40">
                  <div className="max-w-4xl mx-auto">
                     <HowToGuide
                        id="how-to-use"
                        steps={calc.howTo!.steps}
                        proTip={calc.howTo!.proTip}
                        variant="horizontal"
                     />
                  </div>
               </div>
            )}
         </div>
      </CalculatorPage>
   );
};

export default FreelanceOptimizer;
