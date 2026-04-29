import { Seo } from "@/components/Seo";
import { AlertCircle, Landmark, Activity } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — Important Information | Calcuva",
  description: "Important information about using our calculators responsibly. Our tools are estimates and not a replacement for professional financial or medical advice.",
  alternates: { canonical: "https://calcuva.app/disclaimer" },
  openGraph: { title: "Disclaimer | Calcuva", description: "Our tools are estimates and not a replacement for professional advice.", url: "https://calcuva.app/disclaimer", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function DisclaimerPage() {
  return (
    <div className="bg-background min-h-screen pb-32">
      <Seo 
        title="Disclaimer — For your information"
        description="Important information about using our calculators responsibly."
        canonicalPath="/disclaimer"
      />

      {/* Hero Header */}
      <header className="relative pt-28 pb-20 border-b border-border/40 bg-secondary/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 4'/%3E%3C/svg%3E")` }} />
        <div className="container-wide max-w-4xl relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8 font-mono text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground animate-fade-up">
            <AlertCircle className="size-4 text-amber-500" />
            <span>Calcuva Advisory · Important Info</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter text-center mb-10 animate-fade-up">
            Read this <br />
            <span className="text-foreground/40 italic">before you start.</span>
          </h1>
          <p className="text-muted-foreground text-center text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium animate-fade-up" style={{ animationDelay: "100ms" }}>
            Our tools are here to help you get numbers quickly, but they are not a replacement for advice from professional experts.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-4xl mt-16 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="grid gap-4">
          
          <div className="surface-card p-10 bg-secondary/5 border-border/40 group hover:border-foreground/20 transition-all flex flex-col sm:flex-row gap-8 items-start">
             <div className="size-14 rounded-2xl bg-finance/10 text-finance flex items-center justify-center shrink-0 border border-finance/20">
                <Landmark className="size-7" />
             </div>
             <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Money & Finance</h2>
                <p className="text-xl font-medium leading-relaxed">
                  Our financial tools are estimates. Tax laws and interest rates change often. Before you make big money decisions, always talk to a certified professional.
                </p>
             </div>
          </div>

          <div className="surface-card p-10 bg-secondary/5 border-border/40 group hover:border-foreground/20 transition-all flex flex-col sm:flex-row gap-8 items-start">
             <div className="size-14 rounded-2xl bg-health/10 text-health flex items-center justify-center shrink-0 border border-health/20">
                <Activity className="size-7" />
             </div>
             <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Health & Fitness</h2>
                <p className="text-xl font-medium leading-relaxed">
                  Health calculators are simple guides. They don't know your medical history. Never use these tools to replace advice from a real doctor.
                </p>
             </div>
          </div>

          <div className="surface-card p-12 bg-secondary/10 border-border/40 mt-12">
             <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 border-b border-border/40 pb-4">No Guarantees</h2>
             <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                We work hard to make our math 100% accurate, but we can't guarantee that everything is perfect all the time. Using Calcuva is at your own risk. We're not responsible for any decisions made based on our tools.
             </p>
          </div>

        </div>
      </main>
    </div>
  );
}
