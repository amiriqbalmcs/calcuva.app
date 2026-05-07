"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Brain, Trophy, Play, RotateCcw, Timer, History,
  Share2, CheckCircle2, AlertCircle, Info, Zap,
  Volume2, VolumeX, TrendingUp, BarChart3, Target, MousePointer2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { SITE_URL } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("sequence-memory-test")!;

const GRID_SIZE = 9; // 3x3

const SequenceMemoryTest = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [level, setLevel] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<"IDLE" | "SHOWING" | "INPUT" | "GAME_OVER">("IDLE");
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  const startLevel = useCallback((newSequence: number[]) => {
    setSequence(newSequence);
    setUserSequence([]);
    setGameState("SHOWING");

    let i = 0;
    const showNext = () => {
      if (i < newSequence.length) {
        const tileIndex = newSequence[i];
        setActiveTile(tileIndex);
        playSound(440 + tileIndex * 110, "sine", 0.2); // Unique pitch per tile
        setTimeout(() => {
          setActiveTile(null);
          i++;
          timerRef.current = setTimeout(showNext, 250);
        }, 500);
      } else {
        setGameState("INPUT");
      }
    };

    timerRef.current = setTimeout(showNext, 500);
  }, [playSound]);

  const initGame = () => {
    const firstTile = Math.floor(Math.random() * GRID_SIZE);
    setLevel(1);
    startLevel([firstTile]);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== "INPUT") return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);
    playSound(440 + index * 110, "sine", 0.1);

    // Check if correct
    if (index !== sequence[userSequence.length]) {
      setGameState("GAME_OVER");
      setShaking(true);
      playSound(200, "sawtooth", 0.4); // Game over sound
      setTimeout(() => setShaking(false), 500);
      if (level - 1 > bestScore) setBestScore(level - 1);
      return;
    }

    // Check if level complete
    if (newUserSequence.length === sequence.length) {
      setGameState("SHOWING"); // Pause before next level
      playSound(880, "sine", 0.1); // Round complete sound
      const nextSequence = [...sequence, Math.floor(Math.random() * GRID_SIZE)];
      setTimeout(() => {
        setLevel(prev => prev + 1);
        startLevel(nextSequence);
      }, 800);
    }
  };

  const handleCopy = () => {
    const shareUrl = `${SITE_URL}/calculators/${calc.slug}`;
    const text = `I reached Level ${level} in Sequence Memory!\nCan you beat me? ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">

        {/* Main Panel (Game & Results) */}
        <div className="space-y-8">

          {/* Header Stats */}
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Level</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-signal">{level || "--"}</span>
                <span className="text-xs font-bold text-muted-foreground/40 uppercase">Score</span>
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Personal Best</span>
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-yellow-500" />
                  <span className="text-2xl font-mono font-bold">{bestScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Interaction Area */}
          <div className={cn(
            "surface-card p-8 md:p-12 border-border/40 bg-secondary/5 rounded-3xl shadow-sm flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden",
            shaking && "animate-shake"
          )}>

            {gameState === "IDLE" && (
              <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                  <Brain className="size-10 text-signal" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Sequence Memory Test</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">Remember the pattern of tiles that light up and repeat them in order.</p>
                </div>
                <button
                  onClick={initGame}
                  className="group relative h-14 px-10 rounded-2xl bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
                >
                  Start Test
                </button>
              </div>
            )}

            {(gameState === "SHOWING" || gameState === "INPUT") && (
              <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-xs animate-in fade-in duration-500">
                {Array.from({ length: GRID_SIZE }).map((_, i) => (
                  <button
                    key={i}
                    disabled={gameState !== "INPUT"}
                    onClick={() => handleTileClick(i)}
                    className={cn(
                      "aspect-square rounded-xl border-2 transition-all duration-200",
                      gameState === "INPUT" ? "hover:border-signal/50 hover:bg-signal/10 active:scale-95" : "cursor-default",
                      activeTile === i
                        ? "bg-signal border-signal shadow-[0_0_30px_hsl(var(--signal)/0.4)] scale-105 z-10"
                        : "bg-muted border-border/40"
                    )}
                  />
                ))}
              </div>
            )}

            {gameState === "GAME_OVER" && (
              <div className="text-center space-y-8 animate-in zoom-in-95 duration-300">
                <div className="size-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
                  <AlertCircle className="size-10 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Game Over!</h2>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-mono font-bold text-foreground">{level}</span>
                    <span className="text-lg font-bold text-muted-foreground uppercase">Level Reached</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={initGame}
                    className="h-12 px-8 rounded-xl bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                  >
                    <RotateCcw className="size-3 mr-2 inline" />
                    Try Again
                  </button>
                  <button
                    onClick={handleCopy}
                    className="h-12 px-8 rounded-xl bg-secondary border border-border/40 font-bold uppercase tracking-widest text-[10px] hover:bg-secondary/80 transition-all flex items-center gap-2"
                  >
                    {copied ? <CheckCircle2 className="size-3" /> : <Share2 className="size-3" />}
                    {copied ? "Copied" : "Share Score"}
                  </button>
                </div>
              </div>
            )}

            {/* Game Overlays */}
            {gameState === "SHOWING" && (
              <div className="absolute top-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-signal animate-pulse">
                <Zap className="size-3" />
                Watch Closely
              </div>
            )}
            {gameState === "INPUT" && (
              <div className="absolute top-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 animate-bounce">
                <MousePointer2 className="size-3" />
                Your Turn
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
              <TrendingUp className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-2 mb-4">
                <Target className="size-4 text-signal" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The Goal</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sequence memory measures your brain's ability to retain visual information in a specific temporal order. Average humans can reach level 7-9.
              </p>
            </div>

            <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
              <Zap className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-2 mb-4">
                <Info className="size-4 text-blue-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pro Tip</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Don't just watch the squares—try to mentally draw the "path" or assign a number to each tile to convert visual memory into numerical memory.
              </p>
            </div>

            <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
              <History className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="size-4 text-purple-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Statistics</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Level</span>
                  <span className="font-mono text-sm font-bold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Top 1%</span>
                  <span className="font-mono text-sm font-bold text-signal">24+</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-signal w-1/3" />
                </div>
              </div>
            </div>
          </div>

          {/* How-To Section */}
          {calc.howTo && (
            <div className="pt-8 border-t border-border/40">
              <div className="mb-6 text-center sm:text-left">
                <h3 className="text-lg font-bold tracking-tight">How to Master Sequence Memory</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">Step-by-Step Training</p>
              </div>
              <HowToGuide
                id="how-to-use"
                steps={calc.howTo!.steps}
                proTip={calc.howTo!.proTip}
                variant="horizontal"
              />
            </div>
          )}
        </div>
      </div>
    </CalculatorPage>
  );
};

export default SequenceMemoryTest;
