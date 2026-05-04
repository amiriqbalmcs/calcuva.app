"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Hash, Rocket, RefreshCcw, Trophy, History, BarChart3, 
  Zap, Info, Share2, CheckCircle2, Timer, Brain, 
  MousePointer2, Volume2, VolumeX, Keyboard
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { SITE_URL } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("number-memory-test");

const NumberMemoryTest = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [gameState, setGameState] = useState<"IDLE" | "SHOWING" | "INPUT" | "RESULT" | "GAME_OVER">("IDLE");
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [bestScore, setBestScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const generateNumber = (digits: number) => {
    let num = "";
    for (let i = 0; i < digits; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }
    return num;
  };

  const startLevel = (l: number) => {
    const num = generateNumber(l);
    setCurrentNumber(num);
    setUserInput("");
    setGameState("SHOWING");
    
    const displayTime = Math.max(2000, l * 1000); // 1 sec per digit, min 2s
    setTimeLeft(displayTime);
    
    playSound(440 + l * 50, "sine", 0.1);

    if (timerRef.current) clearInterval(timerRef.current);
    const step = 100;
    let remaining = displayTime;
    
    timerRef.current = setInterval(() => {
      remaining -= step;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setGameState("INPUT");
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, step);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput === currentNumber) {
      setGameState("RESULT");
      playSound(880, "sine", 0.1);
    } else {
      setGameState("GAME_OVER");
      playSound(200, "sawtooth", 0.4);
      setAttempts(prev => [level, ...prev].slice(0, 5));
      if (level > bestScore) setBestScore(level);
    }
  };

  const nextLevel = () => {
    const nextL = level + 1;
    setLevel(nextL);
    startLevel(nextL);
  };

  const initGame = () => {
    setLevel(1);
    startLevel(1);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Stats */}
        <div className="flex items-center justify-between px-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Level</span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-mono font-bold text-signal">Level {level}</span>
              <div className="h-4 w-px bg-border/40" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{level} Digits</span>
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">High Score</span>
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-yellow-500" />
                <span className="text-2xl font-mono font-bold">{bestScore || "--"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interaction Card */}
        <div className="surface-card border-border/40 bg-secondary/5 rounded-3xl shadow-sm min-h-[600px] relative overflow-hidden flex flex-col items-center justify-center p-8 text-center group transition-all duration-500">
          
          {gameState === "IDLE" && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                <Hash className="size-10 text-signal" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Number Memory</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Remember the longest number possible. The sequence grows by one digit each round.</p>
              </div>
              <button 
                onClick={initGame}
                className="h-14 px-10 rounded-2xl bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
              >
                Start Test
              </button>
            </div>
          )}

          {gameState === "SHOWING" && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Memorize this number</p>
                <h2 className="text-7xl md:text-9xl font-mono font-bold tracking-tighter tabular-nums break-all max-w-4xl mx-auto">{currentNumber}</h2>
              </div>
              <div className="w-full max-w-md mx-auto h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-signal transition-all duration-100 linear"
                  style={{ width: `${(timeLeft / (level * 1000 || 2000)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {gameState === "INPUT" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300 w-full max-w-md">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">What was the number?</p>
                <h3 className="text-sm font-bold text-muted-foreground">Press Enter to Submit</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input 
                  ref={inputRef}
                  type="text" 
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full bg-transparent border-b-4 border-signal/30 focus:border-signal outline-none text-6xl md:text-8xl font-mono font-bold text-center tracking-widest transition-all tabular-nums py-4"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="h-14 px-12 rounded-2xl bg-signal text-white font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-lg shadow-signal/20"
                >
                  Submit Result
                </button>
              </form>
            </div>
          )}

          {gameState === "RESULT" && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                <CheckCircle2 className="size-10 text-signal" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Level {level} Complete!</p>
                <h2 className="text-4xl font-bold tracking-tight">Perfect Memory</h2>
              </div>
              <button 
                onClick={nextLevel}
                className="h-14 px-12 rounded-2xl bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
              >
                Next Round
              </button>
            </div>
          )}

          {gameState === "GAME_OVER" && (
            <div className="space-y-12 animate-in zoom-in-95 duration-500 w-full max-w-2xl">
              <div className="space-y-4">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Benchmark Complete</p>
                 <h2 className="text-8xl font-mono font-bold tracking-tighter tabular-nums">{level}</h2>
                 <p className="text-muted-foreground uppercase tracking-widest font-bold text-xs">Digits Remembered</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 border-y border-border/10 py-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Correct Number</p>
                    <p className="text-2xl font-mono font-bold text-muted-foreground/40 line-through">{currentNumber}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Answer</p>
                    <p className="text-2xl font-mono font-bold text-red-500">{userInput}</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={initGame}
                  className="h-12 px-8 rounded-xl bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all w-full sm:w-auto"
                >
                  <RefreshCcw className="size-3 mr-2 inline" />
                  Try Again
                </button>
                <button 
                  onClick={() => {
                    const shareUrl = `${SITE_URL}/calculators/${calc.slug}`;
                    const text = `I remembered a ${level} digit number in the Number Memory Test!\nTry it yourself: ${shareUrl}`;
                    navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="h-12 px-8 rounded-xl bg-secondary border border-border/40 font-bold uppercase tracking-widest text-[10px] hover:bg-secondary/80 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  {copied ? <CheckCircle2 className="size-3" /> : <Share2 className="size-3" />}
                  {copied ? "Copied" : "Share Score"}
                </button>
              </div>
            </div>
          )}

          {/* Decorative Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>
        </div>

        {/* Context Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <History className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-4 text-signal" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Previous Sessions</h4>
            </div>
            <div className="space-y-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/10">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Trial {attempts.length - i}</span>
                  <span className="font-mono font-bold text-xs">{attempts[i] ? `${attempts[i]} Digits` : "---"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Brain className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-4 text-yellow-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The Average Human</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Digit Span</span>
                <span className="font-mono text-sm font-bold">7 Digits</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Superior Recall</span>
                <span className="font-mono text-sm font-bold text-signal">12+ Digits</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-4 italic">
                Chunking (grouping digits) is a powerful technique to expand your short-term memory capacity.
              </p>
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="size-4 text-blue-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Memory Strategy</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most people can recall 7 numbers. To beat this, try "chunking"—grouping numbers into sets of 3 or 4, like a phone number. It reduces the "load" on your brain.
            </p>
          </div>
        </div>

      </div>
    </CalculatorPage>
  );
};

export default NumberMemoryTest;
