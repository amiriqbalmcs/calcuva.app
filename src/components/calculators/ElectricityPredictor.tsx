"use client";

import { useMemo, useState, useEffect } from "react";
import { 
  Zap, Info, TrendingDown, Receipt, 
  ShieldCheck, AlertTriangle, PieChart,
  Lightbulb, Activity, Scale, Banknote,
  LayoutGrid, MousePointer2, Monitor, 
  Wind, Snowflake, Waves, Coffee, 
  Laptop, Tv, Trash2, Plus, ArrowRight,
  ClipboardCheck, Clock
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("electricity-bill-predictor-pakistan");

// ============================================================
// NEPRA SLAB RATES — FY 2025-26 (effective July 1, 2025)
// ============================================================

const LIFELINE_50 = [
  { label: 'Lifeline', range: 'Up to 50 units', min: 1, max: 50, rate: 3.95, fixed: 75, color: '#00FF9D' },
];

const LIFELINE_100 = [
  { label: 'Lifeline', range: '1–100 units', min: 1, max: 100, rate: 7.74, fixed: 75, color: '#00FF9D' },
];

const PROTECTED_SLABS = [
  { label: 'Protected Slab 1', range: '1–100 units',   min: 1,   max: 100,  rate: 10.54, fixed: 100,  color: '#7DF9C0' },
  { label: 'Protected Slab 2', range: '101–200 units', min: 101, max: 200,  rate: 13.01, fixed: 150,  color: '#FFD166' },
];

const UNPROTECTED_SLABS = [
  { label: 'Slab 1', range: '1–100',    min: 1,   max: 100,  rate: 22.44, fixed: 150,  color: '#00FF9D' },
  { label: 'Slab 2', range: '101–200',  min: 101, max: 200,  rate: 28.91, fixed: 175,  color: '#7DF9C0' },
  { label: 'Slab 3', range: '201–300',  min: 201, max: 300,  rate: 33.10, fixed: 200,  color: '#FFD166' },
  { label: 'Slab 4', range: '301–400',  min: 301, max: 400,  rate: 36.46, fixed: 250,  color: '#FF9F40' },
  { label: 'Slab 5', range: '401–500',  min: 401, max: 500,  rate: 38.95, fixed: 300,  color: '#FF6B35' },
  { label: 'Slab 6', range: '501–600',  min: 501, max: 600,  rate: 40.22, fixed: 350,  color: '#FF4D6D' },
  { label: 'Slab 7', range: '601–700',  min: 601, max: 700,  rate: 41.85, fixed: 400,  color: '#E63950' },
  { label: 'Slab 8', range: '700+',     min: 701, max: 99999, rate: 47.20, fixed: 500, color: '#C62040' },
];

const COM_SLABS = [
  { label: 'Slab 1', range: '1–100',   min: 1,   max: 100,  rate: 23.00, fixed: 300,  color: '#00FF9D' },
  { label: 'Slab 2', range: '101–200', min: 101, max: 200,  rate: 30.00, fixed: 400,  color: '#FFD166' },
  { label: 'Slab 3', range: '201+',    min: 201, max: 99999, rate: 37.00, fixed: 600,  color: '#FF4D6D' },
];

const APPLIANCES = [
  { id:'ac',    icon: Snowflake,  name:'Air Conditioner (1.5T)',  watts:1500, defaultQty: 1, defaultHrs: 6 },
  { id:'fan',   icon: Wind,       name:'Ceiling Fan',              watts:75,   defaultQty: 3, defaultHrs: 8 },
  { id:'fridge',icon: Snowflake,  name:'Refrigerator',             watts:150,  defaultQty: 1, defaultHrs: 24 },
  { id:'tv',    icon: Tv,         name:'LED TV (40")',              watts:80,   defaultQty: 1, defaultHrs: 4 },
  { id:'wash',  icon: Activity,   name:'Washing Machine',          watts:500,  defaultQty: 1, defaultHrs: 1 },
  { id:'iron',  icon: Receipt,    name:'Iron',                     watts:1000, defaultQty: 1, defaultHrs: 0.5 },
  { id:'micro', icon: Coffee,     name:'Microwave Oven',           watts:1200, defaultQty: 1, defaultHrs: 0.5 },
  { id:'bulb',  icon: Lightbulb,  name:'LED Bulbs',                watts:12,   defaultQty: 10, defaultHrs: 6 },
  { id:'pump',  icon: Waves,      name:'Water Pump (0.5HP)',       watts:400,  defaultQty: 1, defaultHrs: 1 },
  { id:'laptop',icon: Laptop,     name:'Laptop / PC',              watts:100,  defaultQty: 1, defaultHrs: 6 },
];

const ElectricityPredictor = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [mode, setMode] = useState<"units" | "appliance">("units");
  const [units, setUnits] = useState<number>(350);
  const [consumerCat, setConsumerCat] = useState<string>("unprotected");
  const [consumerType, setConsumerType] = useState<string>("residential");
  
  const [appliances, setAppliances] = useState<Record<string, { qty: number; hrs: number }>>(
    APPLIANCES.reduce((acc, a) => ({ ...acc, [a.id]: { qty: a.defaultQty, hrs: a.defaultHrs } }), {})
  );

  const applianceUnits = useMemo(() => {
    return Object.entries(appliances).reduce((sum, [id, data]) => {
      const a = APPLIANCES.find(x => x.id === id)!;
      return sum + (a.watts * data.qty * data.hrs * 30) / 1000;
    }, 0);
  }, [appliances]);

  const activeUnits = mode === "appliance" ? applianceUnits : units;

  const results = useMemo(() => {
    let slabs = UNPROTECTED_SLABS;
    if (consumerType === "commercial") slabs = COM_SLABS;
    else if (consumerCat === "lifeline50") slabs = LIFELINE_50;
    else if (consumerCat === "lifeline100") slabs = LIFELINE_100;
    else if (consumerCat === "protected") slabs = PROTECTED_SLABS;

    const slab = slabs.find(s => activeUnits >= s.min && activeUnits <= s.max) || slabs[slabs.length - 1];
    
    const energyCharge = activeUnits * slab.rate;
    const fixedCharge = slab.fixed;
    const ed = energyCharge * 0.015;
    const njSurcharge = activeUnits * 0.10;
    const tvFee = 35;
    const subtotal = energyCharge + fixedCharge + ed + njSurcharge + tvFee;
    const gst = subtotal * 0.17;
    const total = subtotal + gst;

    return {
      slab,
      slabs,
      energyCharge,
      fixedCharge,
      ed,
      njSurcharge,
      tvFee,
      gst,
      total,
      avgRate: activeUnits > 0 ? total / activeUnits : 0
    };
  }, [activeUnits, consumerCat, consumerType]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          {/* TABS */}
          <div className="flex p-1.5 bg-secondary/20 rounded-2xl border border-border/40 max-w-md mx-auto sm:mx-0">
             <button 
                onClick={() => setMode("units")}
                className={cn("flex-1 h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", 
                   mode === "units" ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground")}
             >
                By Units
             </button>
             <button 
                onClick={() => setMode("appliance")}
                className={cn("flex-1 h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", 
                   mode === "appliance" ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground")}
             >
                By Appliances
             </button>
          </div>

          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border/40 bg-background flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                     <Zap className="size-6 text-foreground" />
                  </div>
                  <div className="space-y-0.5">
                     <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Usage Simulator</h3>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">FY 2025–26 NEPRA Official Rates</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 space-y-12">
               {mode === "units" ? (
                 <div className="space-y-8">
                    <div className="space-y-6">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Units Consumed (kWh)</Label>
                       <div className="relative group">
                          <Input
                             type="number"
                             value={units || ""}
                             onChange={(e) => setUnits(Number(e.target.value) || 0)}
                             className="h-24 bg-background border-border/60 font-mono text-6xl font-bold rounded-3xl pr-24 focus:ring-4 ring-primary/5 transition-all text-center sm:text-left"
                             placeholder="0"
                          />
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">kWh</div>
                       </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-border/40">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Consumer Category</Label>
                          <select 
                            value={consumerCat} 
                            onChange={(e) => setConsumerCat(e.target.value)}
                            className="w-full h-14 bg-background border border-border/60 rounded-2xl px-4 text-xs font-bold focus:ring-2 ring-primary/20 outline-none appearance-none cursor-pointer"
                          >
                             <option value="unprotected">Standard (Unprotected)</option>
                             <option value="protected">Protected (&lt;200 units 6mo)</option>
                             <option value="lifeline50">Lifeline (0–50)</option>
                             <option value="lifeline100">Lifeline (51–100)</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meter Type</Label>
                          <select 
                            value={consumerType} 
                            onChange={(e) => setConsumerType(e.target.value)}
                            className="w-full h-14 bg-background border border-border/60 rounded-2xl px-4 text-xs font-bold focus:ring-2 ring-primary/20 outline-none appearance-none cursor-pointer"
                          >
                             <option value="residential">Residential (Domestic)</option>
                             <option value="commercial">Commercial (Business)</option>
                          </select>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Select Quantity & Daily Usage Hours</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {APPLIANCES.map((a) => (
                          <div key={a.id} className="p-6 rounded-3xl bg-background border border-border/60 flex items-center gap-6 group hover:border-foreground/20 transition-all">
                             <div className="size-10 rounded-2xl bg-secondary/10 flex items-center justify-center border border-border/40 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                <a.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-foreground line-clamp-1">{a.name}</p>
                                <p className="text-[9px] text-muted-foreground font-mono uppercase font-bold">{a.watts} Watts</p>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="space-y-1">
                                   <Label className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">Qty</Label>
                                   <input 
                                      type="number" 
                                      value={appliances[a.id].qty} 
                                      onChange={(e) => setAppliances({...appliances, [a.id]: { ...appliances[a.id], qty: Number(e.target.value) }})}
                                      className="w-12 h-8 bg-secondary/20 rounded-lg text-center text-xs font-mono font-bold outline-none border border-border/40" 
                                   />
                                </div>
                                <div className="space-y-1">
                                   <Label className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">Hrs</Label>
                                   <input 
                                      type="number" 
                                      value={appliances[a.id].hrs} 
                                      onChange={(e) => setAppliances({...appliances, [a.id]: { ...appliances[a.id], hrs: Number(e.target.value) }})}
                                      className="w-12 h-8 bg-secondary/20 rounded-lg text-center text-xs font-mono font-bold outline-none border border-border/40" 
                                   />
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex justify-between items-center">
                       <span className="text-[11px] font-black uppercase tracking-widest text-primary">Estimated Consumption</span>
                       <span className="text-2xl font-mono font-black text-foreground">{Math.round(applianceUnits)} kWh</span>
                    </div>
                 </div>
               )}

               <div className="p-6 bg-foreground/[0.02] border border-border/40 rounded-3xl flex gap-4">
                  <Info className="size-5 text-muted-foreground shrink-0 mt-1" />
                  <div className="space-y-1">
                     <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">Verified 2026 Logic</p>
                     <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase">
                        Current prediction assumes NEPRA Slab Rates effective from July 1, 2025. Actual bills include monthly FPA and QTA surcharges notified separately.
                     </p>
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
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Monthly Bill</div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-health/10 text-health text-[9px] font-black uppercase tracking-tighter">
                         TOTAL PAYABLE
                      </div>
                   </div>
                   <div className="text-6xl font-mono font-bold tracking-tighter text-foreground leading-none">
                      Rs.{Math.round(results?.total || 0).toLocaleString()}
                   </div>
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                      {Math.round(activeUnits)} Units · {results.slab.label}
                   </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Effective Unit Rate</div>
                   <div className="text-4xl font-mono font-bold tracking-tighter text-health leading-none">
                      Rs.{results?.avgRate.toFixed(2)}
                   </div>
                </div>
                
                <div className="text-[11px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                   <Receipt className="size-3" /> Pakistan Rupees (PKR)
                </div>
             </div>

             <div className="space-y-4 relative">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Bill Breakdown</div>
                
                <div className="space-y-3">
                   <div className="flex justify-between items-center p-4 rounded-2xl bg-secondary/30 border border-border/40">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Energy Cost</span>
                      <span className="text-lg font-mono font-bold text-foreground">Rs.{Math.round(results?.energyCharge || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center p-4 rounded-2xl bg-secondary/30 border border-border/40">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Fixed Charge</span>
                      <span className="text-lg font-mono font-bold text-foreground">Rs.{Math.round(results?.fixedCharge || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
                      <span className="text-[11px] font-black uppercase tracking-widest text-destructive/80">GST (17%)</span>
                      <span className="text-lg font-mono font-bold text-destructive">+Rs.{Math.round(results?.gst || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
                      <span className="text-[11px] font-black uppercase tracking-widest text-destructive/80">Misc Taxes</span>
                      <span className="text-lg font-mono font-bold text-destructive">+Rs.{Math.round(results?.ed + results?.njSurcharge + results?.tvFee).toLocaleString()}</span>
                   </div>
                </div>

                {/* SLAB INDICATOR */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Slab Progress</p>
                   <div className="space-y-3">
                      {results.slabs.map((s) => {
                         const isActive = s.label === results.slab.label;
                         const isPast = activeUnits > s.max;
                         return (
                            <div key={s.label} className={cn("p-4 rounded-2xl border transition-all", isActive ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" : "bg-secondary/10 border-border/40 opacity-40")}>
                               <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-2">
                                     <div className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                                     <span className="text-[10px] font-bold uppercase tracking-tight text-foreground">{s.range} Units</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-foreground">Rs.{s.rate}</span>
                               </div>
                               {isActive && (
                                 <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                                      style={{ width: `${Math.min(100, ((activeUnits - s.min + 1) / (s.max - s.min + 1)) * 100)}%` }} 
                                    />
                                 </div>
                               )}
                            </div>
                         );
                      })}
                   </div>
                </div>
                
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex gap-4">
                   <Lightbulb className="size-5 text-primary shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[10px] text-foreground font-bold uppercase">Slab Savings</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
                         {activeUnits > 200 ? "Warning: You are in an Unprotected slab. Reducing usage below 200 units could save you thousands in taxes." : "Tip: Maintain protected status by staying under 200 units consistently."}
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

export default ElectricityPredictor;
