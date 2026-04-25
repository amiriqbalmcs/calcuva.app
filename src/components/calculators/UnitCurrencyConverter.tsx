"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Share, CheckCircle2, Globe, Info, Zap } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("unit-converter-currency-calculator")!;

const UNITS = {
  length: { base: "Meter", units: { Millimeter: 0.001, Centimeter: 0.01, Meter: 1, Kilometer: 1000, Inch: 0.0254, Foot: 0.3048, Yard: 0.9144, Mile: 1609.344 } },
  weight: { base: "Kilogram", units: { Milligram: 0.000001, Gram: 0.001, Kilogram: 1, "Metric Ton": 1000, Ounce: 0.0283495, Pound: 0.453592, Stone: 6.35029 } },
  volume: { base: "Liter", units: { Milliliter: 0.001, Liter: 1, "Cubic Meter": 1000, "Fluid Oz (US)": 0.0295735, "Cup (US)": 0.236588, "Pint (US)": 0.473176, "Gallon (US)": 3.78541 } },
  speed: { base: "m/s", units: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, "knot": 0.514444 } },
};

const CURRENCY_RATES: Record<string, { name: string; rate: number; parity: number }> = {
  USD: { name: "US Dollar", rate: 1, parity: 4.50 }, // Avg price of coffee
  EUR: { name: "Euro", rate: 0.92, parity: 4.10 },
  GBP: { name: "British Pound", rate: 0.79, parity: 3.80 },
  JPY: { name: "Japanese Yen", rate: 156.0, parity: 600 },
  INR: { name: "Indian Rupee", rate: 83.5, parity: 250 },
  AED: { name: "UAE Dirham", rate: 3.67, parity: 18 },
  CAD: { name: "Canadian Dollar", rate: 1.37, parity: 5.20 },
  AUD: { name: "Australian Dollar", rate: 1.52, parity: 5.80 },
};

const UnitCurrencyConverter = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [tab, setTab] = useUrlState<"unit" | "currency">("tab", "unit");
  const [cat, setCat] = useUrlState<keyof typeof UNITS>("ct", "length");
  const [from, setFrom] = useUrlState<string>("f", "Meter");
  const [to, setTo] = useUrlState<string>("t", "Foot");
  const [val, setVal] = useUrlState<number>("iv", 1);
  const [cFrom, setCFrom] = useUrlState<string>("cf", "USD");
  const [cTo, setCTo] = useUrlState<string>("cto", "EUR");
  const [cVal, setCVal] = useUrlState<number>("cv", 100);
  const [copied, setCopied] = useState(false);

  const unitResult = useMemo(() => {
    const u = (UNITS[cat] as any).units;
    return (val * u[from]) / u[to];
  }, [val, cat, from, to]);

  const currencyData = useMemo(() => {
    const raw = (cVal / CURRENCY_RATES[cFrom].rate) * CURRENCY_RATES[cTo].rate;
    const parityFrom = CURRENCY_RATES[cFrom].parity;
    const parityTo = CURRENCY_RATES[cTo].parity;
    const coffeeFrom = cVal / parityFrom;
    const coffeeTo = raw / parityTo;
    
    let insight = "";
    if (coffeeTo > coffeeFrom) insight = `Value Perception: Your ${cVal} ${cFrom} has higher purchasing power than ${raw.toFixed(0)} ${cTo} in its local market. Your money 'feels' more valuable at home.`;
    else insight = `Purchasing Advantage: Things might feel cheaper in ${cTo} terms. You can afford roughly ${(coffeeTo / Math.max(1, coffeeFrom)).toFixed(1)}x as much lifestyle in the destination.`;

    return { raw, insight, coffeeFrom, coffeeTo };
  }, [cVal, cFrom, cTo]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={<SeoBlock title="Precision Unit & Currency Arithmetic" intro="Convert between technical metrics or global financial values with Purchasing Power Parity insights." />}
    >
      <div className="flex justify-between items-center mb-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-2 w-[240px]">
            <TabsTrigger value="unit">Metrics</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
          </TabsList>
        </Tabs>
        <button onClick={handleShare} className="p-1 px-3 rounded-md bg-secondary text-[10px] font-bold text-muted-foreground hover:bg-utility hover:text-white transition flex items-center gap-2 font-mono">
          {copied ? <CheckCircle2 className="size-3" /> : <Share className="size-3" />}
          {copied ? "COPIED" : "SHARE"}
        </button>
      </div>

      <Tabs value={tab}>
        <TabsContent value="unit" className="space-y-6">
           <div className="grid lg:grid-cols-3 gap-6">
             <div className="lg:col-span-1 surface-card p-6 space-y-6">
                <div><Label>Measurement Category</Label>
                   <Select value={cat} onValueChange={(v: any) => { 
                    const c = v as keyof typeof UNITS;
                    setCat(c); 
                    setFrom(Object.keys(UNITS[c].units)[0]); 
                    setTo(Object.keys(UNITS[c].units)[1]); 
                  }}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.keys(UNITS).map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-4 pt-2 border-t border-border">
                  <div><Label>Source Unit</Label>
                    <Select value={from} onValueChange={setFrom}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.keys((UNITS[cat] as any).units).map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
                    <Input type="number" value={val} onChange={e => setVal(Number(e.target.value) || 0)} className="mt-3 text-lg font-bold" />
                  </div>
                  <div className="flex justify-center"><Button variant="ghost" size="icon" onClick={() => { setFrom(to); setTo(from); }}><ArrowLeftRight className="size-4" /></Button></div>
                  <div><Label>Target Unit</Label>
                    <Select value={to} onValueChange={setTo}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.keys((UNITS[cat] as any).units).map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
             </div>
             <div className="lg:col-span-2 space-y-6">
                <ResultGrid cols={1}>
                  <ResultStat label={`Converted ${to}`} value={Number.isFinite(unitResult) ? Number(unitResult.toPrecision(8)).toString() : "—"} sub={`From ${val} ${from}`} accent />
                </ResultGrid>
                <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-utility-soft border-utility text-utility">
                  <div className="shrink-0 mt-0.5"><Zap className="size-5" /></div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Conversion Note</h4>
                    <p className="text-sm opacity-90 leading-relaxed font-medium">Precision: 8 significant digits. This conversion uses the standard international definition for {cat} measurements.</p>
                  </div>
                </div>
             </div>
           </div>
        </TabsContent>

        <TabsContent value="currency" className="space-y-6">
           <div className="grid lg:grid-cols-3 gap-6">
             <div className="lg:col-span-1 surface-card p-6 space-y-6">
                <div className="space-y-4">
                  <div><Label>Selling Currency</Label>
                    <Select value={cFrom} onValueChange={setCFrom}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(CURRENCY_RATES).map(([k, v]) => <SelectItem key={k} value={k}>{k} — {v.name}</SelectItem>)}</SelectContent></Select>
                    <Input type="number" value={cVal} onChange={e => setCVal(Number(e.target.value) || 0)} className="mt-3 text-lg font-bold" />
                  </div>
                  <div className="flex justify-center"><Button variant="ghost" size="icon" onClick={() => { const f = cFrom; setCFrom(cTo); setCTo(f); }}><ArrowLeftRight className="size-4" /></Button></div>
                  <div><Label>Buying Currency</Label>
                    <Select value={cTo} onValueChange={setCTo}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(CURRENCY_RATES).map(([k, v]) => <SelectItem key={k} value={k}>{k} — {v.name}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
             </div>
             <div className="lg:col-span-2 space-y-6">
                <ResultGrid cols={2}>
                  <ResultStat label={`Result in ${cTo}`} value={currencyData.raw.toLocaleString(undefined, { maximumFractionDigits: 2 })} accent />
                  <ResultStat label="Mid-Market Rate" value={((1/CURRENCY_RATES[cFrom].rate) * CURRENCY_RATES[cTo].rate).toFixed(4)} sub="Reference Rate" />
                </ResultGrid>
                <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-utility-soft border-utility text-utility">
                  <div className="shrink-0 mt-0.5"><Globe className="size-5" /></div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Purchasing Power Insight</h4>
                    <p className="text-sm opacity-90 leading-relaxed font-medium">{currencyData.insight}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="surface-card p-5">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Source Value (Local Coffee)</div>
                      <div className="text-lg font-bold">{currencyData.coffeeFrom.toFixed(1)} Cups</div>
                   </div>
                   <div className="surface-card p-5">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Target Value (Local Coffee)</div>
                      <div className="text-lg font-bold">{currencyData.coffeeTo.toFixed(1)} Cups</div>
                   </div>
                </div>
             </div>
           </div>
        </TabsContent>
      </Tabs>
    </CalculatorPage>
  );
};

export default UnitCurrencyConverter;
