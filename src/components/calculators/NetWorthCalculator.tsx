"use client";

import { useMemo, useState } from "react";
import {
   Briefcase, TrendingUp, Info, BookOpen, Target,
   ChevronRight, Calculator, Scale, RefreshCcw, Activity,
   Sparkles, Globe, Copy, Award, AlertCircle, Plus, Trash2,
   Building, Wallet, Landmark, PieChart, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("net-worth-tracker")!;

interface Item { id: string; name: string; value: number; }
const newItem = (n = 1): Item => ({ id: `i-${n}-${Date.now()}`, name: `Item ${n}`, value: 1000 });

const NetWorthCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
   const { currency } = useCurrency();
   const [assets, setAssets] = useState<Item[]>([
      { id: "a-1", name: "Savings Account", value: 450000 },
      { id: "a-2", name: "Gold / Jewelry", value: 1200000 },
      { id: "a-3", name: "Property / Plot", value: 15000000 }
   ]);
   const [liabilities, setLiabilities] = useState<Item[]>([
      { id: "l-1", name: "Home Loan", value: 4500000 },
      { id: "l-2", name: "Credit Card Debt", value: 85000 }
   ]);
   const [copied, setCopied] = useState(false);

   const result = useMemo(() => {
      const totalAssets = assets.reduce((s, i) => s + (i.value || 0), 0);
      const totalLiabilities = liabilities.reduce((s, i) => s + (i.value || 0), 0);
      const netWorth = totalAssets - totalLiabilities;
      const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

      return { totalAssets, totalLiabilities, netWorth, debtRatio };
   }, [assets, liabilities]);

   const handleCopy = () => {
      const text = `Financial Net Worth: ${currency.symbol}${Math.round(result.netWorth).toLocaleString()} (Assets: ${currency.symbol}${Math.round(result.totalAssets).toLocaleString()} | Debt: ${currency.symbol}${Math.round(result.totalLiabilities).toLocaleString()}). Track your wealth at ${window.location.href}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   const updateAsset = (id: string, val: number) => setAssets(as => as.map(a => a.id === id ? { ...a, value: val } : a));
   const updateAssetLabel = (id: string, name: string) => setAssets(as => as.map(a => a.id === id ? { ...a, name } : a));
   const updateLiab = (id: string, val: number) => setLiabilities(ls => ls.map(l => l.id === id ? { ...l, value: val } : l));
   const updateLiabLabel = (id: string, name: string) => setLiabilities(ls => ls.map(l => l.id === id ? { ...l, name } : l));

   const removeAsset = (id: string) => setAssets(as => as.filter(a => a.id !== id));
   const removeLiab = (id: string) => setLiabilities(ls => ls.filter(l => l.id !== id));

   if (!calc) return null;

   return (
      <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
         <div className="grid lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">

            {/* Results Panel */}
            <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
               <div className="surface-card p-8 bg-background border-border/60 shadow-xl sticky top-24">
                  <div className="space-y-12">
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Total Net Worth</div>
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
                        <div className={cn("text-6xl font-mono font-bold tracking-tighter tabular-nums",
                           result.netWorth >= 0 ? "text-foreground" : "text-destructive"
                        )}>
                           {Math.round(result.netWorth / 1000000).toLocaleString()}<span className="text-2xl ml-1 opacity-20">M</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-muted-foreground opacity-60">
                           {currency.symbol} {Math.round(result.netWorth).toLocaleString()}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/40">
                        <div className="space-y-1">
                           <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-health">Assets</div>
                           <div className="text-xl font-bold tracking-tight">{Math.round(result.totalAssets / 100000).toLocaleString()}L</div>
                        </div>
                        <div className="space-y-1">
                           <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive">Debt</div>
                           <div className="text-xl font-bold tracking-tight">{Math.round(result.totalLiabilities / 100000).toLocaleString()}L</div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                           <span>Debt-to-Asset Ratio</span>
                           <span className={cn(result.debtRatio > 50 ? "text-destructive" : "text-health")}>{result.debtRatio.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                           <div
                              className={cn("h-full transition-all duration-700", result.debtRatio > 50 ? "bg-destructive" : "bg-health")}
                              style={{ width: `${Math.min(100, result.debtRatio)}%` }}
                           />
                        </div>
                     </div>

                     <div className="p-6 rounded-2xl bg-foreground/5 border border-border/30">
                        <div className="flex items-center gap-2 mb-3 text-foreground/60">
                           <PieChart className="size-4" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Financial Health</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                           {result.debtRatio < 30
                              ? "Strong Portfolio: You have high equity in your assets and low debt pressure."
                              : result.debtRatio < 50
                                 ? "Moderate Standing: Your debt levels are manageable but require consistent tracking."
                                 : "High Leverage: A large portion of your assets is financed. Consider paying down high-interest liabilities."}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Input Panel */}
            <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">

               {/* Assets Section */}
               <div className="surface-card bg-health/5 border-health/10 overflow-hidden shadow-sm">
                  <div className="p-6 md:p-8 border-b border-health/20 flex items-center justify-between bg-background">
                     <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-health/10 flex items-center justify-center text-health">
                           <Landmark className="size-5" />
                        </div>
                        <div className="space-y-0.5">
                           <h3 className="text-sm font-bold tracking-tight">Your Assets</h3>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">What You Own</p>
                        </div>
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssets(as => [...as, newItem(as.length + 1)])}
                        className="h-9 px-4 text-[10px] font-bold tracking-widest border-health/20 text-health hover:bg-health hover:text-white transition-all rounded-xl"
                     >
                        <Plus className="size-3 mr-2" /> ADD ASSET
                     </Button>
                  </div>
                  <div className="divide-y divide-health/10 max-h-[400px] overflow-y-auto">
                     {assets.map((a) => (
                        <div key={a.id} className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-background transition-all group">
                           <div className="col-span-7">
                              <Input
                                 value={a.name}
                                 onChange={(e) => updateAssetLabel(a.id, e.target.value)}
                                 className="bg-transparent border-none font-bold text-sm h-10 focus-visible:ring-0 px-0"
                              />
                           </div>
                           <div className="col-span-4 relative">
                              <Input
                                 type="number"
                                 value={a.value}
                                 onChange={(e) => updateAsset(a.id, Number(e.target.value) || 0)}
                                 className="h-10 bg-background border-border/40 font-mono text-sm font-bold rounded-lg pl-12 text-right"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground opacity-40">{currency.symbol}</span>
                           </div>
                           <div className="col-span-1 flex justify-end">
                              <Button variant="ghost" size="icon" onClick={() => removeAsset(a.id)} className="size-8 text-health/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                 <Trash2 className="size-4" />
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Liabilities Section */}
               <div className="surface-card bg-destructive/5 border-destructive/10 overflow-hidden shadow-sm">
                  <div className="p-6 md:p-8 border-b border-destructive/20 flex items-center justify-between bg-background">
                     <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                           <Wallet className="size-5" />
                        </div>
                        <div className="space-y-0.5">
                           <h3 className="text-sm font-bold tracking-tight">Your Liabilities</h3>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">What You Owe</p>
                        </div>
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLiabilities(ls => [...ls, newItem(ls.length + 1)])}
                        className="h-9 px-4 text-[10px] font-bold tracking-widest border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all rounded-xl"
                     >
                        <Plus className="size-3 mr-2" /> ADD LIABILITY
                     </Button>
                  </div>
                  <div className="divide-y divide-destructive/10 max-h-[400px] overflow-y-auto">
                     {liabilities.map((l) => (
                        <div key={l.id} className="p-6 grid grid-cols-12 gap-4 items-center hover:bg-background transition-all group">
                           <div className="col-span-7">
                              <Input
                                 value={l.name}
                                 onChange={(e) => updateLiabLabel(l.id, e.target.value)}
                                 className="bg-transparent border-none font-bold text-sm h-10 focus-visible:ring-0 px-0"
                              />
                           </div>
                           <div className="col-span-4 relative">
                              <Input
                                 type="number"
                                 value={l.value}
                                 onChange={(e) => updateLiab(l.id, Number(e.target.value) || 0)}
                                 className="h-10 bg-background border-border/40 font-mono text-sm font-bold rounded-lg pl-12 text-right"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground opacity-40">{currency.symbol}</span>
                           </div>
                           <div className="col-span-1 flex justify-end">
                              <Button variant="ghost" size="icon" onClick={() => removeLiab(l.id)} className="size-8 text-destructive/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                 <Trash2 className="size-4" />
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {calc.howTo && (
                  <HowToGuide
                     id='how-to-use'
                     steps={calc.howTo!.steps}
                     proTip={calc.howTo!.proTip}
                  />
               )}
            </div>
         </div>
      </CalculatorPage>
   );
};

export default NetWorthCalculator;
