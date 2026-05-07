import { Seo } from "@/components/Seo";
import { AlertCircle, Landmark, Activity, Plus, Minus, X, Percent, Divide, Activity as ActivityIcon } from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Disclaimer — Important Information | Calcuva",
  description: "Important information about using our calculators responsibly. Our tools are estimates and not a replacement for professional advice.",
  alternates: { canonical: "https://calcuva.app/disclaimer" },
  openGraph: { title: "Disclaimer | Calcuva", description: "Our tools are estimates and not a replacement for professional advice.", url: "https://calcuva.app/disclaimer", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function DisclaimerPage() {
  return (
    <div className="bg-background min-h-screen">
      <Seo 
        title="Disclaimer — For your information"
        description="Important information about using our calculators responsibly."
        canonicalPath="/disclaimer"
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
          <div className="absolute bottom-[10%] right-[10%] rotate-12"><ActivityIcon className="size-24 sm:size-36" /></div>
        </div>

        <div className="container-wide max-w-5xl relative z-10 text-hero-text text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
            Safety & Responsibility
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            Professional <br />
            <span className="opacity-40 italic font-medium">Disclaimer.</span>
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
            Our tools provide high-fidelity estimates. For critical financial or medical decisions, always consult a qualified professional.
          </p>
        </div>
      </header>

      <main className="container-wide py-32 animate-fade-up">
        <div className="max-w-4xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
             <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-6 shadow-sm hover:border-signal/30 transition-all group">
                <div className="size-14 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                   <Landmark className="size-7 text-muted-foreground group-hover:text-signal transition-colors" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Financial Use</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">Calculations for loans, taxes, and interest are estimates and should be verified by a financial advisor.</p>
             </div>

             <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-6 shadow-sm hover:border-signal/30 transition-all group">
                <div className="size-14 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                   <Activity className="size-7 text-muted-foreground group-hover:text-signal transition-colors" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Health Metrics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">Health-related tools are for informational purposes only and are not a substitute for medical advice.</p>
             </div>
           </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg
               prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
               prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-16
               prose-h3:text-xl prose-h3:font-bold prose-h3:tracking-tight prose-h3:mt-12">
            <h2>Legal Information & Disclaimer</h2>
            <p>The information provided by Calcuva ("we," "us," or "our") on calcuva.app (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>

            <h3>1. No Professional Advice</h3>
            <p>The Site cannot and does not contain professional advice (financial, legal, medical, or otherwise). The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>

            <h3>2. Errors & Omissions</h3>
            <p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Calcuva is not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>

            <h3>3. "As Is" Content</h3>
            <p>All information in the Site is provided "as is," with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied.</p>

            <h3>4. Limitation of Liability</h3>
            <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>

            <div className="mt-20 p-8 bg-secondary/50 dark:bg-zinc-900/50 border border-border dark:border-white/5 rounded-2xl text-sm text-muted-foreground/60 italic font-medium">
               Last updated: May 7, 2026. For questions regarding this disclaimer, contact us at hello@calcuva.app.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
