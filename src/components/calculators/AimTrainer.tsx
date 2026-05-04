"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Target, Rocket, MousePointer2, RefreshCcw, 
  Trophy, History, BarChart3, Zap, Info, Share2, CheckCircle2,
  Timer, Crosshair, MousePointer, Volume2, VolumeX
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { SITE_URL } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("aim-trainer");
const TOTAL_TARGETS = 30;

const AimTrainer = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "RESULT">("IDLE");
  const [targetsHit, setTargetsHit] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = useCallback((freq: number = 880, type: OscillatorType = "sine", duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      osc.start();
      osc.stop(audioCtx.current.currentTime + duration);
    } catch (e) { console.warn(e); }
  }, [soundEnabled]);

  const moveTarget = useCallback(() => {
    if (!containerRef.current) return;
    const padding = 10; // 10% padding
    const x = Math.random() * (100 - 2 * padding) + padding;
    const y = Math.random() * (100 - 2 * padding) + padding;
    setTargetPos({ x, y });
  }, []);

  const startGame = () => {
    setGameState("PLAYING");
    setTargetsHit(0);
    setStartTime(performance.now());
    moveTarget();
    playSound(440, "sine", 0.1);
  };

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newHitCount = targetsHit + 1;
    setTargetsHit(newHitCount);
    playSound(880 + newHitCount * 20, "sine", 0.05);

    if (newHitCount >= TOTAL_TARGETS) {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgTime = Math.round(totalTime / TOTAL_TARGETS);
      setResult(avgTime);
      setGameState("RESULT");
      setAttempts(prev => [avgTime, ...prev].slice(0, 5));
      if (!bestScore || avgTime < bestScore) setBestScore(avgTime);
      playSound(1200, "sine", 0.3);
    } else {
      moveTarget();
    }
  };

  const handleCopy = () => {
    const shareUrl = `${SITE_URL}/calculators/${calc.slug}`;
    const text = `My Aim Trainer Score: ${result}ms per target! Best: ${bestScore}ms\nTest your aim at: ${shareUrl}`;
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Targets Progress</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="h-2 w-48 bg-muted-foreground/10 rounded-full overflow-hidden border border-border/20">
                  <div 
                    className="h-full bg-signal transition-all duration-300"
                    style={{ width: `${(targetsHit / TOTAL_TARGETS) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-muted-foreground">{targetsHit} / {TOTAL_TARGETS}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl hover:bg-secondary transition-all border border-border/20 bg-background flex items-center gap-2"
            >
              {soundEnabled ? <Volume2 className="size-3 text-signal" /> : <VolumeX className="size-3 text-muted-foreground" />}
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{soundEnabled ? "On" : "Off"}</span>
            </button>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Personal Best</span>
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-yellow-500" />
                <span className="text-2xl font-mono font-bold">{bestScore || "--"} <span className="text-xs text-muted-foreground">ms</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Area */}
        <div 
          ref={containerRef}
          className="surface-card border-border/40 bg-secondary/5 rounded-3xl shadow-sm min-h-[600px] relative overflow-hidden group select-none flex items-center justify-center cursor-crosshair"
          onClick={() => { if (gameState === "PLAYING") playSound(200, "sawtooth", 0.1); }}
        >
          {gameState === "IDLE" && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500 z-10">
              <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                <Crosshair className="size-10 text-signal" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Aim Trainer</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Hit 30 targets as quickly as you can. Precision and speed are key.</p>
              </div>
              <button 
                onClick={startGame}
                className="h-14 px-10 rounded-2xl bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
              >
                Start Training
              </button>
            </div>
          )}

          {gameState === "PLAYING" && (
            <button
              onClick={handleTargetClick}
              className="absolute size-16 md:size-20 rounded-full bg-signal border-4 border-white dark:border-background shadow-[0_0_30px_hsl(var(--signal)/0.4)] flex items-center justify-center transition-all duration-75 active:scale-90 animate-in zoom-in duration-200"
              style={{
                left: `${targetPos.x}%`,
                top: `${targetPos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="size-2 bg-white rounded-full" />
            </button>
          )}

          {gameState === "RESULT" && (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 z-10">
              <div className="size-20 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto border border-purple-500/20">
                <Trophy className="size-10 text-purple-500" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Average Time per Target</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-9xl font-mono font-bold text-purple-500 tracking-tighter tabular-nums">{result}</span>
                  <span className="text-2xl font-bold text-purple-500/40 uppercase">ms</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                  onClick={startGame}
                  className="h-12 px-8 rounded-xl bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all w-full sm:w-auto"
                >
                  <RefreshCcw className="size-3 mr-2 inline" />
                  Try Again
                </button>
                <button 
                  onClick={handleCopy}
                  className="h-12 px-8 rounded-xl bg-secondary border border-border/40 font-bold uppercase tracking-widest text-[10px] hover:bg-secondary/80 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  {copied ? <CheckCircle2 className="size-3" /> : <Share2 className="size-3" />}
                  {copied ? "Copied" : "Share Score"}
                </button>
              </div>
            </div>
          )}

          {/* Grid Decorative Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        </div>

        {/* Stats Grid */}
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
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Trial {attempts.length - i}</span>
                  <span className="font-mono font-bold text-xs">{attempts[i] ? `${attempts[i]}ms` : "---"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Zap className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <Timer className="size-4 text-blue-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Benchmarking</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Gamer</span>
                <span className="font-mono text-sm font-bold">400ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Top Tier Pro</span>
                <span className="font-mono text-sm font-bold text-signal">250ms</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-4 italic">
                Aiming speed is crucial in FPS games like Valorant, CS:GO, and Apex Legends.
              </p>
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <MousePointer className="size-4 text-purple-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mouse Settings</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ensure you have "Mouse Acceleration" disabled in your OS for consistent muscle memory. A stable DPI setting between 400-800 is recommended for precision.
            </p>
          </div>
        </div>

      </div>
    </CalculatorPage>
  );
};

export default AimTrainer;
