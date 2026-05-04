"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Zap, Info, Target, RefreshCcw, Timer, History, 
  Share2, CheckCircle2, AlertCircle, Trophy,
  Brain, Rocket, MousePointer2, Volume2, VolumeX,
  Gauge, TrendingUp, BarChart3, Activity
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { SITE_URL } from "@/lib/constants";
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
    const shareUrl = `${SITE_URL}/calculators/${calc.slug}`;
    const text = state === "SUMMARY" 
      ? `My Reaction Time Average: ${average}ms! Rank: ${getRank(average).label}\nCheck your reaction time at: ${shareUrl}`
      : `My Reaction Time: ${time}ms! Rank: ${getRank(time || 0).label}\nCheck your reaction time at: ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Stats */}
        <div className="flex items-center justify-between px-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Rounds Progress</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div 
                    key={step}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      attempts.length >= step ? "w-4 bg-signal" : "w-2 bg-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-muted-foreground/60">{attempts.length}/5</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
              className="p-2.5 rounded-xl hover:bg-secondary transition-all border border-border/20 bg-background flex items-center gap-2"
            >
              {soundEnabled ? <Volume2 className="size-3 text-signal" /> : <VolumeX className="size-3 text-muted-foreground" />}
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{soundEnabled ? "On" : "Off"}</span>
            </button>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Best Reaction</span>
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-yellow-500" />
                <span className="text-2xl font-mono font-bold">{attempts.length > 0 ? Math.min(...attempts) : "--"} <span className="text-xs">ms</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interaction Area */}
        <div 
          onClick={handleClick}
          className={cn(
            "p-8 md:p-12 rounded-3xl shadow-sm flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden group cursor-pointer select-none border transition-all",
            state === "IDLE" && "bg-secondary/5 border-border/40 hover:bg-secondary/10 duration-300",
            state === "WAITING" && "bg-red-500/10 border-red-500/30 cursor-wait duration-300",
            state === "READY" && "bg-signal border-signal shadow-[0_0_50px_hsl(var(--signal)/0.4)] duration-0",
            state === "RESULT" && "bg-blue-500/5 border-blue-500/20 duration-300",
            state === "TOO_EARLY" && "bg-orange-500/10 border-orange-500/30 duration-300",
            state === "SUMMARY" && "bg-purple-500/5 border-purple-500/20 duration-500",
            (state !== "READY") && "surface-card",
            shaking && "animate-shake"
          )}
        >
          
          {state === "IDLE" && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                <Rocket className="size-10 text-signal" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Reaction Time Test</h2>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm">Measure your visual reflexes in milliseconds. Click anywhere when the screen turns blue.</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                <MousePointer2 className="size-3" />
                Click to Start
              </div>
            </div>
          )}

          {state === "WAITING" && (
            <div className="text-center space-y-8 animate-in fade-in duration-300">
              <div className="size-32 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border-4 border-red-500/40 animate-pulse">
                <Timer className="size-12 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-red-500 tracking-tight uppercase italic">Wait for Blue...</h2>
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-60">Get ready to click!</p>
              </div>
            </div>
          )}

          {state === "READY" && (
            <div className="text-center space-y-4 animate-in zoom-in-110 duration-75">
              <h2 className="text-9xl font-black text-white tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]">NOW!</h2>
              <p className="text-white font-black uppercase tracking-[0.5em] opacity-90">Click Now</p>
            </div>
          )}

          {state === "RESULT" && time && (
            <div className="text-center space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Round Result</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-9xl font-mono font-bold text-signal tracking-tighter tabular-nums">{time}</span>
                  <span className="text-2xl font-bold text-signal/40 uppercase">ms</span>
                </div>
              </div>
              <div className={cn("inline-flex items-center gap-2 px-6 py-2 rounded-xl border text-sm font-bold uppercase tracking-widest shadow-sm", getRank(time).bg, getRank(time).color)}>
                <Trophy className="size-4" />
                {getRank(time).label}
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                <RefreshCcw className="size-3" />
                Click to Continue
              </div>
            </div>
          )}

          {state === "TOO_EARLY" && (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-300">
              <div className="size-20 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto border border-orange-500/20">
                <AlertCircle className="size-10 text-orange-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-orange-500 tracking-tight uppercase">Too Early!</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">You clicked before the blue light appeared. Try again!</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                <RefreshCcw className="size-3" />
                Restart Round
              </div>
            </div>
          )}

          {state === "SUMMARY" && (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="size-20 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto border border-purple-500/20">
                <Trophy className="size-10 text-purple-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Final Average</h2>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-9xl font-mono font-bold text-purple-500 tracking-tighter tabular-nums">{average}</span>
                  <span className="text-2xl font-bold text-purple-500/40 uppercase">ms</span>
                </div>
              </div>
              <div className={cn("inline-flex items-center gap-2 px-8 py-3 rounded-2xl border text-base font-bold uppercase tracking-widest shadow-md", getRank(average).bg, getRank(average).color)}>
                {getRank(average).label}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); setAttempts([]); startTest(); }}
                  className="h-12 px-8 rounded-xl bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all w-full sm:w-auto"
                >
                  <RefreshCcw className="size-3 mr-2 inline" />
                  Try Again
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                  className="h-12 px-8 rounded-xl bg-secondary border border-border/40 font-bold uppercase tracking-widest text-[10px] hover:bg-secondary/80 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  {copied ? <CheckCircle2 className="size-3" /> : <Share2 className="size-3" />}
                  {copied ? "Copied" : "Share Result"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <History className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-4 text-signal" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Attempts</h4>
            </div>
            <div className="space-y-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/10">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Round {i + 1}</span>
                  <span className="font-mono font-bold text-xs">{attempts[i] ? `${attempts[i]}ms` : "---"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Zap className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="size-4 text-blue-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Standard Scores</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Human</span>
                <span className="font-mono text-sm font-bold">273ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Pro Gamer</span>
                <span className="font-mono text-sm font-bold text-signal">180ms</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-4 italic">
                Reaction times can vary based on your screen's refresh rate and hardware latency.
              </p>
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <Brain className="size-4 text-purple-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neuroscience</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reaction time is the interval between a stimulus and the initiation of a response. It involves sensory perception, brain processing, and motor command.
            </p>
          </div>
        </div>

      </div>

    </CalculatorPage>
  );
};

export default ReactionTimeTest;
