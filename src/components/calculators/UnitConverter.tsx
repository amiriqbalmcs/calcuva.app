"use client";

import { useMemo, useState } from "react";
import { 
  ArrowLeftRight, Share, CheckCircle2, Globe, Info, Zap, Settings2, 
  LayoutDashboard, ChevronRight, Calculator, Scale, RefreshCcw, 
  Target, Activity, Sparkles, History, Landmark, Ruler, Gauge, 
  Copy
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";
import { SITE_DOMAIN } from "@/lib/constants";

const calc = calculatorBySlug("unit-converter");

const UNITS = {
  length: { base: "Meter", units: { Millimeter: 0.001, Centimeter: 0.01, Meter: 1, Kilometer: 1000, Inch: 0.0254, Foot: 0.3048, Yard: 0.9144, Mile: 1609.344 } },
  weight: { base: "Kilogram", units: { Milligram: 0.000001, Gram: 0.001, Kilogram: 1, "Metric Ton": 1000, Ounce: 0.0283495, Pound: 0.453592, Stone: 6.35029 } },
  volume: { base: "Liter", units: { Milliliter: 0.001, Liter: 1, "Cubic Meter": 1000, "Fluid Oz (US)": 0.0295735, "Cup (US)": 0.236588, "Pint (US)": 0.473176, "Gallon (US)": 3.78541 } },
  speed: { base: "m/s", units: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, "knot": 0.514444 } },
};

const UnitConverter = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
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
    const text = `${val} ${from} = ${unitResult.toPrecision(8)} ${to}. Precision conversion via ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group">
              <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
              
              <div className="space-y-1 relative z-10">
                <h3 className="text-sm font-bold tracking-tight">Choose Category</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Select What to Convert</p>
              </div>
 
              <div className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                  <Select value={cat} onValueChange={(v: any) => { 
                    const c = v as keyof typeof UNITS;
                    setCat(c); 
                    setFrom(Object.keys(UNITS[c].units)[0]); 
                    setTo(Object.keys(UNITS[c].units)[1]); 
                  }}>
                    <SelectTrigger className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(UNITS).map(c => <SelectItem key={c} value={c} className="capitalize font-bold">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
 
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From Unit</Label>
                    <Select value={from} onValueChange={setFrom}>
                      <SelectTrigger className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.keys((UNITS[cat] as any).units).map(u => <SelectItem key={u} value={u} className="font-bold">{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input 
                      type="number" 
                      value={val} 
                      onChange={e => setVal(Number(e.target.value) || 0)} 
                      className="h-11 bg-background border-border/60 font-bold text-lg rounded-xl shadow-sm" 
                    />
                  </div>
 
                  <div className="flex justify-center py-2">
                    <button 
                      onClick={() => { setFrom(to); setTo(from); }} 
                      className="size-10 rounded-full bg-background border border-border/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md group/swap"
                    >
                      <ArrowLeftRight className="size-4 text-muted-foreground group-hover/swap:text-foreground transition-colors" />
                    </button>
                  </div>
 
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">To Unit</Label>
                    <Select value={to} onValueChange={setTo}>
                      <SelectTrigger className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.keys((UNITS[cat] as any).units).map(u => <SelectItem key={u} value={u} className="font-bold">{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="surface-card p-6 border-border/30 bg-utility/5 text-utility relative overflow-hidden group shadow-sm">
              <Zap className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
              <div className="flex gap-4 items-start relative z-10">
                <div className="mt-1">
                  <Scale className="size-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">High Accuracy</h4>
                  <p className="text-xs opacity-80 leading-relaxed font-medium">
                    This tool follows international standards to provide highly accurate results for home, school, or professional projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
 
          {/* Results Panel */}
          <div className="lg:col-span-8 space-y-8">
            <div className="surface-card p-8 md:p-12 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
              <Globe className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <RefreshCcw className="size-3" />
                      Converted Result
                    </div>
                    <div className="text-5xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums break-all">
                      {Number.isFinite(unitResult) ? Number(unitResult.toPrecision(8)).toString() : "—"}
                      <span className="text-xs md:text-sm ml-4 font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">{to}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCopy} 
                    className={cn(
                      "p-3 rounded-xl transition-all border shadow-sm",
                      copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                    )}
                  >
                    {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                  </button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <Target className="size-3" />
                      Original Input
                    </div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                      {val} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">{from}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <Zap className="size-3 text-utility" />
                      Conversion Accuracy
                    </div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-utility tabular-nums">
                      High <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Precision</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Ruler className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Scale className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">World Standards</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  Converting between units is essential for shopping, traveling, and working on projects with people from around the world.
                </p>
              </div>
              <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
                <Gauge className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <RefreshCcw className="size-4 text-muted-foreground" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Fast & Accurate</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                  We use advanced math in the background to make sure your conversions are accurate and prevent small mistakes when rounding numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default UnitConverter;
