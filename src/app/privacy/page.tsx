import { Seo } from "@/components/Seo";
import { Shield, Lock, Eye, Plus, Minus, X, Percent, Divide, Activity } from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy — Your Data is Safe | Calcuva",
  description: "We don't collect what you type into our calculators. No trackers, no databases, no cloud storage for your personal inputs.",
  alternates: { canonical: "https://calcuva.app/privacy" },
  openGraph: { title: "Privacy Policy | Calcuva", description: "Your data stays on your device. We don't track your calculations.", url: "https://calcuva.app/privacy", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      <Seo 
        title="Privacy First — Your data is strictly yours"
        description="We don't collect what you type into our calculators. No trackers, no databases, no cloud storage for your personal inputs."
        canonicalPath="/privacy"
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
            Legal Transparency
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            Privacy is a <br />
            <span className="opacity-40 italic font-medium">fundamental right.</span>
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
            We don't collect your inputs. No trackers, no hidden databases, no cloud storage for your calculations.
          </p>
        </div>
      </header>

      <main className="container-wide py-32 animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              { t: "No Tracking", d: "We don't use cookies to track your personal behavior.", i: Shield },
              { t: "Client-Side", d: "All calculations happen in your browser, not our server.", i: Lock },
              { t: "Transparent", d: "We are open about how our tools work and handle data.", i: Eye },
            ].map((item, idx) => (
              <div key={idx} className="surface-card p-8 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-4 shadow-sm hover:border-signal/30 transition-all group">
                 <div className="size-12 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                    <item.i className="size-6 text-muted-foreground group-hover:text-signal transition-colors" />
                 </div>
                 <h3 className="text-lg font-bold tracking-tight">{item.t}</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg
               prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
               prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-16
               prose-h3:text-xl prose-h3:font-bold prose-h3:tracking-tight prose-h3:mt-12">
            <h2>Our Privacy Commitment</h2>
            <p>
              At Calcuva, we take your privacy seriously. This policy explains how we treat your data when you use our website and tools. The short version: <strong>We don't track you.</strong>
            </p>

            <h3>1. Personal Inputs & Calculations</h3>
            <p>
              Every tool on Calcuva is designed to run locally in your web browser. When you enter numbers into a calculator, that data is processed by your computer, not our servers. We never see, save, or store your personal inputs.
            </p>

            <h3>2. Cookies & Analytics</h3>
            <p>
              We use minimal cookies for basic site functionality and anonymized traffic analysis to understand how many people visit us. We do not use advertising trackers or cross-site tracking cookies.
            </p>

            <h3>3. External Links</h3>
            <p>
               Our site may contain links to other websites. Please be aware that we are not responsible for the privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of each and every website that collects personally identifiable information.
            </p>

            <h3>4. Updates to This Policy</h3>
            <p>
               We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <div className="mt-20 p-8 bg-secondary/50 dark:bg-zinc-900/50 border border-border dark:border-white/5 rounded-2xl text-sm text-muted-foreground/60 italic font-medium">
               Last updated: May 7, 2026. For privacy-related questions, contact us at hello@calcuva.app.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
