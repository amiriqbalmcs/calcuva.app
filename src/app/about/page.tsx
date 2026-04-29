import { Seo } from "@/components/Seo";
import { Calculator, Shield, Zap, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Why We Built Calcuva | Free Calculator Tools",
  description: "Learn about Calcuva, our mission to provide fast, free, and private calculators for finance, health, and business decisions for everyone.",
  alternates: { canonical: "https://calcuva.app/about" },
  openGraph: { title: "About Calcuva", description: "Fast, free and private calculator tools for everyday decisions.", url: "https://calcuva.app/about", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      <Seo 
        title="About Us — Why we built Calcuva"
        description="Learn about Calcuva, our mission to provide fast, free, and private calculators for everyone."
        canonicalPath="/about"
      />

      {/* Hero Header */}
      <header className="relative pt-28 pb-20 border-b border-border/40 bg-secondary/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 4'/%3E%3C/svg%3E")` }} />
        <div className="container-wide max-w-4xl relative z-10">
          <div className="flex items-center justify-center gap-2 mb-8 font-mono text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">
            <Calculator className="size-3.5 text-foreground" />
            <span>Calcuva Platform · About Us</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-center mb-8">
            Simple tools for <br />
            <span className="text-foreground/40 italic">complex life.</span>
          </h1>
          <p className="text-muted-foreground text-center text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Calcuva was built to take the guesswork out of your daily decisions. 
            From health to finance, we make math simple, fast, and entirely private.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-4xl mt-24">
        <div className="space-y-24">
          
          {/* Narrative Section */}
          <section className="grid gap-8">
            <div className="flex items-center gap-4">
               <div className="h-px flex-1 bg-border/60" />
               <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">Our Story</h2>
               <div className="h-px flex-1 bg-border/60" />
            </div>
            <div className="grid gap-6 text-center max-w-3xl mx-auto">
              <p className="text-foreground leading-relaxed text-xl font-medium">
                We noticed that most online calculators were either full of annoying ads or required you to sign up just to see a result. We thought there should be a better way. 
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                Calcuva is our solution: a collection of fast, free tools that help you figure out mortgage payments, health goals, and business numbers—all in one clean, advertising-free space.
              </p>
            </div>
          </section>

          {/* Value Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { t: "Privacy First", d: "We don't see your data. Everything you type stays in your browser.", i: Shield },
              { t: "Fast & Free", d: "No accounts, no paywalls, no waiting. Just click and compute.", i: Zap },
              { t: "Expert Logic", d: "Every tool is backed by professional research and clear guides.", i: Calculator },
              { t: "User Focused", d: "We build tools that we use ourselves every single day.", i: Heart },
            ].map((v, i) => (
              <div key={i} className="surface-card p-8 bg-secondary/5 border-border/40 group hover:border-foreground/20 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <v.i className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">{v.t}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{v.d}</p>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <section className="text-center pt-24 border-t border-border/40">
            <h2 className="text-3xl font-bold mb-8 tracking-tight">Need a specific tool?</h2>
            <p className="text-muted-foreground mb-12 max-w-md mx-auto font-medium">
              We are constantly adding new calculators. If you have an idea for a tool that would make your life easier, we'd love to hear it.
            </p>
            <a href="/contact" className="inline-flex h-14 items-center justify-center px-12 rounded-xl bg-foreground text-background text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-foreground/5">
              Send us a suggestion
            </a>
          </section>

        </div>
      </main>
    </div>
  );
}
