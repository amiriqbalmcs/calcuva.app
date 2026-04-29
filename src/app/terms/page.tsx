import { Seo } from "@/components/Seo";
import { Gavel, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Our Agreement | Calcuva",
  description: "The simple rules for using Calcuva. Understand your rights and our role as a free, private calculator tool provider.",
  alternates: { canonical: "https://calcuva.app/terms" },
  openGraph: { title: "Terms of Service | Calcuva", description: "Simple, transparent terms for using our free calculator tools.", url: "https://calcuva.app/terms", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen pb-32">
      <Seo 
        title="Terms of Service — Our Agreement"
        description="The simple rules for using Calcuva. Understand your rights and our role as a tool provider."
        canonicalPath="/terms"
      />

      {/* Hero Header */}
      <header className="relative pt-28 pb-20 border-b border-border/40 bg-secondary/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 4'/%3E%3C/svg%3E")` }} />
        <div className="container-wide max-w-4xl relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8 font-mono text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground animate-fade-up">
            <Gavel className="size-4 text-foreground" />
            <span>Calcuva Terms · Usage Rules</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter text-center mb-10 animate-fade-up">
            How things <br />
            <span className="text-foreground/40 italic">work here.</span>
          </h1>
          <p className="text-muted-foreground text-center text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium animate-fade-up" style={{ animationDelay: "100ms" }}>
            Please take a moment to read our simple rules. We've kept them short and easy to understand.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-4xl mt-24 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="space-y-24 prose prose-slate dark:prose-invert max-w-none prose-h2:text-[11px] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.4em] prose-h2:text-muted-foreground prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-4 prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed prose-strong:text-foreground">
          
          <section className="grid gap-8">
             <h2 className="flex items-center gap-4">
                1. Using our tools
             </h2>
             <p className="text-xl font-medium">
                Calcuva is free for everyone. You are welcome to use our tools for your personal calculations or for your business. We just ask that you don't copy our site code to build your own version.
             </p>
          </section>

          <section className="grid gap-8">
             <h2 className="flex items-center gap-4">
                2. No Warranty
             </h2>
             <p className="font-medium">
                We try our best to keep everything accurate, but we provide our calculators "as is." This means we can't promise that the site will always be online or that every number is perfect for your specific situation.
             </p>
          </section>

          <section className="grid gap-8">
             <h2 className="flex items-center gap-4">
                3. Responsible Use
             </h2>
             <p className="font-medium">
                By using Calcuva, you agree that you are responsible for any decisions you make based on our results. As we always say: if the numbers are important (like a home loan), double-check them with a professional!
             </p>
          </section>

          <section className="pt-24 border-t border-border/40 text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
                Last updated: April 25, 2026.
             </p>
          </section>

        </div>
      </main>
    </div>
  );
}
