"use client";

import { useMemo, useState } from "react";
import {
  GraduationCap, TrendingUp, Info, BookOpen, Target,
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Landmark, Copy, FileText, Award, AlertCircle, Percent, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { UNIVERSITY_SCALES } from "@/lib/data/HistoricalData";
import { cn } from "@/lib/utils";
import { HowToGuide } from "../HowToGuide";

const calc = calculatorBySlug("hec-cgpa-converter")!;

const HecCgpaCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [gpa, setGpa] = useState<number>(3.5);
  const [scale, setScale] = useState<string>("hec");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const formula = UNIVERSITY_SCALES[scale]?.formula || UNIVERSITY_SCALES.hec.formula;
    const percentage = Math.min(100, Math.max(0, formula(gpa)));

    let grade = "F";
    if (percentage >= 85) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 75) grade = "B+";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 65) grade = "C+";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    return { percentage, grade };
  }, [gpa, scale]);

  const handleCopy = () => {
    const text = `HEC CGPA Conversion: ${gpa.toFixed(2)} GPA on 4.0 scale is equivalent to ${result.percentage.toFixed(1)}% | Grade: ${result.grade}. Convert at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!calc) return null;

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="w-full max-w-7xl mx-auto space-y-12 sm:px-6 lg:px-8">

        {/* Main Interface: Side-by-Side Results & Inputs */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: University Selection & Input */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
              <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
                <div className="flex items-center gap-3 relative z-10">
                  <Scale className="size-5 text-muted-foreground/60" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold tracking-tight">University Selection</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Select your institution scale</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Academic Institution</Label>
                  <Select value={scale} onValueChange={setScale}>
                    <SelectTrigger className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60">
                      {Object.entries(UNIVERSITY_SCALES).map(([key, val]) => (
                        <SelectItem key={key} value={key} className="py-3 rounded-lg font-medium">{val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cumulative GPA (4.0 Scale)</Label>
                    <span className="text-xs font-mono font-bold text-foreground bg-secondary/20 px-2 py-0.5 rounded">{gpa.toFixed(2)}</span>
                  </div>
                  <div className="relative pt-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={gpa}
                      onChange={(e) => setGpa(Math.min(4, Math.max(0, Number(e.target.value) || 0)))}
                      className="h-14 bg-background border-border/60 font-mono text-2xl font-bold rounded-xl shadow-sm pl-6"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                      <Calculator className="size-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card p-6 border-border/30 bg-foreground/5 relative overflow-hidden group shadow-sm">
              <Sparkles className="absolute -bottom-4 -right-4 size-24 text-foreground/5 group-hover:rotate-12 transition-transform duration-700" />
              <div className="flex gap-4 items-start relative z-10">
                <div className="mt-1 text-foreground/60"><Info className="size-5" /></div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">HEC Guidelines</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    The HEC standard formula for percentage conversion is <span className="font-mono font-bold text-foreground">(GPA / 4.0) x 100</span>. Some universities like NUST use a custom curve for higher GPA bands.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Conversion Results */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden group sticky top-32">
              <div className="space-y-10 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <Percent className="size-3" /> Equivalent Percentage
                    </div>
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "p-3 rounded-xl transition-all border shadow-sm",
                        copied ? "bg-foreground text-background border-foreground shadow-lg" : "bg-background text-foreground border-border hover:bg-secondary"
                      )}
                    >
                      {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                    </button>
                  </div>
                  <div className="text-8xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                    {result.percentage.toFixed(1)}<span className="text-2xl ml-1 opacity-20">%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border/40">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Letter Grade</div>
                    <div className="text-4xl font-bold tracking-tight text-foreground">{result.grade}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Class Standing</div>
                    <div className="text-base font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                      {result.percentage >= 80 ? "First Class" : result.percentage >= 60 ? "Second Class" : "Pass"}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-foreground/5 border border-border/30 space-y-3">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <Award className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Academic Status</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {result.percentage >= 85
                      ? "Exceptional performance! This score qualifies you for high-tier international admissions."
                      : result.percentage >= 70
                        ? "Good standing. You maintain a solid academic record suitable for professional roles."
                        : "Maintain focus to improve your standing for competitive scholarship opportunities."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {calc.howTo && (
        <div id="how-to-use" className="mt-12 pt-12 border-t border-border/40">
          <HowToGuide 
            steps={calc.howTo!.steps} 
            proTip={calc.howTo!.proTip} 
            variant="horizontal"
          />
        </div>
      )}
    </CalculatorPage>
  );
};

export default HecCgpaCalculator;
