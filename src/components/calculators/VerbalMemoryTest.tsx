"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  BookOpen, Rocket, RefreshCcw, Trophy, History, BarChart3,
  Zap, Info, Share2, CheckCircle2, Heart,
  MousePointer2, Volume2, VolumeX, Layers
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { HowToGuide } from "@/components/HowToGuide";
import { Label } from "@/components/ui/label";
import { SITE_URL } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("verbal-memory-test")!;

const WORD_LIST = [
  "apple", "river", "mountain", "clock", "silver", "garden", "bridge", "forest", "window", "ocean",
  "bottle", "candle", "planet", "guitar", "castle", "desert", "dragon", "energy", "flavor", "galaxy",
  "harvest", "island", "jacket", "kettle", "lantern", "magnet", "nebula", "orange", "packet", "quaint",
  "rabbit", "shadow", "tunnel", "update", "valley", "wisdom", "xenon", "yellow", "zenith", "anchor",
  "beacon", "circle", "danger", "eagle", "fable", "glider", "hammer", "image", "joker", "knight",
  "lemon", "mirror", "nature", "outlet", "pillow", "quartz", "radar", "shaker", "tiger", "unique",
  "vessel", "worker", "yarn", "zebra", "active", "bright", "clever", "direct", "exotic", "formal",
  "gentle", "honest", "inner", "jolly", "kindly", "loyal", "mighty", "noble", "openly", "polite",
  "quiet", "robust", "steady", "tough", "useful", "vital", "warmth", "young", "zeal", "artist",
  "beauty", "custom", "device", "effort", "future", "growth", "health", "input", "journey", "knowledge"
];

const VerbalMemoryTest = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAME_OVER">("IDLE");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentWord, setCurrentWord] = useState("");
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<string[]>([]);
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

  const nextWord = useCallback(() => {
    // 50/50 chance of showing a seen word if any exist
    const shouldShowSeen = seenWords.size > 0 && Math.random() < 0.4;

    if (shouldShowSeen) {
      const wordsArray = Array.from(seenWords);
      const randomSeen = wordsArray[Math.floor(Math.random() * wordsArray.length)];
      setCurrentWord(randomSeen);
    } else {
      // Find a word not yet seen
      const availableWords = WORD_LIST.filter(w => !seenWords.has(w));
      if (availableWords.length === 0) {
        // Fallback or game complete? For now, just reset seen words or end
        setGameState("GAME_OVER");
        return;
      }
      const randomNew = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentWord(randomNew);
    }
  }, [seenWords]);

  const handleChoice = (choice: "SEEN" | "NEW") => {
    const isSeen = seenWords.has(currentWord);
    const correct = (choice === "SEEN" && isSeen) || (choice === "NEW" && !isSeen);

    if (correct) {
      setScore(prev => prev + 1);
      playSound(880 + score * 5, "sine", 0.05);
      if (choice === "NEW") {
        setSeenWords(prev => new Set(prev).add(currentWord));
      }
      nextWord();
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setShaking(true);
      playSound(200, "sawtooth", 0.2);
      setTimeout(() => setShaking(false), 500);

      if (newLives <= 0) {
        setGameState("GAME_OVER");
        setAttempts(prev => [score, ...prev].slice(0, 5));
        if (score > bestScore) setBestScore(score);
        playSound(150, "sawtooth", 0.5);
      } else {
        nextWord();
      }
    }
  };

  const initGame = () => {
    setScore(0);
    setLives(3);
    setSeenWords(new Set());
    setGameState("PLAYING");
    // Generate first word (must be new)
    const randomNew = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setCurrentWord(randomNew);
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Session Progress</span>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-muted-foreground/60 mb-1 tracking-tighter">Score</span>
                  <span className="text-3xl font-mono font-bold text-signal tabular-nums">{score}</span>
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Personal Best</span>
                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-yellow-500" />
                  <span className="text-2xl font-mono font-bold">{bestScore || "--"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Card */}
          <div className={cn(
            "surface-card border-border/40 bg-secondary/5 rounded-3xl shadow-sm min-h-[600px] relative overflow-hidden flex flex-col items-center justify-center p-8 text-center group transition-all duration-500",
            shaking && "animate-shake"
          )}>

            {gameState === "IDLE" && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                  <BookOpen className="size-10 text-signal" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Verbal Memory Test</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">You will be shown words one by one. If you've seen a word before in this session, click SEEN. If it's a new word, click NEW.</p>
                </div>
                <button
                  onClick={initGame}
                  className="h-14 px-10 rounded-2xl bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
                >
                  Start Test
                </button>
              </div>
            )}

            {gameState === "PLAYING" && (
              <div className="space-y-16 animate-in fade-in duration-300 w-full max-w-xl">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Is this a new word?</p>
                  <h2 className="text-7xl md:text-8xl font-bold tracking-tight capitalize py-8">{currentWord}</h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button
                    onClick={() => handleChoice("SEEN")}
                    className="h-20 px-12 rounded-3xl bg-secondary border-2 border-border/40 font-black uppercase tracking-widest text-lg hover:bg-secondary/80 hover:border-signal/40 transition-all w-full sm:w-64 active:scale-95"
                  >
                    Seen
                  </button>
                  <button
                    onClick={() => handleChoice("NEW")}
                    className="h-20 px-12 rounded-3xl bg-signal text-white font-black uppercase tracking-widest text-lg hover:scale-105 transition-all shadow-xl shadow-signal/20 w-full sm:w-64 active:scale-95"
                  >
                    New
                  </button>
                </div>
              </div>
            )}

            {gameState === "GAME_OVER" && (
              <div className="space-y-12 animate-in zoom-in-95 duration-500 w-full max-w-2xl">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Benchmark Complete</p>
                  <h2 className="text-9xl font-mono font-bold tracking-tighter tabular-nums">{score}</h2>
                  <p className="text-muted-foreground uppercase tracking-widest font-bold text-xs">Words Remembered</p>
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
                      const text = `I remembered ${score} words in the Verbal Memory Test!\nSee how many words you can remember: ${shareUrl}`;
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
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]" />
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
                    <span className="font-mono font-bold text-xs">{attempts[i] ? `${attempts[i]} Words` : "---"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
              <Layers className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-2 mb-4">
                <Zap className="size-4 text-yellow-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The Average Human</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Word Span</span>
                  <span className="font-mono text-sm font-bold">40 Words</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Exceptional Memory</span>
                  <span className="font-mono text-sm font-bold text-signal">80+ Words</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-4 italic">
                  Verbal memory tests your ability to encode and retrieve linguistic information over time.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
              <Info className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="size-4 text-purple-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">How it Works</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This test measures your brain's ability to distinguish between "seen" stimuli and "novel" stimuli. As the number of seen words increases, your working memory must work harder to keep track of the growing list.
              </p>
            </div>
          </div>

          {/* How-To Section */}
          {calc.howTo && (
            <div className="pt-8 border-t border-border/40">
              <div className="mb-6 text-center sm:text-left">
                <h3 className="text-lg font-bold tracking-tight">Verbal Memory Strategies</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">Memory Training Guide</p>
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

export default VerbalMemoryTest;
