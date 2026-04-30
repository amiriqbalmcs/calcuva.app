"use client";

import { useMemo, useState } from "react";
import {
  Leaf, TrendingUp, Info, BookOpen, Target, 
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Copy, Award, AlertCircle, Plane, Car, Flame, Utensils
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("personal-carbon-footprint-calculator");

const CarbonFootprintCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [flightHours, setFlightHours] = useState<number>(10);
  const [carMiles, setCarMiles] = useState<number>(8000);
  const [electricity, setElectricity] = useState<number>(300); // Monthly kWh
  const [diet, setDiet] = useState<number>(2); // 0: Vegan, 1: Veg, 2: Average, 3: High Meat

  const result = useMemo(() => {
    // Standard Emission Factors (kg CO2e)
    const flightEmissions = flightHours * 250; // 250kg per hour
    const carEmissions = carMiles * 0.404; // 0.4kg per mile (Average car)
    const energyEmissions = (electricity * 12) * 0.4; // 0.4kg per kWh
    
    const dietFactors = [1500, 2000, 2500, 3300]; // Annual kg CO2e
    const dietEmissions = dietFactors[diet];

    const total = (flightEmissions + carEmissions + energyEmissions + dietEmissions) / 1000; // Tons
    
    const breakdown = [
      { name: "Travel", value: flightEmissions + carEmissions, icon: Plane, color: "bg-blue-500" },
      { name: "Home", value: energyEmissions, icon: Flame, color: "bg-amber-500" },
      { name: "Diet", value: dietEmissions, icon: Utensils, color: "bg-health" }
    ];

    return { total, breakdown };
  }, [flightHours, carMiles, electricity, diet]);

  const dietLabels = ["Vegan", "Vegetarian", "Average", "Meat Heavy"];

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-health" />
              <div className="flex items-center gap-3 relative z-10">
                <Globe className="size-5 text-health" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Lifestyle Inputs</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Estimate your annual consumption</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Annual Flight Hours</Label>
                       <span className="text-xs font-mono font-bold">{flightHours} hrs</span>
                    </div>
                    <Slider aria-label="Flight Hours" value={[flightHours]} min={0} max={100} step={1} onValueChange={([v]) => setFlightHours(v)} />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Annual Driving (Miles)</Label>
                       <span className="text-xs font-mono font-bold">{carMiles.toLocaleString()} mi</span>
                    </div>
                    <Slider aria-label="Driving Miles" value={[carMiles]} min={0} max={30000} step={500} onValueChange={([v]) => setCarMiles(v)} />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Electricity (kWh)</Label>
                    <span className="text-xs font-mono font-bold">{electricity} kWh</span>
                 </div>
                 <Slider aria-label="Electricity usage" value={[electricity]} min={0} max={2000} step={10} onValueChange={([v]) => setElectricity(v)} />
              </div>

              <div className="space-y-4 pt-4">
                 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-6">Dietary Preference</Label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dietLabels.map((label, i) => (
                       <button
                          key={label}
                          onClick={() => setDiet(i)}
                          className={cn("px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", 
                             diet === i ? "bg-health border-health text-white shadow-lg" : "bg-background border-border/40 text-muted-foreground hover:border-health/40")}>
                          {label}
                       </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
             <div className="space-y-10 relative z-10">
                <div className="space-y-2">
                   <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <Activity className="size-3" /> Annual Carbon Footprint
                   </div>
                   <div className="text-7xl font-mono font-bold tracking-tighter tabular-nums text-health">
                      {result.total.toFixed(1)}<span className="text-2xl ml-1 opacity-20">Tons</span>
                   </div>
                   <div className="text-[10px] font-medium text-muted-foreground">
                      Average per person: ~4.7 Tons CO2e
                   </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border/40">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Impact Breakdown</div>
                   <div className="space-y-4">
                      {result.breakdown.map((item) => (
                         <div key={item.name} className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                               <div className="flex items-center gap-2">
                                  <item.icon className="size-3 opacity-40" />
                                  {item.name}
                               </div>
                               <span>{(item.value / 1000).toFixed(1)} T</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                               <div 
                                  className={cn("h-full transition-all duration-700", item.color)}
                                  style={{ width: `${(item.value / 1000 / result.total) * 100}%` }}
                               />
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="p-5 rounded-2xl bg-health/5 border border-health/10 space-y-3">
                      <div className="flex items-center gap-2 text-health">
                         <Leaf className="size-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Sustainability Tip</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                         {result.total > 10 
                           ? "Your footprint is high. Reducing long-haul flights or switching to a plant-based diet twice a week can cut 2+ tons annually."
                           : "Excellent! You are significantly below the global average for developed nations. Keep using low-carbon transit methods."}
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

export default CarbonFootprintCalculator;
