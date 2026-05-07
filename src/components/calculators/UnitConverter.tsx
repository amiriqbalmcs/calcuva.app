"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight, Share, CheckCircle2, Globe, Info, Zap, Settings2,
  LayoutDashboard, ChevronRight, Calculator, Scale, RefreshCcw,
  Target, Activity, Sparkles, History, Landmark, Ruler, Gauge,
  Copy
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";
import { SITE_DOMAIN } from "@/lib/constants";

const calc = calculatorBySlug("unit-converter")!;

const UNITS = {
  length: { base: "Meter", units: { Millimeter: 0.001, Centimeter: 0.01, Meter: 1, Kilometer: 1000, Inch: 0.0254, Foot: 0.3048, Yard: 0.9144, Mile: 1609.344 } },
  weight: { base: "Kilogram", units: { Milligram: 0.000001, Gram: 0.001, Kilogram: 1, "Metric Ton": 1000, Ounce: 0.0283495, Pound: 0.453592, Stone: 6.35029 } },
  volume: { base: "Liter", units: { Milliliter: 0.001, Liter: 1, "Cubic Meter": 1000, "Fluid Oz (US)": 0.0295735, "Cup (US)": 0.236588, "Pint (US)": 0.473176, "Gallon (US)": 3.78541 } },
  speed: { base: "m/s", units: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, "knot": 0.514444 } },
};

const UnitConverter = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [cat, setCat] = useUrlState<keyof typeof UNITS>("ct", "length");
  const [from, setFrom] = useUrlState<string>("f", "Meter");
  const [to, setTo] = useUrlState<string>("t", "Foot");
  const [val, setVal] = useUrlState<number>("iv", 1);
  const [copied, setCopied] = useState(false);

  const unitResult = useMemo(() => {
    const u = (UNITS[cat] as any).units;
    return (val * u[from]) / u[to];
  }, [val, cat, from, to]);

  const handleCopy = () => {
    if (unitResult === null || isNaN(unitResult)) return;
    const text = `${val} ${from} = ${unitResult.toPrecision(8)} ${to}. Precision conversion via ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-6xl mx-auto space-y-12 px-4 sm:px-6">

        {/* Main Interface */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Results Column (Right on Desktop, Top on Mobile) */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-8 sticky top-32">
              <div className="space-y-6 border-b border-border/40 pb-8">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Converted Result</div>
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
                <div className="text-5xl font-mono font-bold tracking-tighter tabular-nums break-all text-foreground">
                  {Number.isFinite(unitResult) ? Number(unitResult.toPrecision(8)).toString() : "—"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-secondary/20 text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Gauge className="size-3" /> {to}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-secondary/10 border border-border/40 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Input Value</span>
                  </div>
                  <div className="text-2xl font-mono font-bold">
                    {val} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">{from}</span>
                  </div>
                </div>

                <div className="p-5 bg-secondary/20 rounded-xl flex gap-4">
                  <Zap className="size-5 text-muted-foreground shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Precision Alert</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                      Results are calculated with 8-digit precision using international standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inputs Column (Left on Desktop, Bottom on Mobile) */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-background border-border/40 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-border/40 bg-secondary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Ruler className="size-5 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold tracking-tight uppercase">Unit Converter</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Bidirectional Measurement Tool</p>
                  </div>
                </div>

                <div className="min-w-[180px]">
                  <Select value={cat} onValueChange={(v: any) => {
                    const c = v as keyof typeof UNITS;
                    setCat(c);
                    setFrom(Object.keys(UNITS[c].units)[0]);
                    setTo(Object.keys(UNITS[c].units)[1]);
                  }}>
                    <SelectTrigger className="h-10 bg-background border-border/60 font-bold rounded-lg shadow-sm capitalize px-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(UNITS).map(c => <SelectItem key={c} value={c} className="capitalize font-bold">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-8">
                <div className="grid sm:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">From Unit</Label>
                      <Select value={from} onValueChange={setFrom}>
                        <SelectTrigger className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm px-4"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.keys((UNITS[cat] as any).units).map(u => <SelectItem key={u} value={u} className="font-bold">{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Value</Label>
                      <Input
                        type="number"
                        value={val || ""}
                        onChange={e => setVal(Number(e.target.value) || 0)}
                        className="h-12 bg-background border-border/60 font-mono text-xl font-bold rounded-xl shadow-sm text-center"
                      />
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-center gap-4">
                    <div className="h-px w-full bg-border/40 hidden sm:block" />
                    <button
                      onClick={() => { setFrom(to); setTo(from); }}
                      className="size-12 rounded-full bg-background border border-border/60 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md group/swap"
                    >
                      <ArrowLeftRight className="size-4 text-muted-foreground group-hover/swap:text-foreground transition-colors" />
                    </button>
                    <div className="h-px w-full bg-border/40 hidden sm:block" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">To Unit</Label>
                      <Select value={to} onValueChange={setTo}>
                        <SelectTrigger className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm px-4"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.keys((UNITS[cat] as any).units).map(u => <SelectItem key={u} value={u} className="font-bold">{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="h-12 bg-secondary/20 border border-border/30 rounded-xl flex items-center justify-center">
                      <div className="text-xl font-mono font-bold text-muted-foreground">
                        {Number.isFinite(unitResult) ? Number(unitResult.toPrecision(6)).toString() : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-secondary/5 border-t border-border/40 flex justify-between gap-4 text-center">
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Standard</span>
                  <div className="text-xs font-bold">International</div>
                </div>
                <div className="flex-1 space-y-1 border-x border-border/40">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Accuracy</span>
                  <div className="text-xs font-bold">High</div>
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Mode</span>
                  <div className="text-xs font-bold capitalize">{cat}</div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="surface-card p-6 bg-background border-border/40 space-y-2 rounded-2xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Globe className="size-3" /> Metric & Imperial
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Standardized conversion factors ensure accuracy across scientific and trade applications.</p>
              </div>
              <div className="surface-card p-6 bg-background border-border/40 space-y-2 rounded-2xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Scale className="size-3" /> Scientific Precision
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">Calculated with high-precision constants following International System of Units (SI).</p>
              </div>
            </div>
          </div>
        </div>

        {/* How-To Section */}
        {calc.howTo && (
          <div id="how-to-use" className="mt-12 pt-12 border-t border-border/40">
            <HowToGuide
              steps={calc.howTo!.steps}
              proTip={calc.howTo!.proTip}
              variant="horizontal"
            />
          </div>
        )}
      </div>
    </CalculatorPage>
  );
};

export default UnitConverter;
