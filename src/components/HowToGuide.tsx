"use client";

import { Lightbulb, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface HowToStep {
  title: string;
  text: string;
}

interface HowToGuideProps {
  steps: HowToStep[];
  proTip?: string;
  variant?: "sidebar" | "horizontal";
  className?: string;
  id?: string;
}

export const HowToGuide = ({ steps, proTip, variant = "sidebar", className, id }: HowToGuideProps) => {
  if (variant === "horizontal") {
    return (
      <div id={id} className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-2 sm:px-0", className)}>
        {steps.map((step, idx) => (
          <div key={idx} className="relative p-6 rounded-2xl bg-secondary/30 border border-border/40 group hover:border-signal/30 transition-all">
            <div className="absolute -top-3 -left-3 size-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-[10px] font-black font-mono text-signal">
              0{idx + 1}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2 group-hover:text-signal transition-colors">{step.title}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              {step.text}
            </p>
          </div>
        ))}
        {proTip && (
          <div className="md:col-span-3 p-4 rounded-xl bg-signal/5 border border-signal/20 flex items-center gap-4">
             <div className="size-8 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
               <Lightbulb className="size-4 text-signal" />
             </div>
             <p className="text-[11px] text-signal/80 font-medium italic">
               <span className="font-bold uppercase tracking-wider mr-2">Pro Tip:</span>
               {proTip}
             </p>
          </div>
        )}
      </div>
    );
  }

  // Default Sidebar Variant
  return (
    <div id={id} className={cn("surface-card overflow-hidden", className)}>
      <div className="bg-secondary/40 px-6 py-4 border-b border-border/40 flex items-center gap-2">
        <Info className="size-4 text-muted-foreground" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">How to use this tool</h4>
      </div>
      <div className="p-6 space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="size-6 rounded-full bg-signal text-white flex items-center justify-center shrink-0 text-[10px] font-bold font-mono">
              {idx + 1}
            </div>
            <div className="space-y-1">
              <h5 className="text-[11px] font-bold uppercase tracking-wider">{step.title}</h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                {step.text}
              </p>
            </div>
          </div>
        ))}
        
        {proTip && (
          <div className="pt-4 border-t border-border/40">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/40">
              <div className="flex items-center gap-2 mb-2 text-signal">
                <Lightbulb className="size-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Pro Tip</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                {proTip}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
