"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Keyboard, Rocket, RefreshCcw, Trophy, History, BarChart3, 
  Zap, Info, Share2, CheckCircle2, Timer, 
  MousePointer2, Volume2, VolumeX, FileText, Activity
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { SITE_URL } from "@/lib/constants";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("typing-speed-test");

const PASSAGES = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. The future belongs to those who believe in the beauty of their dreams. In the middle of every difficulty lies opportunity.",
  "Design is not just what it looks like and feels like. Design is how it works. Innovation distinguishes between a leader and a follower. Your work is going to fill a large part of your life, so do great work.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you will know when you find it.",
  "The web is more a social creation than a technical one. I designed it for a social effect—to help people work together—and not as a technical toy. The primary design goal was to be a collaborative space.",
  "The most important thing in communication is hearing what isn't said. Efficiency is doing things right; effectiveness is doing the right things. Plans are nothing; planning is everything."
];

const TypingSpeedTest = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "RESULT">("IDLE");
  const [passage, setPassage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = useCallback((freq: number = 880, type: OscillatorType = "sine", duration: number = 0.05) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      osc.start();
      osc.stop(audioCtx.current.currentTime + duration);
    } catch (e) { console.warn(e); }
  }, [soundEnabled]);

  const initGame = () => {
    const randomPassage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
    setPassage(randomPassage);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setGameState("PLAYING");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (gameState !== "PLAYING") return;

    if (!startTime) {
      setStartTime(performance.now());
    }

    // Don't allow typing beyond passage length
    if (val.length > passage.length) return;

    setUserInput(val);
    playSound(400 + Math.random() * 200, "sine", 0.03);

    // Calculate accuracy up to current point
    let errors = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== passage[i]) errors++;
    }
    const acc = Math.round(((val.length - errors) / val.length) * 100) || 100;
    setAccuracy(acc);

    // Calculate WPM
    if (startTime) {
      const now = performance.now();
      const minutes = (now - startTime) / 60000;
      const words = val.length / 5; // Standard WPM definition: 5 chars = 1 word
      const currentWpm = Math.round(words / minutes);
      setWpm(currentWpm);
    }

    // End condition
    if (val === passage) {
      const now = performance.now();
      const finalMinutes = (now - startTime!) / 60000;
      const finalWpm = Math.round((passage.length / 5) / finalMinutes);
      setWpm(finalWpm);
      setGameState("RESULT");
      setAttempts(prev => [finalWpm, ...prev].slice(0, 5));
      if (finalWpm > bestWpm) setBestWpm(finalWpm);
      playSound(1200, "sine", 0.3);
    }
  };

  const characters = useMemo(() => {
    return passage.split("").map((char, i) => {
      let color = "text-muted-foreground/40";
      if (i < userInput.length) {
        color = userInput[i] === passage[i] ? "text-foreground" : "text-red-500 bg-red-500/10";
      } else if (i === userInput.length) {
        color = "text-signal border-b-2 border-signal animate-pulse";
      }
      return (
        <span key={i} className={cn("transition-colors duration-75", color)}>
          {char}
        </span>
      );
    });
  }, [passage, userInput]);

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Stats */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Words Per Minute</span>
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-signal" />
                <span className="text-3xl font-mono font-bold text-signal tabular-nums">{wpm}</span>
              </div>
            </div>
            <div className="h-10 w-px bg-border/40" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Accuracy</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-blue-500" />
                <span className="text-3xl font-mono font-bold text-blue-500 tabular-nums">{accuracy}%</span>
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
                <span className="text-2xl font-mono font-bold">{bestWpm || "--"} <span className="text-xs text-muted-foreground">WPM</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Card */}
        <div className="surface-card border-border/40 bg-secondary/5 rounded-3xl shadow-sm min-h-[600px] relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-16 text-center group transition-all duration-500">
          
          {gameState === "IDLE" && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 z-10">
              <div className="size-20 rounded-2xl bg-signal/10 flex items-center justify-center mx-auto border border-signal/20">
                <Keyboard className="size-10 text-signal" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Typing Speed Test</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Test your WPM (Words Per Minute) and accuracy. Type the passage as quickly and accurately as you can.</p>
              </div>
              <button 
                onClick={initGame}
                className="h-14 px-10 rounded-2xl bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
              >
                Start Typing Test
              </button>
            </div>
          )}

          {gameState === "PLAYING" && (
            <div className="space-y-12 w-full max-w-4xl relative z-10">
              <div className="text-2xl md:text-4xl font-medium leading-relaxed md:leading-[1.6] text-left select-none font-sans">
                {characters}
              </div>
              
              <textarea 
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                className="absolute inset-0 opacity-0 cursor-default"
                autoFocus
              />
              
              {!userInput.length && (
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 animate-pulse">
                  <MousePointer2 className="size-3" />
                  Start typing to begin
                </div>
              )}
            </div>
          )}

          {gameState === "RESULT" && (
            <div className="space-y-12 animate-in zoom-in-95 duration-500 w-full max-w-2xl z-10">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-signal">Final Speed</p>
                   <div className="flex items-baseline justify-center gap-2">
                      <h2 className="text-9xl font-mono font-bold tracking-tighter tabular-nums">{wpm}</h2>
                      <span className="text-2xl font-bold text-signal/40 uppercase">WPM</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Accuracy</p>
                   <div className="flex items-baseline justify-center gap-2">
                      <h2 className="text-9xl font-mono font-bold tracking-tighter tabular-nums">{accuracy}</h2>
                      <span className="text-2xl font-bold text-blue-500/40 uppercase">%</span>
                   </div>
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
                    const text = `My Typing Speed: ${wpm} WPM with ${accuracy}% accuracy!\nHow fast can you type? ${shareUrl}`;
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
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>
        </div>

        {/* Context Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <History className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-4 text-signal" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Sessions</h4>
            </div>
            <div className="space-y-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/10">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Trial {attempts.length - i}</span>
                  <span className="font-mono font-bold text-xs">{attempts[i] ? `${attempts[i]} WPM` : "---"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Timer className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-4 text-yellow-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Benchmarks</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Average Typist</span>
                <span className="font-mono text-sm font-bold">40 WPM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Professional</span>
                <span className="font-mono text-sm font-bold text-signal">75+ WPM</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-4 italic">
                The world record for typing speed is 216 WPM, achieved by Stella Pajunas in 1946.
              </p>
            </div>
          </div>

          <div className="surface-card p-6 border-border/40 bg-background rounded-2xl shadow-sm relative overflow-hidden group">
            <Info className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 transition-transform group-hover:scale-110 duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <FileText className="size-4 text-purple-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">About WPM</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Words Per Minute (WPM) is calculated by dividing the number of characters typed by 5, then dividing by the time taken in minutes. This standardizes "word" length.
            </p>
          </div>
        </div>

      </div>
    </CalculatorPage>
  );
};

export default TypingSpeedTest;
