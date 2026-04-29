"use client";

import { useMemo, useState } from "react";
import { 
  Droplet, Moon, Activity, Sun, Thermometer, Clock, GlassWater, 
  Coffee, Sparkles, Share, CheckCircle2, Info, User, Zap, 
  History, Target, Landmark, Globe, Ruler, Settings2, Copy,
  Calendar, LayoutDashboard, ChevronRight, Waves, Bed, 
  CloudMoon, Sunrise, Timer, FastForward, Heart, Beaker, Brain
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("water-intake-sleep-calculator")!;

const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const WaterSleepCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [tab, setTab] = useState<"water" | "sleep">("water");
  const [copied, setCopied] = useState(false);

  // Water State
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = useState(70);
  const [weightLb, setWeightLb] = useState(155);
  const [activityMin, setActivityMin] = useState(30);
  const [climate, setClimate] = useState<"normal" | "hot">("normal");

  // Sleep State
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("07:00");

  const water = useMemo(() => {
    const w = units === "metric" ? weightKg : weightLb * 0.453592;
    let ml = w * 33; 
    ml += (activityMin / 30) * 350;
    if (climate === "hot") ml *= 1.15;
    const liters = ml / 1000;
    const cups = ml / 240;
    return { ml: Math.round(ml), liters, cups: Math.round(cups) };
  }, [units, weightKg, weightLb, activityMin, climate]);

  const sleep = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    const fall = 15; 
    const cycles = [6, 5, 4, 3]; 
    return cycles.map((c) => {
      const offsetMin = (mode === "wake" ? -1 : 1) * (c * 90 + fall);
      const t = new Date(target.getTime() + offsetMin * 60 * 1000);
      return { cycles: c, hours: c * 1.5, time: t };
    });
  }, [time, mode]);

  const handleCopy = () => {
    const text = tab === "water" 
      ? `Daily Hydration: ${water.liters.toFixed(2)}L (${water.cups} cups). Plan at ${SITE_DOMAIN}`
      : `REM Sleep Cycles: Target ${mode === 'wake' ? 'Wake' : 'Sleep'} at ${time}. Plan at ${SITE_DOMAIN}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-12">
        
        {/* Navigation Interface */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-2 w-full md:w-[440px] bg-secondary/10 p-1 rounded-2xl h-14 border border-border/40">
            <TabsTrigger value="water" className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-lg transition-all">
              <Waves className="size-4" /> Daily Water
            </TabsTrigger>
            <TabsTrigger value="sleep" className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-lg transition-all">
              <CloudMoon className="size-4" /> Sleep Cycles
            </TabsTrigger>
          </TabsList>
          
          <button 
            onClick={handleCopy} 
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-sm border h-14",
              copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
            )}
          >
            {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy Plan"}
          </button>
        </div>

        {/* HYDRATION ARCHITECTURE */}
        <TabsContent value="water" className="mt-0 focus-visible:outline-none outline-none">
          <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Input Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
                <Settings2 className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                
                <div className="space-y-1 relative z-10">
                  <h3 className="text-sm font-bold tracking-tight">Water Goal</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Your Details</p>
                </div>

                <div className="space-y-8 relative z-10">
                  {/* Unit Switcher */}
                  <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11">
                    <button onClick={() => setUnits("metric")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'metric' ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-secondary/40")}>Metric</button>
                    <button onClick={() => setUnits("imperial")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all", units === 'imperial' ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-secondary/40")}>Imperial</button>
                  </div>

                  {/* Body Weight */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Weight</Label>
                      <span className="text-[10px] font-bold text-health">{units === 'metric' ? weightKg : weightLb} {units === 'metric' ? 'kg' : 'lb'}</span>
                    </div>
                    <div className="relative group">
                       <Input 
                          type="number" 
                          value={units === 'metric' ? weightKg : weightLb} 
                          onChange={(e) => units === 'metric' ? setWeightKg(Number(e.target.value)) : setWeightLb(Number(e.target.value))} 
                          className="h-11 bg-background border-border/60 font-bold rounded-lg shadow-sm pr-12" 
                        />
                        <Beaker className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                    </div>
                    {units === "metric" ? (
                      <Slider value={[weightKg]} min={40} max={200} step={1} onValueChange={([v]) => setWeightKg(v)} />
                    ) : (
                      <Slider value={[weightLb]} min={90} max={450} step={1} onValueChange={([v]) => setWeightLb(v)} />
                    )}
                  </div>

                  {/* Activity */}
                  <div className="space-y-4 pt-2 border-t border-border/40">
                    <div className="flex justify-between items-center pt-4">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Daily Activity</Label>
                      <span className="text-[10px] font-bold text-health">{activityMin} min/day</span>
                    </div>
                    <Slider value={[activityMin]} min={0} max={180} step={5} onValueChange={([v]) => setActivityMin(v)} />
                  </div>

                  {/* Climate */}
                  <div className="space-y-3 pt-2 border-t border-border/40">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pt-4 block">Weather / Climate</Label>
                    <Select value={climate} onValueChange={(v) => setClimate(v as any)}>
                      <SelectTrigger className="h-11 bg-background border-border/60 font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/40">
                        <SelectItem value="normal" className="text-[10px] font-bold uppercase tracking-widest">Normal</SelectItem>
                        <SelectItem value="hot" className="text-[10px] font-bold uppercase tracking-widest">Hot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
                <Sparkles className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
                <div className="flex gap-4 items-start relative z-10">
                  <div className="mt-1 text-health">
                    <Droplet className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Hydration Tip</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Sip water throughout the day rather than drinking large amounts all at once.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-8 space-y-8">
              {/* Executive Summary */}
              <div className="surface-card p-8 md:p-10 space-y-8 bg-background border-border/60 shadow-md relative overflow-hidden group">
                <Waves className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
                
                <div className="space-y-4 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Your Daily Water Goal</span>
                  <div className="text-6xl md:text-7xl font-mono font-medium tracking-tighter tabular-nums text-health">
                    {water.liters.toFixed(2)}<span className="text-2xl md:text-3xl ml-3 font-sans font-normal opacity-40 uppercase tracking-tight">Liters</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/40">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm">
                      <Beaker className="size-3" />
                      <span>{water.ml} Total ml Goal</span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      About {water.cups} standard cups (240ml)
                    </div>
                  </div>
                </div>
              </div>

              {/* Protocol Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily Drinking Schedule</h4>
                  <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Suggested split</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { time: "Morning", pct: 0.3, icon: Sunrise, desc: "Start your day" },
                    { time: "Midday", pct: 0.3, icon: Sun, desc: "Stay focused" },
                    { time: "Afternoon", pct: 0.25, icon: Activity, desc: "Keep energy up" },
                    { time: "Evening", pct: 0.15, icon: Moon, desc: "Wind down" },
                  ].map((s) => (
                    <div key={s.time} className="surface-card p-6 border-border/30 bg-background hover:border-foreground/20 transition-all group">
                      <div className="text-[9px] uppercase font-bold text-muted-foreground mb-4 flex items-center gap-2 group-hover:text-foreground transition-colors">
                        <s.icon className="size-3" /> {s.time}
                      </div>
                      <div className="text-2xl font-mono font-bold tracking-tight tabular-nums">
                        {Math.round(water.ml * s.pct)}<span className="text-[10px] ml-1 opacity-40 font-sans font-normal">ml</span>
                      </div>
                      <p className="text-[8px] font-bold uppercase tracking-tighter opacity-30 mt-2">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                 {[
                   { l: "Sips per hour", v: Math.round(water.ml / 16), i: Clock, unit: "ml" },
                   { l: "Minimum Need", v: (water.ml * 0.7).toFixed(0), i: History, unit: "ml" },
                   { l: "Pacing", v: "Optimum", i: Zap },
                   { l: "Result", v: "Class A", i: Landmark }
                 ].map((item, idx) => (
                   <div key={idx} className="surface-card p-5 border-border/30 bg-secondary/5 hover:border-foreground/20 transition-colors group">
                     <div className="flex items-center gap-2 mb-3">
                        <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                     </div>
                     <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                        {item.v}
                        <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SLEEP ARCHITECTURE */}
        <TabsContent value="sleep" className="mt-0 focus-visible:outline-none outline-none">
          <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Input Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="surface-card p-6 md:p-8 space-y-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
                <CloudMoon className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                
                <div className="space-y-1 relative z-10">
                  <h3 className="text-sm font-bold tracking-tight">Sleep Times</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Sleep Planner</p>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sleep Goal</Label>
                    <div className="flex bg-background border border-border/60 p-1 rounded-xl h-11 shadow-inner">
                      <button onClick={() => setMode("wake")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all", mode === 'wake' ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:bg-secondary/40")}>Wake-Up Goal</button>
                      <button onClick={() => setMode("sleep")} className={cn("flex-1 text-[10px] font-bold uppercase tracking-tight rounded-lg transition-all", mode === 'sleep' ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:bg-secondary/40")}>Sleep Goal</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Time</Label>
                    <div className="relative group">
                       <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                       <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 pl-12 bg-background border-border/60 font-bold rounded-xl shadow-sm text-lg" />
                    </div>
                  </div>

                  <div className="p-6 bg-foreground/5 rounded-2xl border border-foreground/10 space-y-3 relative overflow-hidden">
                    <Brain className="absolute -bottom-4 -right-4 size-16 text-foreground/[0.03]" />
                    <div className="flex gap-4 relative z-10">
                      <Sparkles className="size-4 text-foreground/60 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                        Includes 15 minutes to fall asleep. Waking up between 90-minute sleep cycles helps you feel more refreshed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="surface-card p-6 border-border/30 bg-health/5 relative overflow-hidden group">
                <Bed className="absolute -bottom-4 -right-4 size-20 text-health/5 group-hover:rotate-12 transition-transform duration-700" />
                <div className="flex gap-4 items-start relative z-10">
                  <div className="mt-1 text-health">
                    <Moon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Sleep Consistency</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Going to bed and waking up at the same time every day helps regulate your body's internal clock.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Panel */}
            <div className="lg:col-span-8 space-y-8">
              <div className="surface-card bg-background border-border/60 shadow-lg relative overflow-hidden rounded-3xl">
                <div className="p-8 border-b border-border/30 bg-secondary/5 flex items-center justify-between relative overflow-hidden">
                  <CloudMoon className="absolute -top-12 -right-12 size-48 text-foreground/[0.03] -rotate-12" />
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold tracking-tight uppercase tracking-[0.2em]">{mode === "wake" ? "Suggested Bedtimes" : "Suggested Wake Times"}</h3>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">90m Cycles • Better Rest</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-background border border-border/40 shadow-sm relative z-10">
                    <Timer className="size-5 text-foreground/40" />
                  </div>
                </div>
                
                <div className="divide-y divide-border/20">
                  {sleep.map((s, i) => (
                    <div key={s.cycles} className={cn("flex items-center justify-between px-8 py-8 transition-all group", i === 0 ? "bg-health/[0.03]" : "hover:bg-secondary/10")}>
                      <div className="flex items-center gap-10">
                        <div className="text-5xl font-mono font-bold tracking-tighter tabular-nums text-foreground group-hover:scale-105 transition-transform origin-left duration-500">
                          {formatTime(s.time)}
                        </div>
                        <div className="h-10 w-px bg-border/40 hidden md:block" />
                        <div className="hidden md:block">
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{s.cycles} Sleep Cycles</div>
                          <div className="text-xs font-bold text-health uppercase mt-1 tracking-tighter">{s.hours} Hours Total</div>
                        </div>
                      </div>
                      
                      {i === 0 && (
                        <div className="flex items-center gap-2 bg-foreground text-background px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] shadow-xl">
                          <Sparkles className="size-3" /> Best
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recovery stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { l: "Cycle Length", v: "90", i: Timer, unit: "min" },
                   { l: "Fall Asleep", v: "15", i: FastForward, unit: "min" },
                   { l: "Cycle Type", v: "REM", i: Brain },
                   { l: "Status", v: "Calibrated", i: Landmark }
                 ].map((item, idx) => (
                   <div key={idx} className="surface-card p-5 border-border/30 bg-secondary/5 hover:border-foreground/20 transition-colors group">
                     <div className="flex items-center gap-2 mb-3">
                        <item.i className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.l}</span>
                     </div>
                     <div className="text-lg font-mono font-medium tabular-nums leading-tight">
                        {item.v}
                        <span className="text-[10px] ml-1 opacity-40 uppercase">{item.unit}</span>
                     </div>
                   </div>
                 ))}
              </div>

              {/* Expert Insight */}
              <div className="surface-card p-8 border-border/30 space-y-4 bg-background relative overflow-hidden group">
                 <Heart className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700" />
                 <div className="flex items-center gap-3 relative z-10">
                    <User className="size-4 text-muted-foreground" />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Better Sleep</h4>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                   Try to get 5 full sleep cycles (7.5 hours) for the best rest. If you need to sleep less, try to wake up at the end of a cycle so you don't feel groggy.
                 </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CalculatorPage>
  );
};

export default WaterSleepCalculator;
