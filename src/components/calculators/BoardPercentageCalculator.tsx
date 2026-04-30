"use client";

import { useMemo, useState } from "react";
import {
  FileText, TrendingUp, Info, BookOpen, Target, 
  ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Landmark, Copy, Award, AlertCircle, Percent, GraduationCap, CheckCircle2
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { BOARD_MARK_SCHEMES } from "@/lib/data/HistoricalData";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("board-percentage-calculator");

const BoardPercentageCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;

  const [obtained, setObtained] = useState<number>(880);
  const [board, setBoard] = useState<string>("punjab");
  const [customTotal, setCustomTotal] = useState<number>(1100);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const total = board === "custom" ? customTotal : (BOARD_MARK_SCHEMES[board]?.total || 1100);
    const percentage = total > 0 ? (obtained / total) * 100 : 0;
    
    let grade = "F";
    let remarks = "Fail";
    if (percentage >= 80) { grade = "A-1"; remarks = "Exceptional"; }
    else if (percentage >= 70) { grade = "A"; remarks = "Excellent"; }
    else if (percentage >= 60) { grade = "B"; remarks = "Very Good"; }
    else if (percentage >= 50) { grade = "C"; remarks = "Good"; }
    else if (percentage >= 40) { grade = "D"; remarks = "Fair"; }
    else if (percentage >= 33) { grade = "E"; remarks = "Satisfactory"; }

    return { percentage, grade, remarks, total };
  }, [obtained, board, customTotal]);

  const handleCopy = () => {
    const text = `Board Result: ${obtained}/${result.total} Marks | Percentage: ${result.percentage.toFixed(1)}% | Grade: ${result.grade} (${result.remarks}). Calculate at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <div className="lg:col-span-7 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
              <div className="flex items-center gap-3 relative z-10">
                <GraduationCap className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Board Selection</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Choose your examination board</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Examination Board</Label>
                <Select value={board} onValueChange={setBoard}>
                  <SelectTrigger className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm">
                    <SelectValue placeholder="Select Board" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/60">
                    {Object.entries(BOARD_MARK_SCHEMES).map(([key, val]) => (
                      <SelectItem key={key} value={key} className="py-3 rounded-lg font-medium">{val.label}</SelectItem>
                    ))}
                    <SelectItem value="custom" className="py-3 rounded-lg font-medium italic text-muted-foreground">Custom / Other Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Obtained Marks</Label>
                    <Input
                      type="number"
                      value={obtained}
                      onChange={(e) => setObtained(Number(e.target.value) || 0)}
                      className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Total Marks</Label>
                    {board === "custom" ? (
                       <Input
                         type="number"
                         value={customTotal}
                         onChange={(e) => setCustomTotal(Number(e.target.value) || 0)}
                         className="h-12 bg-background border-border/60 font-bold rounded-xl shadow-sm text-center tabular-nums text-foreground animate-in fade-in"
                       />
                    ) : (
                       <div className="h-12 bg-secondary/20 border border-border/40 rounded-xl flex items-center justify-center font-bold text-muted-foreground tabular-nums">
                          {BOARD_MARK_SCHEMES[board]?.total || 1100}
                       </div>
                    )}
                 </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 border-border/30 bg-foreground/5 relative overflow-hidden group">
            <Sparkles className="absolute -bottom-4 -right-4 size-24 text-foreground/5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1 text-foreground/60">
                <Info className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Board Grading Info</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Pakistan board percentages are used for admissions into top colleges (GCU, FCCU, KIPS) and merit lists for medical/engineering universities.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="surface-card p-8 bg-background border-border/60 shadow-md relative overflow-hidden">
             <div className="space-y-10 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Percent className="size-3" /> Result Percentage
                       </div>
                       <button 
                          onClick={handleCopy}
                          className={cn(
                             "p-2 rounded-lg transition-all border shadow-sm",
                             copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                          )}
                       >
                          {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
                       </button>
                    </div>
                   <div className="text-7xl font-mono font-bold tracking-tighter tabular-nums text-foreground">
                      {result.percentage.toFixed(1)}<span className="text-2xl ml-1 opacity-20">%</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border/40">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Final Grade</div>
                      <div className="text-3xl font-bold tracking-tight text-foreground">{result.grade}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Remarks</div>
                      <div className="text-sm font-bold text-muted-foreground mt-1">
                         {result.remarks}
                      </div>
                   </div>
                </div>

                <div className="p-5 rounded-2xl bg-foreground/5 border border-border/30 space-y-3">
                   <div className="flex items-center gap-2 text-foreground/60">
                      <Award className="size-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Merit Eligibility</span>
                   </div>
                   <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {result.percentage >= 90 
                        ? "Outstanding! You are likely in the top 1% of your board and eligible for full scholarships."
                        : result.percentage >= 80
                        ? "Excellent. You meet the merit criteria for most top engineering and medical colleges."
                        : "Competitive score. Focus on your entry tests (MDCAT/ECAT) to boost your final aggregate."}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default BoardPercentageCalculator;
