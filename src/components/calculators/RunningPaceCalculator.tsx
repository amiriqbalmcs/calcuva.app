"use client";

import { useState, useMemo } from "react";
import {
  Timer, Ruler, Clock, Activity, TrendingUp, Info,
  ChevronRight, Gauge, Zap, Target, History, Landmark,
  Share, CheckCircle2, Trophy, Footprints, Settings2,
  Copy, LayoutDashboard, Waves, Flame, Siren, User,
  ZapOff, Heart, FastForward
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { calculatorBySlug } from "@/lib/calculators";

const calc = calculatorBySlug("running-pace-calculator")!;

const standardDistances = [
  { label: "5K", distance: 5.0, unit: "km" },
  { label: "10K", distance: 10.0, unit: "km" },
  { label: "HALF", distance: 21.0975, unit: "km" },
  { label: "FULL", distance: 42.195, unit: "km" },
  { label: "1 MI", distance: 1.0, unit: "mile" },
];

const RunningPaceCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [distance, setDistance] = useState<number>(5);
  const [distanceUnit, setDistanceUnit] = useState<string>("km");
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    if (distance === 0 || totalSeconds === 0) return null;

    const totalDistanceKm = distanceUnit === "km" ? distance : distance * 1.60934;
    const totalDistanceMiles = distanceUnit === "mile" ? distance : distance / 1.60934;

    const pacePerKmTotal = totalSeconds / totalDistanceKm;
    const pacePerMileTotal = totalSeconds / totalDistanceMiles;

    const formatPace = (totalSecs: number) => {
      const min = Math.floor(totalSecs / 60);
      const sec = Math.round(totalSecs % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    const splits = [];
    const splitInterval = distance > 10 ? 5 : 1;
    for (let i = splitInterval; i <= distance; i += splitInterval) {
      const splitTime = (totalSeconds / distance) * i;
      const h = Math.floor(splitTime / 3600);
      const m = Math.floor((splitTime % 3600) / 60);
      const s = Math.round(splitTime % 60);
      splits.push({
        label: `${i}${distanceUnit}`,
        time: `${h > 0 ? h + ':' : ''}${m.toString().padStart(h > 0 ? 2 : 1, '0')}:${s.toString().padStart(2, '0')}`
      });
    }

    return {
      pacePerKm: formatPace(pacePerKmTotal),
      pacePerMile: formatPace(pacePerMileTotal),
      speedKph: (totalDistanceKm / (totalSeconds / 3600)).toFixed(1),
      speedMph: (totalDistanceMiles / (totalSeconds / 3600)).toFixed(1),
      splits
    };
  }, [distance, distanceUnit, hours, minutes, seconds]);

  const handleCopy = () => {
    if (!results) return;
    let text = `Goal Pace: ${distanceUnit === 'km' ? results.pacePerKm : results.pacePerMile} per ${distanceUnit}. Race Strategy at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <Footprints className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Your Run</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Distance & Time</p>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Distance Selection */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Distance</Label>
                <div className="flex flex-wrap gap-1.5">
                  {standardDistances.map((sd) => (
                    <button
                      key={sd.label}
                      onClick={() => { setDistance(sd.distance); setDistanceUnit(sd.unit); }}
                      className={cn(
                        "px-3 py-2 rounded-lg text-[10px] font-bold tracking-tight transition-all",
                        (distance === sd.distance && distanceUnit === sd.unit)
                          ? "bg-foreground text-background"
                          : "bg-background border border-border/60 text-muted-foreground hover:border-foreground"
                      )}
                    >
                      {sd.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-[1fr_80px] gap-2">
                  <Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm" />
                  <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                    <SelectTrigger className="h-11 bg-background border-border/60 font-bold rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">KM</SelectItem>
                      <SelectItem value="mile">MI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Finish Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase text-center block opacity-60">Hrs</span>
                    <Input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold text-center rounded-lg shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase text-center block opacity-60">Min</span>
                    <Input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold text-center rounded-lg shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase text-center block opacity-60">Sec</span>
                    <Input type="number" value={seconds} onChange={(e) => setSeconds(Number(e.target.value) || 0)} className="h-11 bg-background border-border/60 font-bold text-center rounded-lg shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-health">
                <Trophy className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Pace Goal</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {results
                    ? `To hit your goal of ${hours}h ${minutes}m, you need to run at an average pace of ${distanceUnit === 'km' ? results.pacePerKm : results.pacePerMile} for the whole run.`
                    : "Enter your distance and target time to see your required pace and splits."}
                </p>
              </div>
            </div>
          </div>

          {calc.howTo && (
            <HowToGuide 
              id="how-to-use"
              steps={calc.howTo!.steps} 
              proTip={calc.howTo!.proTip} 
              variant="sidebar" 
            />
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          {results ? (
            <>
              {/* Executive Summary */}
              <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
                <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Timer className="size-3" />
                        Required Pace
                      </div>
                      <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter tabular-nums text-health">
                        {distanceUnit === 'km' ? results.pacePerKm : results.pacePerMile} <span className="text-xl md:text-2xl opacity-40 uppercase tracking-widest font-sans font-bold">/{distanceUnit}</span>
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
                        <Gauge className="size-3 text-health" />
                        Average Speed
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-health tabular-nums">
                        {distanceUnit === 'km' ? results.speedKph : results.speedMph} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">{distanceUnit === 'km' ? 'KPH' : 'MPH'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Ruler className="size-3" />
                        Race Distance
                      </div>
                      <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                        {distance} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans">{distanceUnit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Splits Matrix */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Splits</h4>
                <div className="surface-card p-0 overflow-hidden border-border/40 bg-secondary/5">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/20">
                    {results.splits.map((s, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-background transition-colors group">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold text-muted-foreground w-6 font-mono opacity-40">{(idx + 1).toString().padStart(2, '0')}</span>
                          <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">{s.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-bold text-health">{s.time}</span>
                          <ChevronRight className="size-3 text-muted-foreground/20 group-hover:text-health transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Intensity", v: Number(results.speedKph) > 15 ? "High" : (Number(results.speedKph) > 12 ? "Medium" : "Low"), i: Activity },
                  { l: "Target Steps/Min", v: "170-180", i: Footprints, unit: "SPM" },
                  { l: "Interval", v: distance > 10 ? "5K" : "1K", i: Target },
                  { l: "Status", v: "Optimized", i: Zap }
                ].map((item, idx) => (
                  <div key={idx} className="surface-card p-5 border-border/30 bg-background hover:border-foreground/20 transition-colors group">
                    <div className="flex items-center gap-2 mb-3">
                      <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                    </div>
                    <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                      {item.v}
                      {item.unit && <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expert Tips */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
                  <FastForward className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History className="size-3 text-health" /> Pacing Strategy
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Running the second half of your race slightly faster than the first half (a &quot;negative split&quot;) is a great way to save energy and finish strong.
                  </p>
                </div>
                <div className="surface-card p-8 border-border/30 bg-secondary/5 relative overflow-hidden group">
                  <Heart className="size-20 absolute -bottom-4 -right-4 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Timer className="size-3 text-health" /> Save Your Energy
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    Try to hold a steady, comfortable pace so you don&apos;t tire out your muscles too early in the race.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="surface-card p-32 flex flex-col items-center justify-center text-center bg-secondary/5 border-dashed border-border/60">
              <Activity className="size-12 text-muted-foreground/20 mb-6 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 max-w-xs leading-loose">
                Waiting for your numbers... Please enter distance and time.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};
export default RunningPaceCalculator;
