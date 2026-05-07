"use client";

import { useMemo, useState } from "react";
import {
  Share, CheckCircle2, History, Calculator, Binary, Sigma, FunctionSquare,
  Zap, Activity, Target, Landmark, History as HistoryIcon, Clock, Cpu,
  LayoutDashboard, Terminal, Settings2, RefreshCcw, Watch, TrendingUp,
  Ruler, Gauge, Copy, ChevronRight, Scale, Sparkles
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { SITE_DOMAIN } from "@/lib/constants";
import { HowToGuide } from "@/components/HowToGuide";

const calc = calculatorBySlug("scientific-calculator-online")!;

const ScientificCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [display, setDisplay] = useState("0");
  const [log, setLog] = useState<string[]>([]);
  const [lastOp, setLastOp] = useState(false);
  const [copied, setCopied] = useState(false);

  const append = (val: string) => {
    if (display === "0" || lastOp) {
      setDisplay(val);
      setLastOp(false);
    } else {
      setDisplay(display + val);
    }
  };

  const clear = () => {
    setDisplay("0");
    setLastOp(false);
  };

  const compute = () => {
    try {
      const clean = display.replace(/×/g, "*").replace(/÷/g, "/");
      const res = new Function(`return ${clean}`)();
      setLog([`${display} = ${res}`, ...log.slice(0, 9)]);
      setDisplay(res.toString());
      setLastOp(true);
    } catch (e) {
      setDisplay("Error");
      setLastOp(true);
    }
  };

  const scientific = (fnName: string, fn: (n: number) => number) => {
    try {
      const val = Number(display);
      const res = fn(val);
      setLog([`${fnName}(${val}) = ${res.toFixed(6)}`, ...log.slice(0, 9)]);
      setDisplay(res.toString());
      setLastOp(true);
    } catch (e) {
      setDisplay("Error");
    }
  };  const handleCopy = () => {
    let text = `Calculation Result: ${display}. Use this free scientific calculator at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CalcButton = ({ children, onClick, variant = "default", className }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "h-14 md:h-16 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center text-sm relative overflow-hidden group shadow-sm border border-border/40",
        variant === "default" && "bg-background text-muted-foreground hover:bg-secondary hover:text-foreground",
        variant === "num" && "bg-background text-foreground hover:bg-foreground hover:text-background text-lg md:text-xl",
        variant === "op" && "bg-secondary/10 text-foreground hover:bg-foreground hover:text-background text-xl",
        variant === "action" && "bg-foreground text-background hover:bg-foreground/90 text-2xl shadow-md",
        variant === "clear" && "bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 text-xs uppercase tracking-widest",
        variant === "fn" && "bg-secondary/20 text-muted-foreground hover:bg-foreground hover:text-background text-[10px] uppercase tracking-widest",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );

  if (!calc) return null;
  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Math Console */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Results Screen */}
          <div className="surface-card p-10 md:p-14 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />
            <Terminal className="absolute -top-12 -left-12 size-64 text-foreground/[0.03] -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
            
            <div className="relative z-10 space-y-4">
              <div className="h-6 text-[10px] font-mono font-bold text-emerald-500/80 text-right uppercase tracking-[0.4em] overflow-hidden">
                {log[0]?.split("=")[0] || "Ready to Calculate //"}
              </div>
              <div className="text-6xl md:text-8xl font-mono font-bold text-right tracking-tighter tabular-nums truncate text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {display}
              </div>

              <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-border/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400/80">
                    <Zap className="size-3" />
                    Operation Type
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {lastOp ? "Computed" : "Active"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400/80">
                    <HistoryIcon className="size-3" />
                    History Stack
                  </div>
                  <div className="text-2xl font-mono font-bold text-foreground tabular-nums">
                    {log.length} <span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">Entries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Keypad Matrix */}
          <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
            <button 
              onClick={clear}
              className="h-14 md:h-16 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center text-xs uppercase tracking-widest bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20"
            >
              Clear
            </button>
            <CalcButton variant="fn" onClick={() => scientific("sin", n => Math.sin(n))} className="text-amber-500 font-bold">sin</CalcButton>
            <CalcButton variant="fn" onClick={() => scientific("cos", n => Math.cos(n))} className="text-amber-500 font-bold">cos</CalcButton>
            <CalcButton variant="fn" onClick={() => scientific("tan", n => Math.tan(n))} className="text-amber-500 font-bold">tan</CalcButton>
            <CalcButton variant="op" onClick={() => append("/")} className="text-emerald-500 text-2xl">÷</CalcButton>
 
            <CalcButton variant="fn" onClick={() => scientific("log", n => Math.log10(n))} className="text-amber-500 font-bold">log</CalcButton>
            <CalcButton variant="num" onClick={() => append("7")}>7</CalcButton>
            <CalcButton variant="num" onClick={() => append("8")}>8</CalcButton>
            <CalcButton variant="num" onClick={() => append("9")}>9</CalcButton>
            <CalcButton variant="op" onClick={() => append("*")} className="text-emerald-500 text-2xl">×</CalcButton>
 
            <CalcButton variant="fn" onClick={() => scientific("ln", n => Math.log(n))} className="text-amber-500 font-bold">ln</CalcButton>
            <CalcButton variant="num" onClick={() => append("4")}>4</CalcButton>
            <CalcButton variant="num" onClick={() => append("5")}>5</CalcButton>
            <CalcButton variant="num" onClick={() => append("6")}>6</CalcButton>
            <CalcButton variant="op" onClick={() => append("-")} className="text-emerald-500 text-2xl">−</CalcButton>
 
            <CalcButton variant="fn" onClick={() => scientific("sqrt", n => Math.sqrt(n))} className="text-amber-500 font-bold">√</CalcButton>
            <CalcButton variant="num" onClick={() => append("1")}>1</CalcButton>
            <CalcButton variant="num" onClick={() => append("2")}>2</CalcButton>
            <CalcButton variant="num" onClick={() => append("3")}>3</CalcButton>
            <CalcButton variant="op" onClick={() => append("+")} className="text-emerald-500 text-2xl">+</CalcButton>
 
            <CalcButton variant="fn" onClick={() => scientific("π", n => Math.PI)} className="text-amber-500 font-bold">π</CalcButton>
            <CalcButton variant="num" onClick={() => append("0")}>0</CalcButton>
            <CalcButton variant="num" onClick={() => append(".")}>.</CalcButton>
            <CalcButton className="col-span-2 bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow-xl shadow-emerald-500/30" variant="action" onClick={compute}>=</CalcButton>
          </div>
 
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-emerald-500/20 space-y-4 bg-emerald-500/[0.02] relative overflow-hidden group shadow-sm">
              <Sigma className="absolute -bottom-4 -right-4 size-20 text-emerald-500/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Calculator className="size-4 text-emerald-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">Math Functions</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Support for advanced math like trigonometry and roots to help you solve complex problems.
              </p>
            </div>
            <div className="surface-card p-8 border-amber-500/20 space-y-4 bg-amber-500/[0.02] relative overflow-hidden group shadow-sm">
              <Cpu className="absolute -bottom-4 -right-4 size-20 text-amber-500/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Zap className="size-4 text-amber-500" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80">Instant Results</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Get fast and accurate answers with the correct mathematical order of operations handled automatically.
              </p>
            </div>
          </div>
        </div>
 
        {/* History Log */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-sm space-y-8 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <History className="size-4 text-muted-foreground/60" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Recent Calculations</h3>
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "p-2 rounded-lg transition-all border shadow-sm",
                  copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                )}
              >
                {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
              </button>
            </div>
 
            <div className="space-y-3 relative z-10">
              {log.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/10 gap-6">
                  <RefreshCcw className="size-16 animate-spin-slow stroke-[1]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No History Yet</p>
                </div>
              ) : (
                log.map((item, i) => (
                  <div key={i} className="font-mono text-[11px] p-5 bg-secondary/5 rounded-2xl border border-border/30 text-muted-foreground group/log hover:border-foreground/20 transition-all flex justify-between items-center">
                    <span className="opacity-60">{item.split('=')[0]}</span>
                    <span className="font-bold text-foreground">{item.split('=')[1]}</span>
                  </div>
                ))
              )}
            </div>
 
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
              <FunctionSquare className="size-32" />
            </div>
          </div>
 
          <div className="surface-card p-8 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Target className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Accuracy Check</h4>
                <p className="text-xs leading-relaxed font-medium">
                  This calculator uses high-precision math to ensure your results are as accurate as possible for all calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {calc.howTo && (
        <div className="mt-12 pt-12 border-t border-border/40">
          <HowToGuide
            id="how-to-use"
            steps={calc.howTo!.steps}
            proTip={calc.howTo!.proTip}
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
  );
};

export default ScientificCalculator;
