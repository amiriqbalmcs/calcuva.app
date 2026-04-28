import { Seo } from "@/components/Seo";
import { Mail, ArrowRight, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch | Calcuva",
  description: "Have a question, bug to report, or a tool suggestion? We'd love to hear from you. Reach us at hello@calcuva.app.",
  alternates: { canonical: "https://calcuva.app/contact" },
  openGraph: { title: "Contact Calcuva", description: "Reach us at hello@calcuva.app — we respond within 24-48 hours.", url: "https://calcuva.app/contact", siteName: "Calcuva", images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }] },
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Seo 
        title="Contact — Say Hello"
        description="Have a question or a suggestion for a new tool? We'd love to hear from you."
        canonicalPath="/contact"
      />

      <header className="pt-20 sm:pt-28 pb-16 text-center border-b border-border bg-secondary/10">
        <div className="container-wide max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/20 text-signal text-[10px] font-bold uppercase tracking-widest mb-6">
            <MessageSquare className="size-3" /> Get in touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">We're here to help.</h1>
          <p className="text-muted-foreground text-lg sm:text-xl">
            Have a bug to report? A tool to suggest? Or just want to say hi?
          </p>
        </div>
      </header>

      <main className="container-wide max-w-2xl mt-16">
        <div className="p-10 sm:p-16 rounded-[40px] bg-secondary/30 border border-border text-center">
           <div className="size-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground mx-auto mb-8 shadow-xl">
              <Mail className="size-10" />
           </div>
           <h2 className="text-3xl font-bold mb-4">Send us an email</h2>
           <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              We monitor our inbox every single day. The best way to reach us is via email:
           </p>
           
           <a 
              href="mailto:hello@calcuva.app" 
              className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold hover:text-signal transition-colors group"
           >
              hello@calcuva.app
              <ArrowRight className="size-8 group-hover:translate-x-2 transition-transform" />
           </a>

           <div className="mt-12 pt-10 border-t border-border flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="text-left">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Response Time</div>
                 <div className="text-sm font-bold text-foreground">Within 24-48 hours</div>
              </div>
              <div className="text-left">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Office Status</div>
                 <div className="text-sm font-bold text-foreground">Fully Remote · Global</div>
              </div>
           </div>
        </div>

        <section className="mt-20 text-center">
           <h3 className="text-xl font-bold mb-4">Follow our progress</h3>
           <p className="text-muted-foreground mb-8">
              We are constantly building new calculators to help you master your math. 
              Check back often for new updates!
           </p>
           <a href="/" className="text-sm font-bold uppercase tracking-widest text-signal hover:underline">
              Back to Toolkit
           </a>
        </section>
      </main>
    </div>
  );
}
