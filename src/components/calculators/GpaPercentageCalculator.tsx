"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Share, CheckCircle2, GraduationCap, Info } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("gpa-to-percentage-calculator")!;

const GRADE_POINTS: Record<string, number> = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0 };
const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

interface Course { id: string; name: string; credits: number; grade: string; }
const newCourse = (n = 1): Course => ({ id: `c-${n}-${Date.now()}`, name: `Course ${n}`, credits: 3, grade: "A" });

const GpaPercentageCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: "c-1", name: "Course 1", credits: 3, grade: "A" },
    { id: "c-2", name: "Course 2", credits: 3, grade: "A" },
    { id: "c-3", name: "Course 3", credits: 3, grade: "A" }
  ]);
  const [previousGpa, setPreviousGpa] = useUrlState<number>("prev", 0);
  const [previousCredits, setPreviousCredits] = useUrlState<number>("pc", 0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalCredits = courses.reduce((s, c) => s + (c.credits || 0), 0);
    const points = courses.reduce((s, c) => s + (GRADE_POINTS[c.grade] ?? 0) * (c.credits || 0), 0);
    const semGpa = totalCredits > 0 ? points / totalCredits : 0;
    const cumCredits = totalCredits + previousCredits;
    const cumGpa = cumCredits > 0 ? (points + previousGpa * previousCredits) / cumCredits : 0;
    const percentage = (cumGpa / 4.0) * 100;

    let insight = "";
    if (cumGpa > 3.8) insight = "Deans List: Exceptional academic standing. You are in the top tier of students globally.";
    else if (cumGpa > 3.5) insight = "Honors Range: High performance. Your profile is competitive for selective graduate programs.";
    else if (cumGpa > 2.5) insight = "Good Standing: You are maintaining a stable academic record. Aim for 3.0+ to clear most career hurdles.";
    else insight = "Action Required: Your GPA is in the critical range. Prioritize retaking low-grade courses to boost your cumulative average.";

    return { semGpa, cumGpa, totalCredits, percentage, points, insight };
  }, [courses, previousGpa, previousCredits]);

  const update = (id: string, patch: Partial<Course>) => setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const remove = (id: string) => setCourses((cs) => cs.filter((c) => c.id !== id));
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage
      calc={calc}
      guideHtml={guideHtml}
      faqs={faqs}
      relatedArticles={relatedArticles}
      seoContent={
        <SeoBlock
          title="GPA and CGPA Calculations"
          intro="GPA is the credit-weighted average of grade points. Higher credit courses impact your average significantly."
          sections={[{ heading: "4.0 Scale", body: <p>A=4.0, B=3.0, etc. GPA = Total Points / Total Credits.</p> }]}
          faqs={[{ q: "GPA vs CGPA?", a: "GPA is for one term; CGPA is for all terms combined." }]}
        />
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold uppercase tracking-widest font-mono text-[10px] text-muted-foreground">Semester Courses</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleShare}>{copied ? <CheckCircle2 className="size-3 mr-1" /> : <Share className="size-3 mr-1" />} {copied ? "COPIED" : "SHARE"}</Button>
              <Button size="sm" onClick={() => setCourses((cs) => [...cs, newCourse(cs.length + 1)])}><Plus className="size-4 mr-1" /> Add</Button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {courses.map((c) => (
              <div key={c.id} className="p-4 grid grid-cols-12 gap-3 items-end">
                <div className="col-span-6 sm:col-span-6"><Label className="text-xs">Subject</Label><Input value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} className="mt-1" /></div>
                <div className="col-span-3 sm:col-span-2"><Label className="text-xs">Credits</Label><Input type="number" value={c.credits} onChange={(e) => update(c.id, { credits: Number(e.target.value) || 0 })} className="mt-1" /></div>
                <div className="col-span-2 sm:col-span-3"><Label className="text-xs">Grade</Label>
                  <Select value={c.grade} onValueChange={(v) => update(c.id, { grade: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{GRADE_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 flex justify-end"><Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="size-4" /></Button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <ResultStat label="Term GPA" value={result.semGpa.toFixed(3)} accent />
          
          {/* GPA Insight */}
          <div className="p-5 rounded-xl flex gap-4 items-start border-l-4 bg-education-soft border-education text-education">
            <div className="shrink-0 mt-0.5"><GraduationCap className="size-5" /></div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Academic Insight</h4>
              <p className="text-sm opacity-90 leading-relaxed font-medium">{result.insight}</p>
            </div>
          </div>

          <div className="surface-card p-5 space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Historical Record</h3>
             <div><Label className="text-xs">Prev CGPA</Label><Input type="number" step="0.01" value={previousGpa} onChange={(e) => setPreviousGpa(Number(e.target.value) || 0)} className="mt-1.5" /></div>
             <div><Label className="text-xs">Prev Credits</Label><Input type="number" value={previousCredits} onChange={(e) => setPreviousCredits(Number(e.target.value) || 0)} className="mt-1.5" /></div>
          </div>
          <ResultGrid cols={2}>
            <ResultStat label="Total CGPA" value={result.cumGpa.toFixed(3)} />
            <ResultStat label="Pct Equivalent" value={`${result.percentage.toFixed(1)}%`} />
          </ResultGrid>
        </div>
      </div>
    </CalculatorPage>
  );
};

export default GpaPercentageCalculator;
