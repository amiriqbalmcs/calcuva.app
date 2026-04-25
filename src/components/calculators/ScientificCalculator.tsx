"use client";

import { useMemo, useState } from "react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { SeoBlock } from "@/components/SeoBlock";
import { calculatorBySlug } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("scientific-calculator-online")!;

const ScientificCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [lastOp, setLastOp] = useState(false);

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
      // Use Function instead of eval for safer execution of basic math
      const clean = display.replace(/×/g, "*").replace(/÷/g, "/");
      const res = new Function(`return ${clean}`)();
      setHistory([`${display} = ${res}`, ...history.slice(0, 4)]);
      setDisplay(res.toString());
      setLastOp(true);
    } catch (e) {
      setDisplay("Error");
      setLastOp(true);
    }
  };

  const scientific = (fn: (n: number) => number) => {
    try {
      const res = fn(Number(display));
      setHistory([`fn(${display}) = ${res.toFixed(6)}`, ...history.slice(0, 4)]);
      setDisplay(res.toString());
      setLastOp(true);
    } catch (e) {
      setDisplay("Error");
    }
  };

  const Button = ({ children, onClick, variant = "default", className }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "h-12 sm:h-14 rounded-lg font-medium text-sm transition-all active:scale-95",
        variant === "default" && "bg-secondary hover:bg-secondary/80 text-foreground",
        variant === "op" && "bg-business/10 hover:bg-business/20 text-business font-bold text-base",
        variant === "action" && "bg-signal text-white hover:bg-signal/90 font-bold",
        variant === "clear" && "bg-destructive/10 hover:bg-destructive/20 text-destructive",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={
        <SeoBlock
          title="Advanced Computing: Modern Scientific Calculator"
          intro="From engineering to physics, high-precision math is the foundation of modernity. A scientific calculator provides access to complex functions like trigonometry and logarithms that a standard calculator cannot handle."
          sections={[
            {
              heading: "Defining the Functions",
              icon: "book",
              body: <p><strong>Trigonometry:</strong> Sin, Cos, and Tan calculate ratios within triangles. <strong>Logarithms:</strong> Help solve for exponents and are used in sound (decibels) and earthquakes (Richter scale). <strong>Power Functions:</strong> Essential for calculating compound growth and geometric scaling.</p>,
            },
          ]}
          faqs={[
            { q: "Degrees or Radians?", a: "By default, this calculator uses Radians for standard trigonometric functions. Degrees are typically used in navigation and surveying, while Radians are used in higher calculus." },
            { q: "Is the precision absolute?", a: "We use standard floating-point arithmetic (IEEE 754) which provides high precision (up to 15-17 significant digits), sufficient for all engineering and academic tasks." },
          ]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="surface-card p-6 bg-primary text-primary-foreground">
            <div className="h-6 text-xs font-mono opacity-50 text-right overflow-hidden">
              {history[0]?.split("=")[0]}
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-medium text-right tracking-tighter truncate mt-2">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            <Button variant="clear" onClick={clear}>AC</Button>
            <Button onClick={() => scientific(n => Math.sin(n))}>sin</Button>
            <Button onClick={() => scientific(n => Math.cos(n))}>cos</Button>
            <Button onClick={() => scientific(n => Math.tan(n))}>tan</Button>
            <Button variant="op" onClick={() => append("/")}>÷</Button>

            <Button onClick={() => scientific(n => Math.log10(n))}>log</Button>
            <Button onClick={() => append("7")}>7</Button>
            <Button onClick={() => append("8")}>8</Button>
            <Button onClick={() => append("9")}>9</Button>
            <Button variant="op" onClick={() => append("*")}>×</Button>

            <Button onClick={() => scientific(n => Math.log(n))}>ln</Button>
            <Button onClick={() => append("4")}>4</Button>
            <Button onClick={() => append("5")}>5</Button>
            <Button onClick={() => append("6")}>6</Button>
            <Button variant="op" onClick={() => append("-")}>−</Button>

            <Button onClick={() => scientific(n => Math.sqrt(n))}>√</Button>
            <Button onClick={() => append("1")}>1</Button>
            <Button onClick={() => append("2")}>2</Button>
            <Button onClick={() => append("3")}>3</Button>
            <Button variant="op" onClick={() => append("+")}>+</Button>

            <Button onClick={() => scientific(n => Math.PI)}>π</Button>
            <Button onClick={() => append("0")}>0</Button>
            <Button onClick={() => append(".")}>.</Button>
            <Button className="sm:col-span-2" variant="action" onClick={compute}>=</Button>
          </div>
        </div>

        <div className="lg:col-span-1 surface-card p-6">
          <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">Calculation Log</h3>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No recent history.</p>
            ) : (
              history.map((item, i) => (
                <div key={i} className="font-mono text-xs p-2 py-3 bg-secondary/50 rounded-lg border border-border/50 text-muted-foreground">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default ScientificCalculator;
