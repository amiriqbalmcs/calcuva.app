"use client";

import { useMemo, useState } from "react";
import {
  Leaf, TrendingUp, Info, BookOpen, Target, 
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Copy, Award, AlertCircle, Plane, Car, Flame, Utensils, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("personal-carbon-footprint-calculator")!;

const CarbonFootprintCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [flightHours, setFlightHours] = useState<number>(10);
  const [carMiles, setCarMiles] = useState<number>(8000);
  const [electricity, setElectricity] = useState<number>(300); // Monthly kWh
  const [diet, setDiet] = useState<number>(2); // 0: Vegan, 1: Veg, 2: Average, 3: High Meat
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    const text = `Carbon Footprint: Annual Total ${result.total.toFixed(1)} Tons CO2e. Calculate yours at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dietLabels = ["Vegan", "Vegetarian", "Average", "Meat Heavy"];

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">
        
        {/* Main Interface: Side-by-Side Results & Inputs */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-xl rounded-2xl sticky top-32">
              <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-health dark:bg-emerald-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <Globe className="size-5 text-health dark:text-emerald-400" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">Lifestyle Summary</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Your Annual Carbon Impact</p>
                  </div>
                </div>
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

              <div className="p-8 space-y-10">
                 <div className="space-y-2">
                    <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums text-health dark:text-emerald-400 leading-none">
                       {result.total.toFixed(1)}<span className="text-xl ml-1 opacity-20 dark:opacity-40">Tons</span>
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                       Global Avg: ~4.7 Tons CO2e
                    </div>
                 </div>

                 <div className="space-y-6">
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
                 </div>

                 <div className="p-5 rounded-2xl bg-health/5 dark:bg-emerald-950/20 border border-health/10 dark:border-emerald-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-health dark:text-emerald-400">
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

          {/* Left Column: Inputs Panel */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card p-6 md:p-10 space-y-12 bg-secondary/5 border-border/40 relative overflow-hidden group rounded-2xl">
              <div className="flex items-center gap-4 border-b border-border/40 pb-8">
                <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                  <Activity className="size-6 text-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-tight uppercase text-foreground">Lifestyle Inputs</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Set Your Annual Consumption Metrics</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Annual Flight Hours</Label>
                      <span className="text-xs font-mono font-bold text-foreground">{flightHours} hrs</span>
                   </div>
                   <Slider aria-label="Flight Hours" value={[flightHours]} min={0} max={100} step={1} onValueChange={([v]) => setFlightHours(v)} className="accent-health" />
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Annual Driving (Miles)</Label>
                      <span className="text-xs font-mono font-bold text-foreground">{carMiles.toLocaleString()} mi</span>
                   </div>
                   <Slider aria-label="Driving Miles" value={[carMiles]} min={0} max={30000} step={500} onValueChange={([v]) => setCarMiles(v)} />
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Electricity (kWh)</Label>
                      <span className="text-xs font-mono font-bold text-foreground">{electricity} kWh</span>
                   </div>
                   <Slider aria-label="Electricity usage" value={[electricity]} min={0} max={2000} step={10} onValueChange={([v]) => setElectricity(v)} />
                </div>

                <div className="space-y-6">
                   <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Dietary Preference</Label>
                   <div className="grid grid-cols-2 gap-3">
                      {dietLabels.map((label, i) => (
                         <button
                            key={label}
                            onClick={() => setDiet(i)}
                            className={cn("px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", 
                               diet === i ? "bg-health dark:bg-emerald-600 border-health dark:border-emerald-700 text-white shadow-lg" : "bg-background border-border/40 text-muted-foreground hover:border-health/40 dark:hover:border-emerald-500/40")}>
                            {label}
                         </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {calc.howTo && (
        <div id="how-to-use" className="mt-12 pt-12 border-t border-border/40">
          <HowToGuide 
            steps={calc.howTo!.steps} 
            proTip={calc.howTo!.proTip} 
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
  );
};

export default CarbonFootprintCalculator;
