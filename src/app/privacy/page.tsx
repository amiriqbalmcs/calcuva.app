import { Seo } from "@/components/Seo";
import { Lock, EyeOff, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Your Data is Safe | Calcuva",
  description: "Calcuva is fully private. All calculations run inside your browser. We never see, store, or sell your data. Learn how we protect your privacy.",
  alternates: { canonical: "https://calcuva.app/privacy" },
  openGraph: { title: "Privacy Policy | Calcuva", description: "All calculations run inside your browser. We never see your data.", url: "https://calcuva.app/privacy", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen pb-32">
      <Seo 
        title="Privacy — Safe and Private Math"
        description="Learn how Calcuva keeps your data safe by processing everything locally on your device."
        canonicalPath="/privacy"
      />

      {/* Hero Header */}
      <header className="relative pt-28 pb-20 border-b border-border/40 bg-secondary/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 4'/%3E%3C/svg%3E")` }} />
        <div className="container-wide max-w-4xl relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8 font-mono text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground animate-fade-up">
            <Lock className="size-4 text-foreground" />
            <span>Calcuva Safety · Privacy Policy</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter text-center mb-10 animate-fade-up">
            Your data is <br />
            <span className="text-foreground/40 italic">strictly yours.</span>
          </h1>
          <p className="text-muted-foreground text-center text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium animate-fade-up" style={{ animationDelay: "100ms" }}>
            We don't collect what you type into our calculators. No trackers, no databases, no cloud storage for your personal inputs.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-4xl mt-16 animate-fade-up" style={{ animationDelay: "200ms" }}>
        {/* Quick Summary Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24">
          {[
            { t: "Data Storage", v: "Browser-Only", d: "Zero server storage", i: EyeOff },
            { t: "Tracking", v: "Disabled", d: "No personal logs", i: ShieldCheck },
            { t: "Access", v: "Private", d: "Local processing", i: Lock },
          ].map((item, idx) => (
            <div key={idx} className="surface-card p-8 bg-secondary/5 border-border/40 group hover:border-foreground/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <item.i className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em]">{item.t}</h5>
              </div>
              <div className="text-2xl font-mono font-bold mb-1 tracking-tight text-foreground">{item.v}</div>
              <p className="text-[11px] text-muted-foreground font-black uppercase tracking-wider">{item.d}</p>
            </div>
          ))}
        </div>

        <div className="space-y-24 prose prose-slate dark:prose-invert max-w-none prose-h2:text-[11px] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.4em] prose-h2:text-muted-foreground prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-4 prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed prose-strong:text-foreground">
          
          <section className="grid gap-8">
            <h2 className="flex items-center gap-4">
               1. How we protect you
            </h2>
            <p className="text-xl font-medium">
              When you use a calculator on Calcuva, the math happens <strong>inside your browser</strong>. Your numbers (like your salary, your debt, or your weight) are never sent to our servers. We never see them, so we can't sell them or lose them.
            </p>
          </section>

          <section className="grid gap-8">
            <h2 className="flex items-center gap-4">
               2. What we "see"
            </h2>
            <p className="font-medium">
              To make the site better, we only look at "big picture" numbers to ensure stability and performance:
            </p>
            <div className="grid gap-4 mt-4">
              {[
                { l: "Popularity", v: "Which tools are used the most" },
                { l: "Performance", v: "How fast the site loads for you" },
                { l: "Device Type", v: "Desktop vs Mobile optimization" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary/5 rounded-xl border border-border/30">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.l}</span>
                  <span className="text-sm font-bold text-foreground">{stat.v}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-10 bg-secondary/10 border-border/40">
            <h2 className="mt-0 mb-6">Ads & Cookies</h2>
            <p className="text-base font-medium">
              We use Google AdSense to show ads. This helps keep Calcuva free for everyone. Google may use "cookies" to show you ads that match your interests. You can turn this off in your <a href="https://www.google.com/settings/ads" rel="nofollow noopener noreferrer" target="_blank" className="text-foreground underline decoration-border/60 underline-offset-4 hover:decoration-foreground transition-all">Google Ad Settings</a>.
            </p>
          </section>

          <section className="pt-24 border-t border-border/40 text-center">
            <h2 className="border-none text-3xl font-bold tracking-tight text-foreground mb-8 lowercase">Questions?</h2>
            <p className="text-xl font-medium mb-12 max-w-xl mx-auto">
              Privacy shouldn't be complicated. If you're worried about how anything on this site works, just send us an email.
            </p>
            <a href="mailto:hello@calcuva.app" className="inline-flex h-14 items-center justify-center px-12 rounded-xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-foreground/5">
              Email Security Team
            </a>
          </section>

        </div>
      </main>
    </div>
  );
}
