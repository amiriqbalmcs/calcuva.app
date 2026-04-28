"use client";

import { useState, useMemo } from "react";
import { Dumbbell, Info, TrendingUp, Activity, Ruler, Target } from "lucide-react";
import CalculatorPage from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ResultStat from "@/components/ResultStat";
import { cn } from "@/lib/utils";

interface OneRepMaxCalculatorProps {
  calc: any;
  guideHtml?: string;
}

export default function OneRepMaxCalculator({ calc, guideHtml }: OneRepMaxCalculatorProps) {
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [unit, setUnit] = useState<string>("kg");

  const results = useMemo(() => {
    // Epley Formula: 1RM = w * (1 + r/30)
    const epley = weight * (1 + reps / 30);
    
    // Brzycki Formula: 1RM = w / (1.0278 - (0.0278 * r))
    const brzycki = weight / (1.0278 - 0.0278 * reps);
    
    // Average of the two
    const avg = (epley + brzycki) / 2;

    // Percentages of 1RM
    const percentages = [
      { pct: 100, label: "100%", weight: avg },
      { pct: 95, label: "95%", weight: avg * 0.95 },
      { pct: 90, label: "90%", weight: avg * 0.90 },
      { pct: 85, label: "85%", weight: avg * 0.85 },
      { pct: 80, label: "80%", weight: avg * 0.80 },
      { pct: 75, label: "75%", weight: avg * 0.75 },
      { pct: 70, label: "70%", weight: avg * 0.70 },
      { pct: 60, label: "60%", weight: avg * 0.60 },
      { pct: 50, label: "50%", weight: avg * 0.50 },
    ];

    return {
      oneRepMax: avg,
      epley,
      brzycki,
      percentages
    };
  }, [weight, reps]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 rounded-xl bg-health/10 flex items-center justify-center text-health shadow-inner">
                <Dumbbell className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Lift Data</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest font-bold">Performance Input</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Weight Lifted */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="weight">Weight Lifted</Label>
                  <div className="flex bg-secondary/50 rounded-lg p-1">
                    <button 
                      onClick={() => setUnit("kg")}
                      className={cn("px-2 py-0.5 text-[10px] font-bold rounded-md transition-all", unit === 'kg' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
                    >KG</button>
                    <button 
                      onClick={() => setUnit("lbs")}
                      className={cn("px-2 py-0.5 text-[10px] font-bold rounded-md transition-all", unit === 'lbs' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
                    >LBS</button>
                  </div>
                </div>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="pl-9 h-12 bg-background/50 border-border/50 focus:border-health/50 focus:ring-health/10 transition-all rounded-xl font-bold"
                  />
                </div>
                <Slider
                  value={[weight]}
                  min={1}
                  max={500}
                  step={1}
                  onValueChange={([v]) => setWeight(v)}
                  className="pt-2"
                />
              </div>

              {/* Repetitions */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="reps">Repetitions</Label>
                  <span className="text-sm font-mono font-bold text-health">{reps} reps</span>
                </div>
                <div className="relative">
                  <RefreshCcw className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="reps"
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="pl-9 h-12 bg-background/50 border-border/50 focus:border-health/50 focus:ring-health/10 transition-all rounded-xl font-bold"
                  />
                </div>
                <Slider
                  value={[reps]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={([v]) => setReps(v)}
                  className="pt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <ResultStat
              label="Estimated One Rep Max"
              value={`${results.oneRepMax.toFixed(1)} ${unit}`}
              description="Your theoretical maximal strength"
              className="bg-health/5 border-health/10"
              icon={Target}
              valueClassName="text-health text-5xl"
            />
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="size-4 text-health" />
              <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Calculated Strength Chart</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {results.percentages.map((p) => (
                <div key={p.pct} className="bg-secondary/30 rounded-xl p-3 border border-border/50 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{p.label} Max</span>
                  <span className="text-lg font-bold font-mono">{p.weight.toFixed(1)} <span className="text-[10px] text-muted-foreground font-normal">{unit}</span></span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-background/50 rounded-xl border border-border/40">
              <div className="flex gap-3">
                <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Calculated using an average of **Epley** ({results.epley.toFixed(1)}) and **Brzycki** ({results.brzycki.toFixed(1)}) formulas. Accuracy decreases significantly as the number of reps in the input increases (best results for 1-10 reps).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
}

import { RefreshCcw } from "lucide-react";
