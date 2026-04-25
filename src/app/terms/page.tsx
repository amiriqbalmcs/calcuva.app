import { Seo } from "@/components/Seo";
import { Gavel, CheckCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Seo 
        title="Terms of Service — Our Agreement"
        description="The simple rules for using Calcuva. Understand your rights and our role as a tool provider."
        canonicalPath="/terms"
      />

      <header className="pt-24 pb-16 border-b border-border bg-secondary/10">
        <div className="container-wide max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/20 text-signal text-[10px] font-bold uppercase tracking-widest mb-6">
            <Gavel className="size-3" /> The Rules
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">How things work here.</h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            Please take a moment to read our simple terms of use.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-3xl mt-16 pb-20">
        <div className="space-y-12 prose prose-slate dark:prose-invert max-w-none prose-h2:text-2xl prose-h2:font-bold prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed">
          
          <section>
             <h2 className="flex items-center gap-3">
                <CheckCircle className="size-6 text-signal" /> 1. Using our tools
             </h2>
             <p>
                Calcuva is free for everyone. You are welcome to use our tools for your personal calculations or for your business. We just ask that you don't copy the "guts" of the site to build your own version of it.
             </p>
          </section>

          <section>
             <h2 className="flex items-center gap-3">
                <CheckCircle className="size-6 text-signal" /> 2. No Warranty
             </h2>
             <p>
                We try our best to keep everything accurate, but we provide our calculators "as is." This means we can't promise that the site will always be online or that every number is perfect for your specific situation.
             </p>
          </section>

          <section>
             <h2 className="flex items-center gap-3">
                <CheckCircle className="size-6 text-signal" /> 3. Responsible Use
             </h2>
             <p>
                By using Calcuva, you agree that you are responsible for any decisions you make based on our results. As we always say: if the numbers are important (like a home loan), double-check them with a professional!
             </p>
          </section>

          <section className="pt-12 border-t border-border text-center">
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic">
                Last updated: April 25, 2026.
             </p>
          </section>

        </div>
      </main>
    </div>
  );
}
