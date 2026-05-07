import { Seo } from "@/components/Seo";
import { Gavel, CheckCircle, Plus, Minus, X, Percent, Divide, Activity } from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service — Our Agreement | Calcuva",
  description: "The simple rules for using Calcuva. Understand your rights and our role as a free, private calculator tool provider.",
  alternates: { canonical: "https://calcuva.app/terms" },
  openGraph: { title: "Terms of Service | Calcuva", description: "Simple, transparent terms for using our free calculator tools.", url: "https://calcuva.app/terms", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Seo 
        title="Terms of Service — Our Agreement"
        description="The simple rules for using Calcuva. Understand your rights and our role as a tool provider."
        canonicalPath="/terms"
      />

      {/* Immersive Header - Elite Style */}
      <header className="relative min-h-[70vh] lg:min-h-[80vh] flex flex-col items-center justify-start border-b border-border/50 bg-hero overflow-hidden pt-32 sm:pt-48 pb-20">
        {/* Dynamic Texture Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 dark:bg-indigo-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

          {/* Precision Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.03]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>

        {/* Rich Icon Watermarks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04] dark:opacity-[0.02] text-white dark:text-muted-foreground">
          <div className="absolute top-[10%] left-[10%] rotate-12"><Plus className="size-20 sm:size-32" /></div>
          <div className="absolute top-[15%] right-[15%] -rotate-45"><Percent className="size-16 sm:size-24" /></div>
          <div className="absolute bottom-[20%] left-[15%] -rotate-12"><Divide className="size-20 sm:size-28" /></div>
          <div className="absolute bottom-[10%] right-[10%] rotate-12"><Activity className="size-24 sm:size-36" /></div>
        </div>

        <div className="container-wide max-w-5xl relative z-10 text-hero-text text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
            Legal Compliance
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            Terms of <br />
            <span className="opacity-40 italic font-medium">Agreement.</span>
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
             Simple, clear, and transparent rules for using our suite of precision tools.
          </p>
        </div>
      </header>

      <main className="container-wide py-32 animate-fade-up">
        <div className="max-w-4xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
             <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-6 shadow-sm hover:border-signal/30 transition-all group">
                <div className="size-14 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                   <Gavel className="size-7 text-muted-foreground group-hover:text-signal transition-colors" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">User Rights</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">You have the right to use our tools for personal and professional analysis without any cost.</p>
             </div>

             <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-6 shadow-sm hover:border-signal/30 transition-all group">
                <div className="size-14 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                   <CheckCircle className="size-7 text-muted-foreground group-hover:text-signal transition-colors" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Fair Use</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">We ask that you use our tools responsibly and don't attempt to scrape or resell our data.</p>
             </div>
           </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg
               prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
               prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-16
               prose-h3:text-xl prose-h3:font-bold prose-h3:tracking-tight prose-h3:mt-12">
            <h2>Welcome to Calcuva</h2>
            <p>By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

            <h3>1. Use License</h3>
            <p>Permission is granted to use the calculator tools on Calcuva's website for personal, non-commercial transitory viewing and use only. This is the grant of a license, not a transfer of title.</p>

            <h3>2. Disclaimer</h3>
            <p>The materials on Calcuva's website are provided "as is". Calcuva makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

            <h3>3. Accuracy of Materials</h3>
            <p>The materials appearing on Calcuva's website could include technical, typographical, or photographic errors. Calcuva does not warrant that any of the materials on its website are accurate, complete or current. Calcuva may make changes to the materials contained on its website at any time without notice.</p>

            <h3>4. Links</h3>
            <p>Calcuva has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Calcuva of the site. Use of any such linked website is at the user's own risk.</p>

            <div className="mt-20 p-8 bg-secondary/50 dark:bg-zinc-900/50 border border-border dark:border-white/5 rounded-2xl text-sm text-muted-foreground/60 italic font-medium">
               Last updated: May 7, 2026. For legal inquiries, contact us at hello@calcuva.app.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
