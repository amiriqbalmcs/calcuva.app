import { Seo } from "@/components/Seo";
import Link from "next/link";
import { Mail, ArrowRight, MessageSquare, Calculator, Sparkles, Shield, Plus, Minus, X, Percent, Divide, Activity, Clock, ShieldCheck, Zap } from "lucide-react";
import type { Metadata } from "next";
import { SITE_NAME, SITE_DOMAIN, SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Contact Us — Get in Touch | ${SITE_NAME}`,
  description: `We'd love to hear from you. Send us a message about a bug, a suggestion, or just to say hi.`,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { title: `Contact ${SITE_NAME}`, description: `Reach us at hello@${SITE_DOMAIN} — we respond within 24-48 hours.`, url: `${SITE_URL}/contact`, siteName: SITE_NAME, images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }] },
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <Seo
        title="Contact — Say Hello"
        description="Got a question or a suggestion for a new tool? We're here to help."
        canonicalPath="/contact"
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
            Get in Touch
          </div>
          <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
            Have a question? <br />
            <span className="opacity-40 italic font-medium">We're all ears.</span>
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
            Whether you've spotted a bug, have a tool suggestion, or just want to say hello, we respond to every message.
          </p>
        </div>
      </header>

      <main className="container-wide py-32 animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 items-start">
          {/* Left: Contact Info & Channels */}
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-6 shadow-sm hover:border-signal/30 transition-all group">
                <div className="size-14 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                  <Mail className="size-7 text-muted-foreground group-hover:text-signal transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">Direct Email</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">For business inquiries, partnerships, or detailed bug reports.</p>
                  <Link href={`mailto:hello@${SITE_DOMAIN}`} className="text-sm font-black uppercase tracking-widest text-signal hover:underline">hello@{SITE_DOMAIN}</Link>
                </div>
              </div>
              <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl space-y-6 shadow-sm hover:border-signal/30 transition-all group">
                <div className="size-14 rounded-2xl bg-secondary dark:bg-zinc-900 flex items-center justify-center border border-border dark:border-white/10 group-hover:bg-signal/10 transition-all">
                  <MessageSquare className="size-7 text-muted-foreground group-hover:text-signal transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">Social Connect</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">Follow us for updates, new tool announcements, and tips.</p>
                  <Link href="https://facebook.com/calcuva" target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest text-signal hover:underline">Facebook Community</Link>
                </div>
              </div>
            </div>

            <div className="p-12 bg-secondary/50 dark:bg-zinc-900/50 border border-border dark:border-white/5 rounded-2xl space-y-8">
              <div className="flex items-center gap-4">
                <Sparkles className="size-6 text-signal" />
                <h2 className="text-2xl font-bold tracking-tight">Our Support Promise</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  { t: "Fast Response", d: "We aim to reply to all inquiries within 24-48 business hours.", i: Clock },
                  { t: "Human Support", d: "You'll always talk to a real person from our core engineering team.", i: ShieldCheck },
                  { t: "Feature Priority", d: "User suggestions are moved to the top of our development queue.", i: Zap },
                  { t: "Data Security", d: "Your contact info is never shared or sold. We hate spam too.", i: Shield },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <item.i className="size-4 text-signal/60" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">{item.t}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar Meta */}
          <aside className="space-y-12">
            <div className="surface-card p-10 bg-surface border border-border dark:border-white/5 rounded-2xl relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="size-16 rounded-2xl bg-secondary dark:bg-zinc-900 border border-border dark:border-white/10 flex items-center justify-center shadow-xl">
                  <Calculator className="size-8 text-muted-foreground/40 group-hover:text-signal transition-colors" />
                </div>
                <div className="space-y-3">
                  <div className="text-[9px] font-mono font-black text-signal uppercase tracking-[0.3em]">Pro Tip</div>
                  <h4 className="text-2xl font-bold tracking-tight leading-tight">Can't find a tool?</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    We add 2-3 new calculators every week based on user requests. Tell us what you're working on!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 text-center space-y-4">
              <p className="text-xs text-muted-foreground italic font-medium leading-relaxed">
                "Calcuva was built to solve our own frustrations with complex math. Your feedback helps us make it better for everyone."
              </p>
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 font-mono">— The Calcuva Team</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
