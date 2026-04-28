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
    <div className="bg-background min-h-screen pb-20">
      <Seo 
        title="About Us — Why we built Calcuva"
        description="Learn about Calcuva, our mission to provide fast, free, and private calculators for everyone."
        canonicalPath="/about"
      />

      <header className="pt-20 sm:pt-28 pb-16 text-center border-b border-border bg-secondary/10">
        <div className="container-wide max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Simple tools for complex life.</h1>
          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
            Calcuva was built to take the guesswork out of your daily decisions. 
            From health to finance, we make math simple and private.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-3xl mt-16">
        <div className="space-y-16">
          
          <section className="grid gap-6">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We noticed that most online calculators were either full of annoying ads or required you to sign up just to see a result. We thought there should be a better way. 
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Calcuva is our solution: a collection of fast, free tools that help you figure out mortgage payments, health goals, and business numbers—all in one clean place.
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
              <Shield className="size-8 text-signal mb-4" />
              <h3 className="font-bold text-xl mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">We don't see your data. Everything you type stays in your browser.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
              <Zap className="size-8 text-signal mb-4" />
              <h3 className="font-bold text-xl mb-2">Fast & Free</h3>
              <p className="text-sm text-muted-foreground">No accounts, no paywalls, no waiting. Just click and compute.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
              <Calculator className="size-8 text-signal mb-4" />
              <h3 className="font-bold text-xl mb-2">Expert Logic</h3>
              <p className="text-sm text-muted-foreground">Every tool is backed by professional research and clear guides.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
              <Heart className="size-8 text-signal mb-4" />
              <h3 className="font-bold text-xl mb-2">User Focused</h3>
              <p className="text-sm text-muted-foreground">We build tools that we use ourselves every single day.</p>
            </div>
          </div>

          <section className="text-center pt-20 border-t border-border">
            <h2 className="text-3xl font-bold mb-6">Need a specific tool?</h2>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto">
              We are constantly adding new calculators. If you have an idea, we'd love to hear it.
            </p>
            <a href="/contact" className="inline-flex h-12 items-center justify-center px-10 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform">
              Send us a suggestion
            </a>
          </section>

        </div>
      </main>
    </div>
  );
}
