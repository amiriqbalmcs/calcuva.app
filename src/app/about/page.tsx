import { Seo } from "@/components/Seo";
import Link from "next/link";
import { Calculator, Shield, Zap, Heart, Plus, Minus, X, Percent, Divide, Activity, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us — Why We Built Calcuva | Free Calculator Tools",
  description: "We built Calcuva to help you figure things out without the stress. Fast, free, and private tools for everyone.",
  alternates: { canonical: "https://calcuva.app/about" },
  openGraph: { title: "About Calcuva", description: "Fast, free and private calculator tools for everyday decisions.", url: "https://calcuva.app/about", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <Seo
        title="About Us — Why we built Calcuva"
        description="We built Calcuva to help you figure things out without the stress. Fast, free, and private tools for everyone."
        canonicalPath="/about"
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
            Our Story
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            We built Calcuva <br />
            <span className="opacity-40 italic font-medium">to solve problems.</span>
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
            Math shouldn't be a barrier. We make it simple, fast, and private so you can make decisions with confidence.
          </p>
        </div>
      </header>

      <main className="container-wide py-32 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that complex calculations shouldn't be reserved for experts. Whether you're calculating interest, tracking your health, or planning a trip, Calcuva provides the tools to help you succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "Privacy First", desc: "Your data never leaves your browser. We don't save or track your calculations.", icon: Shield },
                { title: "Blazing Fast", desc: "No loading screens or server delays. Get results as you type.", icon: Zap },
                { title: "Always Free", desc: "High-quality tools without a price tag or subscription.", icon: Heart },
                { title: "Pure Accuracy", desc: "Built with expert-validated math for results you can trust.", icon: Calculator },
              ].map((item, idx) => (
                <div key={idx} className="surface-card p-8 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-4 shadow-sm hover:border-signal/30 transition-all group">
                  <div className="size-12 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                    <item.icon className="size-6 text-muted-foreground group-hover:text-signal transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl relative overflow-hidden group shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-3xl font-bold tracking-tight leading-tight">Need a customized tool?</h2>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Calcuva is built on feedback. If there's a specific tool or calculation that would make your life easier, let us know. We prioritize tools that our community needs.
                </p>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full h-14 bg-foreground text-background dark:bg-white dark:text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl"
                >
                  Send a Suggestion
                </Link>
              </div>
            </div>

            <div className="p-10 bg-secondary/50 dark:bg-zinc-900/50 border border-border dark:border-white/5 rounded-2xl space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 font-mono">Expert Editorial</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Beyond tools, we provide in-depth research and guides to help you understand the "why" behind the numbers. Check out our latest articles in the <Link href="/blog" className="text-signal hover:underline">Calcuva Research Library</Link>.
              </p>
              <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-signal hover:translate-x-1 transition-all">
                Explore Research <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
