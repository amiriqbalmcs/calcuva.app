"use client";

import { useMemo, useState } from "react";
import { Heart, Copy, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";
import { CalculatorPage } from "@/components/CalculatorPage";
import { ResultGrid, ResultStat } from "@/components/ResultStat";
import { SeoBlock } from "@/components/SeoBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculatorBySlug } from "@/lib/calculators";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";

const calc = calculatorBySlug("love-calculator")!;

// Simple seeded PRNG to ensure the same two names always get the same score
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; 
  }
  return hash;
};

const getCompatibility = (name1: string, name2: string) => {
  if (!name1.trim() || !name2.trim()) return 0;
  
  // Normalize names: lowercase, sort so "A+B" == "B+A"
  const names = [name1.trim().toLowerCase(), name2.trim().toLowerCase()].sort();
  const pairStr = names.join(" loves ");
  
  // Generate deterministic score 0-100
  const hash = Math.abs(hashCode(pairStr));
  // Let's skew it slightly higher for fun, min 20, max 100
  return 20 + (hash % 81); 
};

const LoveCalculator = ({ guideHtml, faqs, relatedArticles }: { guideHtml?: string; faqs?: any[]; relatedArticles?: any[] }) => {
  const [name1, setName1] = useUrlState<string>("n1", "");
  const [name2, setName2] = useUrlState<string>("n2", "");
  const [copied, setCopied] = useState(false);

  const score = useMemo(() => getCompatibility(name1, name2), [name1, name2]);
  
  const hasInput = name1.trim().length > 0 && name2.trim().length > 0;

  let message = "";
  let color = "text-muted-foreground";

  if (hasInput) {
    if (score >= 90) {
      message = "Soulmates! A match made in heaven. ✨";
      color = "text-health";
    } else if (score >= 70) {
      message = "True Love! You have a very strong connection. ❤️";
      color = "text-signal";
    } else if (score >= 50) {
      message = "Good compatibility. There's potential here! 👍";
      color = "text-amber-500";
    } else {
      message = "A bit rocky. This might require some serious work. 💔";
      color = "text-destructive";
    }
  }

  const handleCopy = () => {
    let resultText = `Love Compatibility Test:\n${name1} + ${name2} = ${score}%\n"${message}"\nTest your crush at Calcuva.app`;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorPage calc={calc} guideHtml={guideHtml} faqs={faqs} relatedArticles={relatedArticles}>
      <div className="grid lg:grid-cols-12 gap-8 max-w-4xl mx-auto">
        <div className="lg:col-span-12 space-y-6">
          <div className="p-8 sm:p-12 rounded-[2rem] bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-100 dark:border-red-900/40 shadow-sm mt-0 lg:mt-6 relative overflow-hidden">
             
             {/* Decorative hearts background */}
             <Heart className="absolute -top-4 -right-4 size-32 text-red-500/5 rotate-12" />
             <Heart className="absolute -bottom-8 -left-8 size-48 text-pink-500/5 -rotate-12" />

             <div className="text-center mb-8 relative z-10">
               <div className="inline-flex size-16 rounded-full bg-red-100 dark:bg-red-900/50 items-center justify-center mb-4 text-red-500 animate-pulse">
                 <Heart className="size-8 fill-current" />
               </div>
               <h2 className="text-3xl font-bold text-foreground">Are You Meant to Be?</h2>
               <p className="text-muted-foreground mt-2 max-w-md mx-auto">Enter both names below to calculate your deterministic love compatibility score.</p>
             </div>

            <div className="max-w-2xl mx-auto relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="w-full space-y-2">
                  <Label className="text-foreground font-bold ml-2">Person 1</Label>
                  <Input 
                    type="text" 
                    placeholder="Enter first name..." 
                    value={name1} 
                    onChange={(e) => setName1(e.target.value)} 
                    className="h-14 rounded-2xl bg-background/80 border-border text-center text-lg shadow-inner" 
                  />
                </div>
                
                <div className="shrink-0 pt-6">
                   <div className="size-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                     <span className="font-serif font-bold italic text-lg">+</span>
                   </div>
                </div>

                <div className="w-full space-y-2">
                  <Label className="text-foreground font-bold ml-2">Person 2</Label>
                  <Input 
                    type="text" 
                    placeholder="Enter second name..." 
                    value={name2} 
                    onChange={(e) => setName2(e.target.value)} 
                    className="h-14 rounded-2xl bg-background/80 border-border text-center text-lg shadow-inner" 
                  />
                </div>
              </div>
            </div>

            {hasInput && (
              <div className="mt-8 pt-8 border-t border-border/50 max-w-lg mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                <div className="mb-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Compatibility Score</span>
                </div>
                
                <div className="flex justify-center items-end gap-2 mb-6">
                  <span className={cn("text-8xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br", 
                    score >= 70 ? "from-red-500 to-pink-500" : score >= 50 ? "from-amber-400 to-orange-500" : "from-blue-500 to-indigo-500"
                  )}>
                    {score}%
                  </span>
                </div>
                
                <div className={cn("text-xl font-bold bg-background/50 py-3 px-6 rounded-full inline-block backdrop-blur-md border border-border/50", color)}>
                  {message}
                </div>
                
                <button onClick={handleCopy} className="mt-8 mx-auto flex items-center justify-center gap-2 py-3 px-8 rounded-full bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20">
                  {copied ? <><CheckCircle2 className="size-4" /> Copied for Sharing</> : <><Sparkles className="size-4" /> Share Results</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </CalculatorPage>
  );
}

export default LoveCalculator;
