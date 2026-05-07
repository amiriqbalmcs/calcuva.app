"use client";

import { useMemo, useState } from "react";
import {
  Sun, Zap, TrendingUp, History,
  ArrowRight, Info, AlertTriangle,
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, Wallet
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("solar-net-billing-calculator-pakistan")!;

const SolarNetBilling = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [monthlyGeneration, setMonthlyGeneration] = useState<number>(1200);
  const [importRate, setImportRate] = useState<number>(62);
  const [exportRate, setExportRate] = useState<number>(11.35); // 2026 Buyback rate
  const [selfConsumptionPercent, setSelfConsumptionPercent] = useState<number>(40);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const selfUsedUnits = monthlyGeneration * (selfConsumptionPercent / 100);
    const exportedUnits = monthlyGeneration - selfUsedUnits;

    const savingsFromSelfUse = selfUsedUnits * importRate;
    const creditFromExport = exportedUnits * exportRate;
    const totalBenefit = savingsFromSelfUse + creditFromExport;

    // Fixed charges typically added in 2026 for solar users
    const fixedCharges = 1000;
    const netSavings = totalBenefit - fixedCharges;

    return {
      selfUsedUnits,
      exportedUnits,
      savingsFromSelfUse,
      creditFromExport,
      totalBenefit,
      netSavings,
      effectiveUnitRate: netSavings / monthlyGeneration
    };
  }, [monthlyGeneration, importRate, exportRate, selfConsumptionPercent]);

  const handleCopy = () => {
    const text = `Solar Net Billing 2026: Generating ${monthlyGeneration} units saves Rs. ${Math.round(results.netSavings).toLocaleString()} monthly under new Buyback rules. Calculate yours at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">

        {/* Main Interface: Side-by-Side Results & Inputs */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-32 overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

              <div className="space-y-6 relative border-b border-border/40 pb-10">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Net Monthly Benefit</div>
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
                <div className="text-5xl font-mono font-bold tracking-tighter text-health">
                  Rs.{Math.round(results.netSavings).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                    results.effectiveUnitRate > 30 ? "bg-health/10 text-health" : "bg-warning/10 text-warning"
                  )}>
                    {results.effectiveUnitRate.toFixed(1)} Rs/kWh Efficiency
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Direct Savings</span>
                  <span className="text-sm font-mono font-bold">Rs.{Math.round(results.savingsFromSelfUse).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Grid Credits</span>
                  <span className="text-sm font-mono font-bold">Rs.{Math.round(results.creditFromExport).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-border/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fixed Charges</span>
                  <span className="text-sm font-mono font-bold text-destructive">- Rs.1,000</span>
                </div>
              </div>

              <div className="p-6 bg-secondary/30 rounded-2xl border border-border/40 space-y-4">
                <div className="flex items-center gap-2 text-foreground/60">
                  <Lightbulb className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Optimization Score</span>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/40">
                    <div
                      className="h-full bg-health transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                      style={{ width: `${Math.min(100, (results.netSavings / (monthlyGeneration * importRate)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight text-center">
                    Increase self-consumption to reach 100% ROI score
                  </p>
                </div>
              </div>

              <p className="text-[9px] text-muted-foreground leading-relaxed text-center font-medium italic opacity-60">
                *Calculation based on 2026 Net Billing Tariff updates for Pakistan.
              </p>
            </div>
          </div>

          {/* Main Panel (Inputs) */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden shadow-sm rounded-3xl">
              <div className="p-8 border-b border-border/40 bg-background flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                    <Sun className="size-6 text-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Net Billing Input</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Updated for 2026 Buyback Rates</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estimated Monthly Generation (Units)</Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={monthlyGeneration || ""}
                        onChange={(e) => setMonthlyGeneration(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-3xl pl-12 focus:ring-4 ring-primary/5 transition-all"
                        placeholder="1200"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Import Rate (Grid Cost/Unit)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={importRate || ""}
                        onChange={(e) => setImportRate(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-3xl font-bold rounded-3xl pl-16 opacity-80 focus:opacity-100 transition-opacity"
                        placeholder="62"
                      />
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-sm font-bold">Rs.</div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-border/40">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      Export/Buyback Rate
                      <div className="group relative">
                        <HelpCircle className="size-3 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-foreground text-background text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          The rate NEPRA/DISCO pays you for excess units exported to the grid in 2026.
                        </div>
                      </div>
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={exportRate || ""}
                        onChange={(e) => setExportRate(Number(e.target.value) || 0)}
                        className="h-14 bg-background border-border/60 font-mono text-xl font-bold rounded-2xl pl-12"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-xs font-bold uppercase">Rs.</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Self-Consumption Ratio</Label>
                    <div className="flex items-center gap-4 pt-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selfConsumptionPercent}
                        onChange={(e) => setSelfConsumptionPercent(Number(e.target.value))}
                        className="flex-1 accent-foreground"
                      />
                      <span className="text-xs font-mono font-bold w-10">{selfConsumptionPercent}%</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground font-medium italic tracking-tight">
                      Units used directly during daytime save more money!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-foreground/5 border-t border-border/40 grid sm:grid-cols-2 gap-8">
                <div className="p-4 bg-background border border-border/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <History className="size-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Grid Export Units</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground">{Math.round(results.exportedUnits)} <span className="text-xs">kWh</span></div>
                  <p className="text-[9px] text-muted-foreground font-bold">Credited at Rs. {exportRate}/unit</p>
                </div>
                <div className="p-4 bg-background border border-border/40 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="size-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Self Consumed Units</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-health">{Math.round(results.selfUsedUnits)} <span className="text-xs">kWh</span></div>
                  <p className="text-[9px] text-muted-foreground font-bold text-health/80">Saved at Rs. {importRate}/unit</p>
                </div>
              </div>
            </div>

            <div className="surface-card p-6 bg-warning/5 border-warning/20 flex gap-4 items-start rounded-3xl">
              <AlertTriangle className="size-5 text-warning shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase text-warning tracking-widest">Net Billing Strategy Tip</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  In the 2026 Net Billing era, your savings depend on <strong>Self-Consumption</strong>. Every unit you use directly during the day saves Rs. {importRate}, while exporting only gets you Rs. {exportRate}. Use heavy appliances like AC and motors during peak sun hours!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="how-to-use" className="pt-8 border-t border-border/40">
            <div className="mb-6">
              <h3 className="text-lg font-bold tracking-tight">How to Use Solar Net Billing Calculator</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">Step-by-Step Guide</p>
            </div>
            <HowToGuide
              steps={calc.howTo!.steps}
              proTip={calc.howTo!.proTip}
              variant="horizontal"
            />
          </div>
      </div>
    </CalculatorPage>
  );
};

export default SolarNetBilling;
