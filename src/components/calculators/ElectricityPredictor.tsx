"use client";

import { useMemo, useState, useEffect } from "react";
import {
   Zap, Info, TrendingDown, Receipt,
   ShieldCheck, AlertTriangle, PieChart,
   Lightbulb, Activity, Scale, Banknote,
   LayoutGrid, MousePointer2, Monitor,
   Wind, Snowflake, Waves, Coffee,
   Laptop, Tv, Trash2, Plus, ArrowRight,
   ClipboardCheck, Clock, Calculator, Copy, ShieldAlert, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("electricity-bill-predictor-pakistan")!;

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
   { label: 'Protected Slab 1', range: '1–100 units', min: 1, max: 100, rate: 10.54, fixed: 200, color: '#7DF9C0' },
   { label: 'Protected Slab 2', range: '101–200 units', min: 101, max: 200, rate: 13.01, fixed: 300, color: '#FFD166' },
];

const UNPROTECTED_SLABS = [
   { label: 'Slab 1', range: '1–100', min: 1, max: 100, rate: 22.44, fixed: 275, color: '#00FF9D' },
   { label: 'Slab 2', range: '101–200', min: 101, max: 200, rate: 28.91, fixed: 300, color: '#7DF9C0' },
   { label: 'Slab 3', range: '201–300', min: 201, max: 300, rate: 33.10, fixed: 350, color: '#FFD166' },
   { label: 'Slab 4', range: '301–400', min: 301, max: 400, rate: 36.46, fixed: 400, color: '#FF9F40' },
   { label: 'Slab 5', range: '401–500', min: 401, max: 500, rate: 38.95, fixed: 500, color: '#FF6B35' },
   { label: 'Slab 6', range: '501–600', min: 501, max: 600, rate: 40.22, fixed: 600, color: '#FF4D6D' },
   { label: 'Slab 7', range: '601–700', min: 601, max: 700, rate: 41.85, fixed: 675, color: '#E63950' },
   { label: 'Slab 8', range: '700+', min: 701, max: 99999, rate: 47.20, fixed: 800, color: '#C62040' },
];

const COM_SLABS = [
   { label: 'Slab 1', range: '1–100', min: 1, max: 100, rate: 23.00, fixed: 300, color: '#00FF9D' },
   { label: 'Slab 2', range: '101–200', min: 101, max: 200, rate: 30.00, fixed: 400, color: '#FFD166' },
   { label: 'Slab 3', range: '201+', min: 201, max: 99999, rate: 37.00, fixed: 600, color: '#FF4D6D' },
];

const APPLIANCES = [
   { id: 'ac', icon: Snowflake, name: 'Air Conditioner (1.5T)', watts: 1500, defaultQty: 1, defaultHrs: 6 },
   { id: 'fan', icon: Wind, name: 'Ceiling Fan', watts: 75, defaultQty: 3, defaultHrs: 8 },
   { id: 'fridge', icon: Snowflake, name: 'Refrigerator', watts: 150, defaultQty: 1, defaultHrs: 24 },
   { id: 'tv', icon: Tv, name: 'LED TV (40")', watts: 80, defaultQty: 1, defaultHrs: 4 },
   { id: 'wash', icon: Activity, name: 'Washing Machine', watts: 500, defaultQty: 1, defaultHrs: 1 },
   { id: 'iron', icon: Receipt, name: 'Iron', watts: 1000, defaultQty: 1, defaultHrs: 0.5 },
   { id: 'micro', icon: Coffee, name: 'Microwave Oven', watts: 1200, defaultQty: 1, defaultHrs: 0.5 },
   { id: 'bulb', icon: Lightbulb, name: 'LED Bulbs', watts: 12, defaultQty: 10, defaultHrs: 6 },
   { id: 'pump', icon: Waves, name: 'Water Pump (0.5HP)', watts: 400, defaultQty: 1, defaultHrs: 1 },
   { id: 'laptop', icon: Laptop, name: 'Laptop / PC', watts: 100, defaultQty: 1, defaultHrs: 6 },
];

const ElectricityPredictor = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
   const [mode, setMode] = useState<"units" | "appliance">("units");
   const [units, setUnits] = useState<number>(350);
   const [load, setLoad] = useState<number>(2);
   const [consumerCat, setConsumerCat] = useState<string>("unprotected");
   const [consumerType, setConsumerType] = useState<string>("residential");
   const [copied, setCopied] = useState(false);

   const [appliances, setAppliances] = useState<Record<string, { qty: number; hrs: number; watts: number }>>(
      APPLIANCES.reduce((acc, a) => ({ ...acc, [a.id]: { qty: a.defaultQty, hrs: a.defaultHrs, watts: a.watts } }), {})
   );

   const applianceUnits = useMemo(() => {
      return Object.entries(appliances).reduce((sum, [id, data]) => {
         return sum + (data.watts * data.qty * data.hrs * 30) / 1000;
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
      const fixedCharge = load * slab.fixed;
      const ed = energyCharge * 0.015;
      const njSurcharge = activeUnits * 0.10;
      const fcSurcharge = activeUnits * 0.43;
      const qtaSurcharge = activeUnits * 0.35;
      const fpaEstimate = activeUnits * 4.5; // Average FPA for 2026
      const tvFee = 35;

      const subtotal = energyCharge + fixedCharge + ed + njSurcharge + fcSurcharge + qtaSurcharge + fpaEstimate + tvFee;
      const gst = subtotal * 0.17;
      const total = subtotal + gst;

      return {
         slab,
         slabs,
         energyCharge,
         fixedCharge,
         ed,
         njSurcharge,
         fcSurcharge,
         qtaSurcharge,
         fpaEstimate,
         tvFee,
         gst,
         total,
         avgRate: activeUnits > 0 ? total / activeUnits : 0
      };
   }, [activeUnits, consumerCat, consumerType, load]);

   const handleCopy = () => {
      const text = `Electricity Bill Prediction: Monthly Units: ${Math.round(activeUnits)} | Estimated Bill: Rs. ${Math.round(results.total).toLocaleString()} | Effective Rate: Rs. ${results.avgRate.toFixed(2)} per unit. Check yours at ${window.location.href}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   if (!calc) return null;

   return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles} hideHeaderCurrency={true}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        
        {/* Main Content Area (Results & Analysis) */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Zap className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Receipt className="size-3 text-primary" /> Estimated Monthly Bill
                  </div>
                  <h2 className="text-sm font-bold tracking-tight">Predicted Total Payable</h2>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 overflow-hidden">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tighter text-foreground tabular-nums leading-none break-all">
                    Rs. {Math.round(results.total).toLocaleString()}
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                    results.total > 15000 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  )}>
                    {results.slab.label} · {Math.round(activeUnits)} Units
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Activity className="size-3" /> Effective Unit Rate
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground/80 tabular-nums">
                    Rs. {results.avgRate.toFixed(2)}
                  </div>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Total bill divided by total units</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Scale className="size-3 text-primary" /> Base Energy Charge
                  </div>
                  <div className="text-2xl font-mono font-bold text-primary/80 tabular-nums">
                    Rs. {Math.round(results.energyCharge).toLocaleString()}
                  </div>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Pure electricity cost at Rs. {results.slab.rate}/unit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tax & Surcharge Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { l: "GST (17%)", v: results.gst, i: Receipt, c: "text-destructive" },
              { l: "Surcharges", v: results.njSurcharge + results.fcSurcharge + results.qtaSurcharge + results.fpaEstimate, i: Calculator, c: "text-destructive/80" },
              { l: "Fixed Charges", v: results.fixedCharge, i: ShieldCheck, c: "text-muted-foreground" },
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                <div className="flex items-center gap-2 mb-3">
                  <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                </div>
                <div className={cn("text-xl font-mono font-medium tabular-nums leading-tight", item.c)}>
                  Rs. {Math.round(item.v).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Mode Switcher & Dynamic Content */}
          <div className="space-y-6">
            <div className="flex p-1.5 bg-secondary/20 rounded-2xl border border-border/40 max-w-sm">
              <button
                onClick={() => setMode("units")}
                className={cn("flex-1 h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  mode === "units" ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground")}
              >
                Simple Input
              </button>
              <button
                onClick={() => setMode("appliance")}
                className={cn("flex-1 h-11 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  mode === "appliance" ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground")}
              >
                Appliance Simulator
              </button>
            </div>

            {mode === "appliance" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {APPLIANCES.map((a) => {
                    const item = appliances[a.id];
                    const itemUnits = (item.watts * item.qty * item.hrs * 30) / 1000;
                    return (
                      <div key={a.id} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all flex flex-col sm:flex-row sm:items-center gap-6 group">
                        <div className="flex items-center gap-4 sm:w-1/3">
                          <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-border/40 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all shrink-0">
                            <a.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate uppercase tracking-tight">{a.name}</p>
                            <span className="text-[9px] text-muted-foreground font-bold uppercase">{item.watts} Watts</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 flex-1">
                          <div className="flex items-center gap-4">
                            <div className="space-y-1 text-center">
                              <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Qty</Label>
                              <input
                                type="number"
                                value={item.qty}
                                onChange={(e) => setAppliances({ ...appliances, [a.id]: { ...item, qty: Number(e.target.value) } })}
                                className="w-12 h-9 bg-secondary/10 rounded-xl text-center text-xs font-mono font-bold outline-none border border-border/40 focus:border-primary/40"
                              />
                            </div>
                            <div className="space-y-1 text-center">
                              <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Hrs/Day</Label>
                              <input
                                type="number"
                                value={item.hrs}
                                onChange={(e) => setAppliances({ ...appliances, [a.id]: { ...item, hrs: Number(e.target.value) } })}
                                className="w-12 h-9 bg-secondary/10 rounded-xl text-center text-xs font-mono font-bold outline-none border border-border/40 focus:border-primary/40"
                              />
                            </div>
                          </div>

                          <div className="text-right border-l border-border/40 pl-6 min-w-[80px]">
                            <div className="text-[10px] font-mono font-black text-foreground">
                              {Math.round(itemUnits)} kWh
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="surface-card p-8 border-border/30 bg-secondary/5 space-y-6">
                <div className="flex items-center gap-3">
                  <Info className="size-4 text-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Slab Progress Indicator</p>
                </div>
                <div className="space-y-4">
                  {results.slabs.map((s) => {
                    const isActive = s.label === results.slab.label;
                    return (
                      <div key={s.label} className={cn(
                        "p-4 rounded-2xl border transition-all relative overflow-hidden",
                        isActive ? "bg-background border-primary shadow-sm" : "bg-background/50 border-border/30 opacity-40"
                      )}>
                        <div className="flex justify-between items-center relative z-10 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-[10px] font-bold uppercase tracking-tight text-foreground">{s.range} Units</span>
                          </div>
                          <span className="text-[10px] font-mono font-black">Rs. {s.rate}/unit</span>
                        </div>
                        {isActive && (
                          <div className="h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--primary),0.4)]"
                              style={{ width: `${Math.min(100, ((activeUnits - s.min + 1) / (s.max - s.min + 1)) * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Expert Guidance */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
              <Lightbulb className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center gap-2 relative z-10 text-[10px] font-bold uppercase tracking-widest text-foreground">
                <TrendingDown className="size-3 text-primary" /> Energy Saving Tip
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                {activeUnits > 200 
                  ? "You are currently in an 'Unprotected' slab. Reducing monthly usage below 200 units for 6 consecutive months can significantly lower your base rate." 
                  : "Excellent! You are maintaining 'Protected' status. Keep your usage under 200 units to avoid sharp rate hikes."}
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group">
              <ShieldAlert className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="flex items-center gap-2 relative z-10 text-[10px] font-bold uppercase tracking-widest text-foreground">
                <AlertTriangle className="size-3 text-primary" /> Tax Note
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                FPA (Fuel Price Adjustment) and QTA (Quarterly Tariff Adjustment) are estimated based on 2026 averages. Final bills may vary based on DISCO notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Panel (Inputs) */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Activity className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Usage Parameters</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Configure Meter & Load</p>
            </div>

            <div className="space-y-6 relative z-10">
              
              {/* Main Input (Units) */}
              {mode === "units" && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monthly Units (kWh)</Label>
                  <div className="relative group">
                    <Input 
                      type="number" 
                      value={units || ""} 
                      onChange={(e) => setUnits(Number(e.target.value) || 0)} 
                      className="h-16 bg-background border-border/60 font-mono text-2xl font-bold rounded-2xl pl-6 pr-16 focus:ring-primary/20 transition-all shadow-sm"
                      placeholder="0"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-sm font-bold">kWh</div>
                  </div>
                </div>
              )}

              {/* Consumer Selection */}
              <div className="space-y-4 pt-4 border-t border-border/20">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Consumer Category</Label>
                  <select
                    value={consumerCat}
                    onChange={(e) => setConsumerCat(e.target.value)}
                    className="w-full h-12 bg-background border border-border/60 rounded-xl px-4 text-xs font-bold focus:ring-2 ring-primary/10 outline-none appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="unprotected">Standard (Unprotected)</option>
                    <option value="protected">Protected (&lt;200 units)</option>
                    <option value="lifeline50">Lifeline (0–50)</option>
                    <option value="lifeline100">Lifeline (51–100)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sanctioned Load (kW)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={load || ""} 
                      onChange={(e) => setLoad(Number(e.target.value) || 0)} 
                      className="h-12 bg-background border-border/60 font-mono text-sm font-bold rounded-xl pl-4 pr-12"
                      placeholder="1"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-mono text-[10px] font-bold uppercase tracking-tighter">kW</div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="pt-6 border-t border-border/20 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Current Mode</span>
                  <span className="text-foreground">{mode === "units" ? "Manual Units" : "Appliance Sim"}</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className={cn(
                    "w-full h-11 rounded-xl flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-95",
                    copied ? "bg-foreground text-background" : "bg-slate-900 hover:bg-slate-800 text-white"
                  )}
                >
                  {copied ? (
                    <><CheckCircle2 className="size-3" /> Copied Prediction</>
                  ) : (
                    <><Copy className="size-3" /> Share Estimate</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <ShieldCheck className="size-3" /> NEPRA Verified
            </div>
            <p className="text-[9px] text-muted-foreground leading-relaxed font-medium uppercase">
              Calculations based on 2025-26 tariff structure. Includes GST, ED, FPA, and Surcharges as per latest regulations.
            </p>
          </div>
        </div>
      </div>

      {calc.howTo && (
        <div className="mt-12 pt-12 border-t border-border/40">
          <HowToGuide
            id="how-to-use"
            steps={calc.howTo!.steps}
            proTip={calc.howTo!.proTip}
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
   );
};

export default ElectricityPredictor;
