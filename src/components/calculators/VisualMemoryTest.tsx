"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutGrid, Rocket, RefreshCcw, Trophy, History, BarChart3,
  Zap, Info, Share2, CheckCircle2, Heart,
  MousePointer2, Volume2, VolumeX, Grid3X3
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { SITE_URL } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("visual-memory-test")!;

const VisualMemoryTest = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [gameState, setGameState] = useState<"IDLE" | "SHOWING" | "INPUT" | "RESULT" | "GAME_OVER">("IDLE");
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3); // 3x3, 4x4, etc.
  const [pattern, setPattern] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [bestScore, setBestScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shaking, setShaking] = useState(false);

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

  const generateLevel = (l: number) => {
    // Determine grid size and target count
    // Level 1-2: 3x3 (3 squares)
    // Level 3-5: 4x4 (5 squares)
    // Level 6-9: 5x5 (7 squares)
    // Level 10+: 6x6 (9+ squares)
    let size = 3;
    let count = 3;

    if (l > 2) { size = 4; count = 3 + (l - 2); }
    if (l > 5) { size = 5; count = 6 + (l - 5); }
    if (l > 10) { size = 6; count = 11 + (l - 10); }

    const totalTiles = size * size;
    const newPattern: number[] = [];
    while (newPattern.length < count) {
      const r = Math.floor(Math.random() * totalTiles);
      if (!newPattern.includes(r)) newPattern.push(r);
    }

    setGridSize(size);
    setPattern(newPattern);
    setUserInput([]);
    setGameState("SHOWING");
    playSound(440 + l * 20, "sine", 0.1);

    setTimeout(() => {
      setGameState("INPUT");
    }, 2000);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== "INPUT" || userInput.includes(index)) return;

    if (pattern.includes(index)) {
      const newUserInput = [...userInput, index];
      setUserInput(newUserInput);
      playSound(880 + newUserInput.length * 40, "sine", 0.05);

      if (newUserInput.length === pattern.length) {
        // Round win
        setGameState("RESULT");
        playSound(1200, "sine", 0.2);
        setTimeout(() => {
          const nextL = level + 1;
          setLevel(nextL);
          generateLevel(nextL);
        }, 1000);
      }
    } else {
      // Wrong choice
      const newLives = lives - 1;
      setLives(newLives);
      setShaking(true);
      playSound(200, "sawtooth", 0.3);
      setTimeout(() => setShaking(false), 500);

      if (newLives <= 0) {
        setGameState("GAME_OVER");
        setAttempts(prev => [level, ...prev].slice(0, 5));
        if (level > bestScore) setBestScore(level);
      } else {
        // Re-show same level
        generateLevel(level);
      }
    }
  };

  const initGame = () => {
    setLevel(1);
    setLives(3);
    generateLevel(1);
    playSound(440, "sine", 0.1);
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Grid Progress</span>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-muted-foreground/60 mb-1 tracking-tighter">Level</span>
                  <span className="text-3xl font-mono font-bold text-signal tabular-nums">{level}</span>
                </div>
                <div className="h-8 w-px bg-border/40" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-muted-foreground/60 mb-1 tracking-tighter">Lives</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {[1, 2, 3].map((i) => (
                      <Heart
                        key={i}
                        className={cn(
                          "size-5 transition-all duration-300",
                          lives >= i ? "fill-red-500 text-red-500" : "fill-transparent text-muted-foreground/20"
                        )}
                      />
                    ))}
                  </div>
                </div>
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

          {/* Interaction Card */}
          <div className={cn(
            "surface-card border-border/40 bg-secondary/5 rounded-2xl shadow-sm min-h-[600px] relative overflow-hidden flex flex-col items-center justify-center p-8 text-center group transition-all duration-500",
            shaking && "animate-shake"
          )}>

            {gameState === "IDLE" && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 z-10">
                <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                  <LayoutGrid className="size-10 text-signal" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Visual Memory Test</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">Memorize the pattern of squares. The grid will grow in size as you level up.</p>
                </div>
                <button
                  onClick={initGame}
                  className="h-14 px-10 rounded-2xl bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
                >
                  Start Test
                </button>
              </div>
            )}

            {(gameState === "SHOWING" || gameState === "INPUT" || gameState === "RESULT") && (
              <div
                className="grid gap-2 w-full max-w-sm animate-in fade-in duration-500"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                  const isPattern = pattern.includes(i);
                  const isClicked = userInput.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleTileClick(i)}
                      className={cn(
                        "aspect-square rounded-lg border-2 transition-all duration-300",
                        gameState === "SHOWING" && isPattern && "bg-signal border-signal shadow-[0_0_20px_hsl(var(--signal)/0.4)] scale-105 z-10",
                        gameState === "SHOWING" && !isPattern && "bg-muted border-border/40",
                        gameState === "INPUT" && isClicked && "bg-signal border-signal",
                        gameState === "INPUT" && !isClicked && "bg-muted border-border/40 hover:bg-muted/80 active:scale-95",
                        gameState === "RESULT" && isPattern && "bg-signal border-signal scale-95",
                        gameState === "RESULT" && !isPattern && "bg-secondary/20 border-border/10 opacity-50"
                      )}
                    />
                  );
                })}
              </div>
            )}

            {gameState === "GAME_OVER" && (
              <div className="space-y-12 animate-in zoom-in-95 duration-500 w-full max-w-2xl z-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Benchmark Complete</p>
                  <h2 className="text-9xl font-mono font-bold tracking-tighter tabular-nums">{level}</h2>
                  <p className="text-muted-foreground uppercase tracking-widest font-bold text-xs">Level Reached</p>
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
                      const text = `I reached Level ${level} in the Visual Memory Test!\nTest your memory at: ${shareUrl}`;
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

            {/* Decorative Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>
          </div>

          {/* Context Grid */}
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
                    <span className="font-mono font-bold text-xs">{attempts[i] ? `Level ${attempts[i]}` : "---"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
              <Grid3X3 className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-2 mb-4">
                <Zap className="size-4 text-yellow-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Spatial Working Memory</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Recall</span>
                  <span className="font-mono text-sm font-bold">Level 9-11</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Top 10%</span>
                  <span className="font-mono text-sm font-bold text-signal">Level 14+</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-4 italic">
                  Spatial memory helps you remember the location of objects and the layout of environments.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
              <Info className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="size-4 text-purple-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The Game</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every level increases the complexity. You must remember not just which squares lit up, but their exact spatial configuration in a growing grid.
              </p>
            </div>
          </div>

          {/* How-To Section */}
          {calc.howTo && (
            <div className="pt-8 border-t border-border/40">
              <div className="mb-6 text-center sm:text-left">
                <h3 className="text-lg font-bold tracking-tight">Visual Memory Mastery</h3>
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

export default VisualMemoryTest;
