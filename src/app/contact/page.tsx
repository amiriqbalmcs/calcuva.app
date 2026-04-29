import { Seo } from "@/components/Seo";
import { Mail, ArrowRight, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { SITE_NAME, SITE_DOMAIN, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact Us — Get in Touch | ${SITE_NAME}`,
  description: `Have a question, bug to report, or a tool suggestion? We'd love to hear from you. Reach us at hello@${SITE_DOMAIN}.`,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { title: `Contact ${SITE_NAME}`, description: `Reach us at hello@${SITE_DOMAIN} — we respond within 24-48 hours.`, url: `${SITE_URL}/contact`, siteName: SITE_NAME, images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }] },
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen pb-32">
      <Seo 
        title="Contact — Say Hello"
        description="Have a question or a suggestion for a new tool? We'd love to hear from you."
        canonicalPath="/contact"
      />

      {/* Hero Header */}
      <header className="relative pt-28 pb-20 border-b border-border/40 bg-secondary/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 4'/%3E%3C/svg%3E")` }} />
        <div className="container-wide max-w-4xl relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8 font-mono text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground animate-fade-up">
            <MessageSquare className="size-4 text-foreground" />
            <span>Calcuva Comm-Link · Message Router</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tighter text-center mb-10 animate-fade-up">
            We're here <br />
            <span className="text-foreground/40 italic">to help.</span>
          </h1>
          <p className="text-muted-foreground text-center text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium animate-fade-up" style={{ animationDelay: "100ms" }}>
            Have a bug to report? A tool to suggest? Or just want to say hi? Our communication lines are always open.
          </p>
        </div>
      </header>

      <main className="container-wide max-w-4xl mt-20 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="surface-card p-12 sm:p-20 bg-secondary/5 border-border/40 text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="size-24 rounded-2xl bg-foreground flex items-center justify-center text-background mx-auto mb-10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Mail className="size-10" />
           </div>
           <h2 className="text-4xl font-bold mb-6 tracking-tight">Direct Transmission</h2>
           <p className="text-muted-foreground text-lg mb-12 leading-relaxed max-w-sm mx-auto font-medium">
              We monitor our router every single day. The fastest way to reach us is via encrypted email:
           </p>
           
           <a 
              href={`mailto:hello@${SITE_DOMAIN}`} 
              className="inline-flex items-center gap-6 text-2xl sm:text-4xl font-mono font-bold hover:text-foreground transition-all group/link"
           >
              hello@{SITE_DOMAIN}
              <ArrowRight className="size-8 text-foreground/20 group-hover/link:text-foreground group-hover/link:translate-x-2 transition-all" />
           </a>

           <div className="mt-16 pt-12 border-t border-border/40 grid grid-cols-2 gap-8 max-w-md mx-auto">
              <div className="text-center sm:text-left">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Response Time</div>
                 <div className="text-sm font-bold text-foreground">24-48 Hours</div>
              </div>
              <div className="text-center sm:text-left border-l border-border/40 pl-8">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Office Status</div>
                 <div className="text-sm font-bold text-foreground">Global Remote</div>
              </div>
           </div>
        </div>

        <section className="mt-28 text-center border-t border-border/40 pt-20">
           <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8">Follow our progress</h3>
           <p className="text-muted-foreground mb-12 max-w-lg mx-auto font-medium leading-relaxed">
              We are constantly deploying new calculators to the toolkit. 
              Check back often to see the latest engineering updates.
           </p>
           <a href="/" className="inline-flex h-12 items-center justify-center px-10 rounded-xl border border-border/60 hover:border-foreground hover:bg-secondary/40 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
              Return to Terminal
           </a>
        </section>
      </main>
    </div>
  );
}
