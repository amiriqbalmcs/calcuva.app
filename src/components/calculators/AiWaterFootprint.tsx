"use client";

import { useMemo, useState } from "react";
import { 
  Droplets, Bot, Cpu, Zap, 
  ArrowRight, Info, AlertTriangle, 
  Download, Share2, Copy, CheckCircle2,
  HelpCircle, Lightbulb, Waves, CloudRain
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HowToGuide } from "@/components/HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("ai-water-footprint-calculator")!;

const AiWaterFootprint = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [promptsPerDay, setPromptsPerDay] = useState<number>(25);
  const [modelType, setModelType] = useState<"flagship" | "efficient">("flagship");
  const [videoHours, setVideoHours] = useState<number>(2); // AI Video/Gen
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // 2026 Estimated Water Consumption for Data Center Cooling
    // Flagship (GPT-5/Claude 4) = ~500ml per 10-50 prompts (avg 25ml per prompt)
    // Efficient (Flash/Haiku) = ~5ml per prompt
    // AI Video = ~2 Liters per hour of generation
    
    const promptWaterRate = modelType === "flagship" ? 0.025 : 0.005; // Liters
    const promptWaterDaily = promptsPerDay * promptWaterRate;
    const videoWaterDaily = videoHours * 2.0;
    
    const totalDailyLiters = promptWaterDaily + videoWaterDaily;
    const monthlyLiters = totalDailyLiters * 30.44;
    const annualLiters = totalDailyLiters * 365;

    return {
      totalDailyLiters,
      monthlyLiters,
      annualLiters,
      equivalentDrinkingDays: Math.round(annualLiters / 2), // 2L/day avg human
      dataCenterEvaporation: annualLiters * 0.8 // 80% is evaporated for cooling
    };
  }, [promptsPerDay, modelType, videoHours]);

  const handleCopy = () => {
    const text = `My AI Digital Footprint: My ${promptsPerDay} daily prompts consume ${results.annualLiters.toFixed(0)} Liters of water annually for cooling. Check your impact at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">
        
        {/* Main Interface: Side-by-Side Results & Inputs */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-10 bg-background border-border/60 shadow-xl space-y-10 sticky top-32 overflow-hidden rounded-2xl">
               <div className="absolute top-0 right-0 size-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

               <div className="space-y-6 relative border-b border-border/40 pb-10">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Annual Water Cost</div>
                      <button 
                         onClick={handleCopy}
                         className={cn(
                            "p-2 rounded-lg transition-all border shadow-sm",
                            copied ? "bg-blue-600 text-white border-blue-700" : "bg-background text-foreground border-border hover:bg-secondary"
                         )}
                      >
                         {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                      </button>
                   </div>
                  <div className="text-6xl font-mono font-bold tracking-tighter text-blue-700 dark:text-blue-400">
                     {Math.round(results.annualLiters).toLocaleString()}L
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Waves className="size-3" /> Digital Ocean
                    </div>
                  </div>
               </div>

                <div className="space-y-8 relative">
                  <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/20 space-y-4">
                     <div className="flex items-center gap-2 text-blue-700/60 dark:text-blue-400/60">
                        <Droplets className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sustainability Score</span>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-bold uppercase text-blue-800 dark:text-blue-400">
                              <span>Evaporation Load</span>
                              <span>{Math.round(results.dataCenterEvaporation).toLocaleString()}L / yr</span>
                          </div>
                          <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                                style={{ width: `${Math.min(100, (results.annualLiters / 5000) * 100)}%` }} 
                              />
                          </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-blue-900 text-white rounded-2xl flex gap-4 shadow-xl">
                     <Bot className="size-5 text-blue-300 shrink-0" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest">2026 Fact</p>
                        <p className="text-[9px] text-blue-100 leading-relaxed font-medium">
                          A single hour of AI video generation in 2026 consumes as much cooling water as a standard household uses for a full day of laundry.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Left Column: Inputs Panel */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20 overflow-hidden shadow-sm rounded-2xl">
              <div className="p-8 border-b border-blue-500/10 dark:border-blue-500/20 bg-background flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                    <Cpu className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">Digital Consumption</h3>
                    <p className="text-[10px] text-blue-600/60 dark:text-blue-400/60 uppercase tracking-widest font-bold">Data Center Cooling Metrics 2026</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Prompts / Day (Chat)</Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        value={promptsPerDay || ""}
                        onChange={(e) => setPromptsPerDay(Number(e.target.value) || 0)}
                        className="h-20 bg-background border-border/60 font-mono text-4xl font-bold rounded-2xl pl-12 focus:ring-4 ring-blue-500/5 transition-all"
                        placeholder="25"
                      />
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/20 font-mono text-xl font-bold">💬</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Model Hierarchy</Label>
                    <div className="flex gap-2 h-20">
                      {[
                        { id: "flagship", label: "Flagship", sub: "Opus / GPT-5", icon: Bot },
                        { id: "efficient", label: "Efficient", sub: "Flash / Haiku", icon: Zap }
                      ].map((model) => (
                        <button 
                          key={model.id}
                          onClick={() => setModelType(model.id as any)}
                          className={cn(
                            "flex-1 px-4 rounded-2xl text-left border transition-all flex flex-col justify-center gap-1",
                            modelType === model.id ? "bg-blue-600 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-700 shadow-lg shadow-blue-500/20" : "bg-background text-muted-foreground border-border hover:bg-secondary"
                          )}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{model.label}</span>
                          <span className="text-[9px] opacity-60 font-bold">{model.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                    AI Video/Image Generation Time (Hours/Day)
                    <span className="text-blue-600 font-mono text-xs">{videoHours}h</span>
                  </Label>
                  <div className="pt-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="12" 
                      step="0.5"
                      value={videoHours} 
                      onChange={(e) => setVideoHours(Number(e.target.value))}
                      className="w-full h-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[8px] font-black text-muted-foreground mt-2 uppercase tracking-widest">
                      <span>None</span>
                      <span>High Usage</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-500/5 dark:bg-blue-500/10 border-t border-blue-500/10 dark:border-blue-500/20 grid sm:grid-cols-2 gap-6">
                 <div className="flex gap-4 items-center">
                    <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
                      <CloudRain className="size-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-blue-600/70 dark:text-blue-400/70">Daily Evaporation</div>
                      <div className="text-xl font-mono font-bold text-blue-800 dark:text-blue-300">{results.totalDailyLiters.toFixed(2)} Liters</div>
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="size-10 rounded-xl bg-background dark:bg-secondary border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
                      <Droplets className="size-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-blue-600/70 dark:text-blue-400/70">Human Survival Equivalent</div>
                      <div className="text-xl font-mono font-bold text-blue-800 dark:text-blue-300">{results.equivalentDrinkingDays.toLocaleString()} Days</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-6 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lightbulb className="size-4 text-blue-600" /> How to Reduce Your Digital Water Footprint
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/20 space-y-2">
                  <p className="text-[11px] font-black text-blue-900 dark:text-blue-400 uppercase">Use 'Flash' Models</p>
                  <p className="text-[10px] text-blue-800/60 dark:text-blue-400/60 leading-relaxed font-medium">For simple tasks, switch to efficient models like <strong>Gemini 1.5 Flash</strong>. They use 5x less water for cooling than flagship models.</p>
                </div>
                <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/20 space-y-2">
                  <p className="text-[11px] font-black text-blue-900 dark:text-blue-400 uppercase">Prompt Caching</p>
                  <p className="text-[10px] text-blue-800/60 dark:text-blue-400/60 leading-relaxed font-medium">Enable caching for repetitive tasks to avoid re-running compute-heavy context windows, saving both tokens and water.</p>
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

export default AiWaterFootprint;
