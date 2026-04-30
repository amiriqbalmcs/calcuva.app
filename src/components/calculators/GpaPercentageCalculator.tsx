"use client";

import { useMemo, useState } from "react";
import {
  Plus, Trash2, Share, CheckCircle2, GraduationCap, Info, BookOpen,
  Star, Target, TrendingUp, History, Percent, LayoutDashboard,
  Settings2, ChevronRight, Calculator, Scale, RefreshCcw, Activity,
  Sparkles, Globe, Landmark, Copy, FileText, Award
} from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { SITE_DOMAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("gpa-to-percentage-calculator");

const GRADE_POINTS: Record<string, number> = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0 };
const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

interface Course { id: string; name: string; credits: number; grade: string; }
const newCourse = (n = 1): Course => ({ id: `c-${n}-${Date.now()}`, name: `Course ${n}`, credits: 3, grade: "A" });

const GpaPercentageCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  if (!calc) return null;
  const [courses, setCourses] = useState<Course[]>([
    { id: "c-1", name: "Mathematics", credits: 4, grade: "A" },
    { id: "c-2", name: "Computer Science", credits: 3, grade: "A-" },
    { id: "c-3", name: "Digital Logic", credits: 3, grade: "B+" }
  ]);
  const [previousGpa, setPreviousGpa] = useUrlState<number>("prev", 3.5);
  const [previousCredits, setPreviousCredits] = useUrlState<number>("pc", 60);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalCredits = courses.reduce((s, c) => s + (c.credits || 0), 0);
    const points = courses.reduce((s, c) => s + (GRADE_POINTS[c.grade] ?? 0) * (c.credits || 0), 0);
    const semGpa = totalCredits > 0 ? points / totalCredits : 0;
    const cumCredits = totalCredits + previousCredits;
    const cumGpa = cumCredits > 0 ? (points + previousGpa * previousCredits) / cumCredits : 0;
    const percentage = (cumGpa / 4.0) * 100;

    let insight = "";
    if (cumGpa > 3.8) insight = "Top Student: Amazing work! Your grades are among the best in the world.";
    else if (cumGpa > 3.5) insight = "Great Grades: You're doing very well. This is a great score for applying to top universities.";
    else if (cumGpa > 2.5) insight = "Good Standing: You're doing fine. Try to keep your GPA above 3.0 to have more career choices.";
    else insight = "Needs Improvement: Your current grades are a bit low. You might want to retake some classes to boost your score.";

    return { semGpa, cumGpa, totalCredits, cumCredits, percentage, points, insight };
  }, [courses, previousGpa, previousCredits]);

  const update = (id: string, patch: Partial<Course>) => setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const remove = (id: string) => setCourses((cs) => cs.filter((c) => c.id !== id));

  const handleCopy = () => {
    let text = `My Grades: GPA ${result.cumGpa.toFixed(3)} (${result.percentage.toFixed(1)}%). Check yours at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

        {/* Course List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card bg-secondary/5 border-border/40 overflow-hidden group shadow-sm">
            <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-background relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-foreground" />
              <div className="flex items-center gap-3 relative z-10">
                <BookOpen className="size-5 text-muted-foreground/60" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold tracking-tight">Current Courses</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Enter Your Grades and Credits</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCourses((cs) => [...cs, newCourse(cs.length + 1)])}
                className="h-9 px-4 text-[10px] font-bold tracking-widest border-border/60 hover:bg-foreground hover:text-background transition-all rounded-xl"
              >
                <Plus className="size-3 mr-2" /> ADD COURSE
              </Button>
            </div>

            <div className="divide-y divide-border/30">
              {courses.map((c) => (
                <div key={c.id} className="p-6 grid grid-cols-12 gap-6 items-end group/row hover:bg-background transition-all">
                  <div className="col-span-12 md:col-span-6 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Course Name</Label>
                    <Input
                      placeholder="e.g. Mathematics"
                      value={c.name}
                      onChange={(e) => update(c.id, { name: e.target.value })}
                      className="h-11 bg-background/50 border-border/40 font-bold focus:border-foreground/20 rounded-xl"
                    />
                  </div>
                  <div className="col-span-5 md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Credits</Label>
                    <Input
                      type="number"
                      value={c.credits}
                      onChange={(e) => update(c.id, { credits: Number(e.target.value) || 0 })}
                      className="h-11 bg-background/50 border-border/40 font-bold focus:border-foreground/20 rounded-xl tabular-nums"
                    />
                  </div>
                  <div className="col-span-5 md:col-span-3 space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Grade</Label>
                    <Select value={c.grade} onValueChange={(v) => update(c.id, { grade: v })}>
                      <SelectTrigger className="h-11 bg-background/50 border-border/40 font-bold focus:border-foreground/20 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/40">
                        {GRADE_OPTIONS.map((g) => <SelectItem key={g} value={g} className="font-bold">{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(c.id)}
                      className="size-11 rounded-xl text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="p-16 text-center space-y-4">
                  <FileText className="size-12 text-muted-foreground/10 mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Add your courses above to see your results</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group shadow-sm">
              <Award className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <Star className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Credit Importance</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Classes with more credits have a bigger effect on your GPA than small elective classes. Focus on doing well in your core subjects!
              </p>
            </div>
            <div className="surface-card p-8 border-border/30 space-y-4 bg-secondary/5 relative overflow-hidden group shadow-sm">
              <Target className="absolute -bottom-4 -right-4 size-20 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <TrendingUp className="size-4 text-muted-foreground" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Plan Your Grades</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium relative z-10">
                Use this tool to see what grades you need in future classes to reach your goal GPA. Planning ahead helps you stay on track.
              </p>
            </div>
          </div>
        </div>

        {/* Results & History */}
        <div className="lg:col-span-4 space-y-6">

          {/* Your GPA */}
          {/* Executive Summary */}
          <div className="surface-card p-8 md:p-10 space-y-10 bg-background border-border/60 shadow-md relative overflow-hidden group">
            <GraduationCap className="absolute -top-12 -right-12 size-64 text-foreground/[0.02] -rotate-12 transition-transform group-hover:-rotate-6 duration-1000" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Star className="size-3" />
                    Cumulative GPA Score
                  </div>
                  <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter tabular-nums">
                    {result.cumGpa.toFixed(3)}
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-3 rounded-xl transition-all border shadow-sm",
                    copied ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:bg-secondary"
                  )}
                >
                  {copied ? <CheckCircle2 className="size-5" /> : <Copy className="size-5" />}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-border/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Percent className="size-3" />
                    Percentage
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {result.percentage.toFixed(1)}<span className="text-[10px] opacity-40 uppercase tracking-widest font-sans font-bold">%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <History className="size-3" />
                    This Semester
                  </div>
                  <div className="text-3xl md:text-4xl font-mono font-bold text-foreground tabular-nums">
                    {result.semGpa.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Tip */}
          <div className="surface-card p-6 border-border/30 bg-finance/5 text-finance relative overflow-hidden group shadow-sm">
            <Sparkles className="absolute -bottom-4 -right-4 size-20 opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="mt-1">
                <Award className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-finance/80">Academic Tip</h4>
                <p className="text-xs leading-relaxed font-medium">
                  {result.insight}
                </p>
              </div>
            </div>
          </div>

          {/* Historical Record */}
          <div className="surface-card p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group shadow-sm">
            <History className="absolute -bottom-6 -left-6 size-32 text-muted-foreground/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />

            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Previous Records</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Your Past GPA and Credits</p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Past GPA</Label>
                <input
                  type="number"
                  step="0.01"
                  value={previousGpa}
                  onChange={(e) => setPreviousGpa(Number(e.target.value) || 0)}
                  className="h-11 w-full bg-background border border-border/60 font-bold text-lg rounded-xl shadow-sm tabular-nums px-4"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Credits Finished</Label>
                <input
                  type="number"
                  value={previousCredits}
                  onChange={(e) => setPreviousCredits(Number(e.target.value) || 0)}
                  className="h-11 w-full bg-background border border-border/60 font-bold text-lg rounded-xl shadow-sm tabular-nums px-4"
                />
              </div>
            </div>
          </div>


        </div>
      </div>
    </CalculatorPage>
  );
};

export default GpaPercentageCalculator;
