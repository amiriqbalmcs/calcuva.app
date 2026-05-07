"use client";

import React, { useState, useEffect } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Info, TrendingUp, BookOpen, Calculator as CalcIcon } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { calculatorBySlug } from "@/lib/calculators";
import { HowToGuide } from "@/components/HowToGuide";


const calc = calculatorBySlug("university-merit-aggregate-calculator")!;

interface UniversityPreset {
  name: string;
  matricWeight: number;
  interWeight: number;
  testWeight: number;
  testMaxMarks: number;
}

const PRESETS: Record<string, UniversityPreset> = {
  nust: { name: "NUST (NET)", matricWeight: 10, interWeight: 15, testWeight: 75, testMaxMarks: 200 },
  uet: { name: "UET (ECAT)", matricWeight: 25, interWeight: 45, testWeight: 30, testMaxMarks: 400 },
  fast: { name: "FAST-NUCES", matricWeight: 10, interWeight: 40, testWeight: 50, testMaxMarks: 100 },
  giki: { name: "GIKI", matricWeight: 5, interWeight: 10, testWeight: 85, testMaxMarks: 200 },
  mdcat: { name: "MDCAT (Medical)", matricWeight: 10, interWeight: 40, testWeight: 50, testMaxMarks: 200 },
  custom: { name: "Custom Weights", matricWeight: 0, interWeight: 0, testWeight: 0, testMaxMarks: 100 },
};

export default function UniversityMeritCalculator({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) {
  const [university, setUniversity] = useState<string>("nust");
  const [matricMarks, setMatricMarks] = useState<string>("");
  const [matricTotal, setMatricTotal] = useState<string>("1100");
  const [interMarks, setInterMarks] = useState<string>("");
  const [interTotal, setInterTotal] = useState<string>("1100");
  const [testMarks, setTestMarks] = useState<string>("");
  const [testTotal, setTestTotal] = useState<string>("200");

  const [customMatric, setCustomMatric] = useState<string>("10");
  const [customInter, setCustomInter] = useState<string>("40");
  const [customTest, setCustomTest] = useState<string>("50");

  const [merit, setMerit] = useState<number | null>(null);

  useEffect(() => {
    if (university !== "custom") {
      const p = PRESETS[university];
      setCustomMatric(p.matricWeight.toString());
      setCustomInter(p.interWeight.toString());
      setCustomTest(p.testWeight.toString());
      setTestTotal(p.testMaxMarks.toString());
    }
  }, [university]);


  const calculateMerit = () => {
    const mMarks = parseFloat(matricMarks);
    const mTotal = parseFloat(matricTotal);
    const iMarks = parseFloat(interMarks);
    const iTotal = parseFloat(interTotal);
    const tMarks = parseFloat(testMarks);
    const tTotal = parseFloat(testTotal);

    const wMatric = parseFloat(customMatric);
    const wInter = parseFloat(customInter);
    const wTest = parseFloat(customTest);

    if (isNaN(mMarks) || isNaN(mTotal) || isNaN(iMarks) || isNaN(iTotal) || isNaN(tMarks) || isNaN(tTotal)) {
      return;
    }

    const mPercent = (mMarks / mTotal) * wMatric;
    const iPercent = (iMarks / iTotal) * wInter;
    const tPercent = (tMarks / tTotal) * wTest;

    const totalMerit = mPercent + iPercent + tPercent;
    setMerit(totalMerit);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          {merit !== null ? (
            <div className="surface-card p-8 md:p-12 border-2 border-primary/20 bg-primary/5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] -mr-8 -mt-8">
                <GraduationCap className="size-48" />
              </div>
              
              <div className="relative z-10 text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Your Admissions Aggregate</p>
                <div className="text-7xl md:text-8xl font-black text-primary tracking-tighter">
                  {merit.toFixed(4)}<span className="text-3xl ml-1">%</span>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="px-4 py-2 bg-background/50 rounded-full text-[10px] font-bold text-muted-foreground uppercase border border-border/50">
                    Formula: {customMatric}% / {customInter}% / {customTest}%
                  </div>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="p-4 rounded-2xl bg-background/60 border border-border/50 space-y-2">
                  <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Matric Contrib.</div>
                  <div className="text-xl font-bold">{((parseFloat(matricMarks)/parseFloat(matricTotal)) * parseFloat(customMatric)).toFixed(2)}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-background/60 border border-border/50 space-y-2">
                  <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Inter Contrib.</div>
                  <div className="text-xl font-bold">{((parseFloat(interMarks)/parseFloat(interTotal)) * parseFloat(customInter)).toFixed(2)}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-background/60 border border-border/50 space-y-2">
                  <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Test Contrib.</div>
                  <div className="text-xl font-bold">{((parseFloat(testMarks)/parseFloat(testTotal)) * parseFloat(customTest)).toFixed(2)}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-card p-12 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <div className="size-16 bg-muted rounded-2xl flex items-center justify-center">
                <CalcIcon className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold">Ready to Calculate</h3>
                <p className="text-xs text-muted-foreground max-w-[240px]">Enter your marks on the left to see your admission aggregate.</p>
              </div>
            </div>
          )}

          {/* Weightage Index Card */}
          <div className="surface-card p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Info className="size-4 text-primary" /> University Weightage Index
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Standard Ratios (Matric : Inter : Test)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(PRESETS).filter(([k]) => k !== "custom").map(([key, p]) => (
                <div key={key} className="p-4 rounded-2xl border border-border/60 hover:border-primary/30 transition-all group flex items-center justify-between">
                  <span className="text-sm font-bold group-hover:text-primary transition-colors">{p.name}</span>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-1 bg-secondary/50 rounded text-[10px] font-black text-muted-foreground">{p.matricWeight}</span>
                    <span className="px-2 py-1 bg-secondary/50 rounded text-[10px] font-black text-muted-foreground">{p.interWeight}</span>
                    <span className="px-2 py-1 bg-primary/10 rounded text-[10px] font-black text-primary">{p.testWeight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">

          <div className="surface-card p-6 md:p-8 space-y-8 bg-secondary/5 border-border/40 relative overflow-hidden group">
            <div className="space-y-1 relative z-10">
              <h3 className="text-sm font-bold tracking-tight">Academic Profile</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Select University & Scores</p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target University</Label>
                <Select value={university} onValueChange={setUniversity}>
                  <SelectTrigger className="h-11 bg-background border-border/60 rounded-lg shadow-sm">
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRESETS).map(([key, p]) => (
                      <SelectItem key={key} value={key}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Matric / O-Level</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Obtained"
                    value={matricMarks}
                    onChange={(e) => setMatricMarks(e.target.value)}
                    className="h-11 bg-background border-border/60"
                  />
                  <Input
                    type="number"
                    placeholder="Total"
                    value={matricTotal}
                    onChange={(e) => setMatricTotal(e.target.value)}
                    className="h-11 bg-background border-border/60"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Intermediate / A-Level</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Obtained"
                    value={interMarks}
                    onChange={(e) => setInterMarks(e.target.value)}
                    className="h-11 bg-background border-border/60"
                  />
                  <Input
                    type="number"
                    placeholder="Total"
                    value={interTotal}
                    onChange={(e) => setInterTotal(e.target.value)}
                    className="h-11 bg-background border-border/60"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Entrance Test Score</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Obtained"
                    value={testMarks}
                    onChange={(e) => setTestMarks(e.target.value)}
                    className="h-11 bg-background border-border/60"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={testTotal}
                    onChange={(e) => setTestTotal(e.target.value)}
                    disabled={university !== "custom"}
                    className="h-11 bg-background border-border/60 disabled:opacity-50"
                  />
                </div>
              </div>

              {university === "custom" && (
                <div className="p-4 bg-primary/5 rounded-xl space-y-3 border border-primary/10">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <TrendingUp className="size-3" /> Custom Weightage (%)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="number" value={customMatric} onChange={(e) => setCustomMatric(e.target.value)} className="h-9 text-xs bg-background" placeholder="M%" />
                    <Input type="number" value={customInter} onChange={(e) => setCustomInter(e.target.value)} className="h-9 text-xs bg-background" placeholder="I%" />
                    <Input type="number" value={customTest} onChange={(e) => setCustomTest(e.target.value)} className="h-9 text-xs bg-background" placeholder="T%" />
                  </div>
                </div>
              )}

              <Button 
                className="w-full h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
                onClick={calculateMerit}
              >
                Calculate My Merit
              </Button>
            </div>
          </div>

          {calc.howTo && (
            <HowToGuide 
              id="how-to-use"
              steps={calc.howTo!.steps} 
              proTip={calc.howTo!.proTip} 
              variant="sidebar" 
            />
          )}
        </div>




      </div>
    </CalculatorPage>
  );
}
