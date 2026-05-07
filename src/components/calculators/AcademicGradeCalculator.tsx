"use client";

import { useMemo, useState } from "react";
import {
  Plus, Trash2, Share, CheckCircle2, GraduationCap, Info, BookOpen,
  Target, TrendingUp, History, Percent, LayoutDashboard,
  Settings2, ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Landmark, Copy, FileText, Award, AlertCircle, Star, Share2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HowToGuide } from "@/components/HowToGuide";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("academic-grade-calculator")!;

interface Assignment {
  id: string;
  name: string;
  weight: number;
  score: number;
}

const newAssignment = (n = 1): Assignment => ({
  id: `a-${n}-${Date.now()}`,
  name: `Assignment ${n}`,
  weight: 20,
  score: 85
});

const AcademicGradeCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "a-1", name: "Homework & Quizzes", weight: 30, score: 90 },
    { id: "a-2", name: "Midterm Exam", weight: 30, score: 82 }
  ]);
  const [targetGrade, setTargetGrade] = useUrlState<number>("target", 90);
  const [finalWeight, setFinalWeight] = useUrlState<number>("fw", 40);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const currentWeight = assignments.reduce((s, a) => s + (a.weight || 0), 0);
    const weightedPoints = assignments.reduce((s, a) => s + ((a.score || 0) * (a.weight || 0)), 0);

    const currentGrade = currentWeight > 0 ? weightedPoints / currentWeight : 0;

    // Final Exam Logic
    const totalCourseWeight = currentWeight + finalWeight;
    const currentContribution = weightedPoints / 100;
    const requiredFinal = finalWeight > 0
      ? (targetGrade - currentContribution) / (finalWeight / 100)
      : 0;

    let insight = "";
    if (currentGrade >= 90) insight = "Excellent! You are maintaining an A. Keep it up for the final!";
    else if (currentGrade >= 80) insight = "Great work! You are in the B range. A strong final could push you to an A.";
    else if (currentGrade >= 70) insight = "Steady Progress. You are passing comfortably. Focus on the final to boost your score.";
    else insight = "Focus Required. Your current average is below 70%. You'll need a strong final performance.";

    return { currentGrade, currentWeight, requiredFinal, insight };
  }, [assignments, targetGrade, finalWeight]);

  const update = (id: string, patch: Partial<Assignment>) => setAssignments((as) => as.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const remove = (id: string) => setAssignments((as) => as.filter((a) => a.id !== id));

  const handleCopy = () => {
    let text = `Current Grade: ${result.currentGrade.toFixed(1)}%. I need ${result.requiredFinal.toFixed(1)}% on my final to get a ${targetGrade}%. Calculate yours at ${window.location.href}`;
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

          {/* Left Column: Grade Components */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
            <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
              <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
                <div className="flex items-center gap-3 relative z-10">
                  <FileText className="size-5 text-muted-foreground/60" />
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold tracking-tight">Grade Components</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Add Your Homework, Tests & Quizzes</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignments((as) => [...as, newAssignment(as.length + 1)])}
                  className="h-9 px-4 text-[10px] font-bold tracking-widest border-border/60 hover:bg-foreground hover:text-background transition-all rounded-xl"
                >
                  <Plus className="size-3 mr-2" /> ADD COMPONENT
                </Button>
              </div>

              <div className="divide-y divide-border/30">
                {assignments.map((a) => (
                  <div key={a.id} className="p-6 grid grid-cols-12 gap-6 items-end group/row hover:bg-background transition-all">
                    <div className="col-span-12 md:col-span-6 space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Component Name</Label>
                      <Input
                        placeholder="e.g. Midterm"
                        value={a.name}
                        onChange={(e) => update(a.id, { name: e.target.value })}
                        className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm"
                      />
                    </div>
                    <div className="col-span-5 md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Weight (%)</Label>
                      <Input
                        type="number"
                        value={a.weight}
                        onChange={(e) => update(a.id, { weight: Number(e.target.value) || 0 })}
                        className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums"
                      />
                    </div>
                    <div className="col-span-5 md:col-span-3 space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Score (%)</Label>
                      <Input
                        type="number"
                        value={a.score}
                        onChange={(e) => update(a.id, { score: Number(e.target.value) || 0 })}
                        className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums text-foreground"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(a.id)}
                        className="size-11 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && (
                  <div className="p-12 text-center space-y-4">
                    <div className="size-12 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto text-muted-foreground/40">
                      <History className="size-6" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">No components added yet. Add your first course work above.</p>
                  </div>
                )}
              </div>

              {/* Final Exam Section */}
              <div className="p-6 md:p-8 bg-foreground/5 border-t border-border/40">
                <div className="grid grid-cols-12 gap-6 items-end">
                  <div className="col-span-12 md:col-span-6 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="size-3.5 text-foreground/60" />
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">The Final Exam</Label>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Enter the weight of your final exam to calculate the score you need.</p>
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Final Weight (%)</Label>
                    <Input
                      type="number"
                      value={finalWeight}
                      onChange={(e) => setFinalWeight(Number(e.target.value) || 0)}
                      className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Target Grade (%)</Label>
                    <Input
                      type="number"
                      value={targetGrade}
                      onChange={(e) => setTargetGrade(Number(e.target.value) || 0)}
                      className="h-11 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="surface-card p-6 border-border/30 bg-foreground/5 relative overflow-hidden group shadow-sm">
                <Sparkles className="absolute -bottom-4 -right-4 size-24 text-foreground/5 group-hover:rotate-12 transition-transform duration-700" />
                <div className="flex gap-4 items-start relative z-10">
                  <div className="mt-1 text-foreground/60"><Info className="size-5" /></div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">How weights work</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Ensure the total weight (Components + Final) adds up to 100%. Currently, your total weight is <span className={cn("font-bold", result.currentWeight + finalWeight === 100 ? "text-health" : "text-destructive")}>{result.currentWeight + finalWeight}%</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6 bg-secondary/5 border-border/30 shadow-sm relative overflow-hidden group">
                <Award className="absolute -bottom-4 -right-4 size-24 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <Star className="size-4 text-muted-foreground/60" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expert Evaluation</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium italic relative z-10">
                  "{result.insight}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden group sticky top-32">
              <GraduationCap className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />
              <div className="absolute top-0 right-0 p-4 z-20">
                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-3 rounded-xl transition-all border",
                    copied ? "bg-foreground text-background border-foreground shadow-lg" : "hover:bg-secondary text-muted-foreground hover:text-foreground border-border/40"
                  )}
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Share2 className="size-5" />}
                </button>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Activity className="size-3" /> Current Average
                  </div>
                  <div className="text-7xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                    {result.currentGrade.toFixed(1)}<span className="text-2xl ml-1 opacity-20">%</span>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-border/40">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Target className="size-3 text-health" /> Required on Final
                  </div>
                  <div className={cn("text-5xl font-mono font-bold tabular-nums tracking-tighter",
                    result.requiredFinal > 100 ? "text-destructive" : result.requiredFinal > 90 ? "text-amber-500" : "text-health"
                  )}>
                    {result.requiredFinal < 0 ? "0.0" : result.requiredFinal.toFixed(1)}<span className="text-xl ml-1 opacity-20">%</span>
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                    To reach your target of <span className="font-bold text-foreground">{targetGrade}%</span>.
                  </p>
                </div>

                {result.requiredFinal > 100 && (
                  <div className="flex gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                    <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-[10px] font-medium text-destructive leading-relaxed">
                      It is mathematically impossible to reach {targetGrade}% because you'd need over 100% on the final.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div id="how-to-use" className="space-y-12">
          {calc.howTo && (
            <div className="pt-8 border-t border-border/40">
              <div className="mb-6">
                <h3 className="text-lg font-bold tracking-tight">How to Use Grade Calculator</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">Step-by-Step Instructions</p>
              </div>
              <HowToGuide
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

export default AcademicGradeCalculator;
