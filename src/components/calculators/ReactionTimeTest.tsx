"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Zap, Info, Target, RefreshCcw, Timer, History, 
  Share2, CheckCircle2, AlertCircle, Trophy,
  Brain, Rocket, MousePointer2, Volume2, VolumeX,
  Gauge, TrendingUp, BarChart3, Activity
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("human-reaction-time-test");

type TestState = "IDLE" | "WAITING" | "READY" | "RESULT" | "TOO_EARLY" | "SUMMARY";

const RANKS = [
  { label: "Superhuman", min: 0, max: 150, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Pro Sniper", min: 151, max: 200, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Turbo Reflex", min: 201, max: 250, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Average Human", min: 251, max: 350, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { label: "Slow Poke", min: 351, max: 500, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Sloth Mode", min: 501, max: 9999, color: "text-red-500", bg: "bg-red-500/10" },
];

const ReactionTimeTest = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [state, setState] = useState<TestState>("IDLE");
  const [time, setTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shaking, setShaking] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = useCallback((freq: number = 880, type: OscillatorType = "sine", duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      osc.start();
      osc.stop(audioCtx.current.currentTime + duration);
    } catch (e) { console.warn(e); }
  }, [soundEnabled]);

  const startTest = useCallback(() => {
    setState("WAITING");
    const delay = Math.floor(Math.random() * 3000) + 1500;
    
    timerRef.current = setTimeout(() => {
      setState("READY");
      playSound(1200, "square", 0.05);
      startTimeRef.current = performance.now();
    }, delay);
  }, [playSound]);

  const handleClick = useCallback(() => {
    if (state === "IDLE" || state === "RESULT" || state === "TOO_EARLY" || state === "SUMMARY") {
      if (state === "SUMMARY") setAttempts([]);
      startTest();
    } else if (state === "WAITING") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("TOO_EARLY");
      setShaking(true);
      playSound(200, "sawtooth", 0.2);
      setTimeout(() => setShaking(false), 500);
    } else if (state === "READY") {
      const endTime = performance.now();
      const reactionTime = Math.round(endTime - startTimeRef.current);
      setTime(reactionTime);
      const newAttempts = [...attempts, reactionTime];
      setAttempts(newAttempts);
      
      if (newAttempts.length >= 5) {
        setState("SUMMARY");
        playSound(660, "sine", 0.3);
      } else {
        setState("RESULT");
        playSound(880, "sine", 0.1);
      }
    }
  }, [state, startTest, attempts, playSound]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getRank = (ms: number) => {
    return RANKS.find(r => ms >= r.min && ms <= r.max) || RANKS[RANKS.length - 1];
  };

  const average = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) 
    : 0;

  const handleCopy = () => {
    const text = state === "SUMMARY" 
      ? `My Reaction Time Average: ${average}ms! Rank: ${getRank(average).label}`
      : `My Reaction Time: ${time}ms! Rank: ${getRank(time || 0).label}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Progress and Sound */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((step) => (
                <div 
                  key={step}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    attempts.length >= step ? "w-4 bg-blue-500" : "w-2 bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Round {Math.min(attempts.length + 1, 5)} / 5</span>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
            className="p-2 rounded-xl hover:bg-secondary transition-all border border-border/20"
          >
            {soundEnabled ? <Volume2 className="size-3 text-blue-500" /> : <VolumeX className="size-3 text-muted-foreground" />}
          </button>
        </div>

        {/* Main Test Box */}
        <div 
          onClick={handleClick}
          className={cn(
            "relative w-full min-h-[450px] rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col items-center justify-center text-center p-12 shadow-sm overflow-hidden",
            state === "IDLE" && "bg-secondary/5 border-border/40 hover:bg-secondary/10",
            state === "WAITING" && "bg-red-500/10 border-red-500/30",
            state === "READY" && "bg-green-500 border-green-600",
            state === "RESULT" && "bg-blue-500/5 border-blue-500/20",
            state === "TOO_EARLY" && "bg-orange-500/10 border-orange-500/30",
            state === "SUMMARY" && "bg-purple-500/5 border-purple-500/20",
            shaking && "animate-shake"
          )}
        >
          <div className="relative z-10 space-y-6">
            {state === "IDLE" && (
              <>
                <div className="bg-foreground/5 p-4 rounded-xl w-fit mx-auto mb-4">
                  <MousePointer2 className="size-8 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Reaction Time Test</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Click anywhere to begin</p>
              </>
            )}

            {state === "WAITING" && (
              <div className="animate-pulse">
                <div className="bg-red-500/20 p-5 rounded-xl w-fit mx-auto mb-6">
                  <Timer className="size-10 text-red-500" />
                </div>
                <h2 className="text-4xl font-bold text-red-500 tracking-tight">Wait for Green...</h2>
              </div>
            )}

            {state === "READY" && (
              <h2 className="text-8xl font-black text-white tracking-tighter uppercase drop-shadow-md">CLICK!</h2>
            )}

            {state === "RESULT" && time && (
              <div className="animate-in slide-in-from-bottom-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Round Score</p>
                <div className="flex items-baseline justify-center gap-2">
                  <h2 className="text-8xl font-mono font-bold text-blue-500 tabular-nums">{time}</h2>
                  <span className="text-xl font-bold text-blue-500/40 uppercase">ms</span>
                </div>
                <div className={cn("inline-flex px-4 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider mt-6", getRank(time).bg, getRank(time).color)}>
                  {getRank(time).label}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-12 opacity-40">Click to continue</p>
              </div>
            )}

            {state === "SUMMARY" && (
              <div className="animate-in zoom-in-95 space-y-6">
                <Trophy className="size-10 text-yellow-500 mx-auto" />
                <h2 className="text-3xl font-bold">Final Average</h2>
                <div className="flex items-baseline justify-center gap-2">
                  <h2 className="text-8xl font-mono font-bold text-purple-500 tabular-nums">{average}</h2>
                  <span className="text-xl font-bold text-purple-500/40 uppercase">ms</span>
                </div>
                <div className={cn("inline-flex px-6 py-2 rounded-xl border text-sm font-bold uppercase tracking-widest", getRank(average).bg, getRank(average).color)}>
                  {getRank(average).label}
                </div>
                <div className="pt-6">
                  <button onClick={handleCopy} className="bg-foreground text-background px-6 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mx-auto">
                    {copied ? <CheckCircle2 className="size-4" /> : <Share2 className="size-4" />}
                    {copied ? "Copied" : "Share Result"}
                  </button>
                </div>
              </div>
            )}

            {state === "TOO_EARLY" && (
              <div className="space-y-4">
                <AlertCircle className="size-10 text-orange-500 mx-auto" />
                <h2 className="text-3xl font-bold text-orange-500 tracking-tight">Too Early!</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Wait for the screen to turn green.</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-8 opacity-40">Click to try again</p>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="surface-card p-6 border-border/40 bg-secondary/5 rounded-2xl shadow-sm relative overflow-hidden group">
            <History className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform" />
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="size-4 text-muted-foreground" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Session Stats</h4>
            </div>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/20">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Round {i + 1}</span>
                  <span className="font-mono font-bold text-xs">{attempts[i] ? `${attempts[i]}ms` : "---"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            <div className="surface-card p-8 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden">
              <TrendingUp className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5" />
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="size-4 text-yellow-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Benchmark</h4>
              </div>
              <p className="text-3xl font-mono font-bold">273ms</p>
              <p className="text-xs text-muted-foreground mt-2">The global average for human reaction. Pro gamers often average 150-200ms.</p>
            </div>

            <div className="surface-card p-8 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden">
              <Activity className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5" />
              <div className="flex items-center gap-2 mb-4">
                <Info className="size-4 text-blue-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">About the Test</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">This test measures your brain's processing speed. Complete all 5 rounds to get a stable average score and your official rank.</p>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out 0s 2; }
      `}</style>
    </CalculatorPage>
  );
};

export default ReactionTimeTest;
