import Link from "next/link";
import { CALCULATORS, CATEGORIES, CategoryKey } from "@/lib/calculators";
import { Calculator, Shield, Cpu, BookOpen, Mail } from "lucide-react";
import { SITE_NAME, SITE_DOMAIN } from "@/lib/constants";

export const SiteFooter = () => {
  const grouped = (Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => ({
    cat,
    label: CATEGORIES[cat].label,
    items: CALCULATORS.filter((c) => c.category === cat).slice(0, 6), // Show top 6 per category
  }));

  return (
    <footer className="relative mt-24 border-t border-border bg-secondary/20 overflow-hidden">
      {/* Background Pattern - Consistency with Hero */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-wide relative pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand Identity */}
          <div className="lg:col-span-4 max-w-sm">
            <Link href="/" className="inline-block h-10 w-auto mb-6 group">
              <img src="/logo.png" alt={SITE_NAME} className="h-full w-auto object-contain group-hover:scale-105 transition-transform logo-dark-mode" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {SITE_NAME} is your smart toolkit for everyday decisions.
              From financial mastery to health tracking, we provide accurate,
              private, and easy-to-use tools built for everyone.
            </p>
            <div className="flex items-center gap-3">
              {/* LinkedIn - Custom SVG */}
              <Link href="#" className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-signal hover:border-signal transition-all shadow-sm" title="LinkedIn">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </Link>
              {/* X / Twitter - Custom SVG */}
              <Link href="#" className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-signal hover:border-signal transition-all shadow-sm" title="X (Twitter)">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
              {/* YouTube - Custom SVG */}
              <Link href="#" className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-signal hover:border-signal transition-all shadow-sm" title="YouTube">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </Link>
              <Link href={`mailto:hello@${SITE_DOMAIN}`} className="size-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-signal hover:border-signal transition-all shadow-sm" title="Email Us">
                <Mail className="size-4" />
              </Link>
            </div>
          </div>

          {/* Categorized Tools Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {grouped.map((g) => (
              <div key={g.cat}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground mb-6">{g.label}</h4>
                <ul className="space-y-3">
                  {g.items.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/calculators/${c.slug}`} className="text-xs text-muted-foreground hover:text-signal transition-all flex items-center group/link">
                        <span className="w-0 group-hover/link:w-2 h-px bg-signal mr-0 group-hover/link:mr-2 transition-all opacity-0 group-hover/link:opacity-100" />
                        {c.title.replace(/ Calculator$/, "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Authority Bench */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-y border-border/50">
          <div className="flex gap-4 items-start">
            <div className="size-10 rounded-full bg-signal/10 flex items-center justify-center shrink-0 border border-signal/20">
              <Cpu className="size-5 text-signal" />
            </div>
            <div>
              <h5 className="font-bold text-sm mb-1">Private Math</h5>
              <p className="text-[11px] text-muted-foreground leading-normal">Everything you type stays inside your own browser.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="size-10 rounded-full bg-signal/10 flex items-center justify-center shrink-0 border border-signal/20">
              <Shield className="size-5 text-signal" />
            </div>
            <div>
              <h5 className="font-bold text-sm mb-1">No Tracking</h5>
              <p className="text-[11px] text-muted-foreground leading-normal">Your inputs are never saved or sent to any server.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="size-10 rounded-full bg-signal/10 flex items-center justify-center shrink-0 border border-signal/20">
              <BookOpen className="size-5 text-signal" />
            </div>
            <div>
              <h5 className="font-bold text-sm mb-1">Expert Guides</h5>
              <p className="text-[11px] text-muted-foreground leading-normal">Detailed strategies explaining the math behind the results.</p>
            </div>
          </div>
        </div>

        {/* Real Bottom Footer */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">About Us</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-foreground text-red-400/80">Disclaimer</Link>
            <Link href="/guides" className="hover:text-foreground">Strategy Library</Link>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground tracking-wider bg-background/50 px-3 py-1.5 rounded-full border border-border">
            © {new Date().getFullYear()} CALCUVA · YOUR SMART TOOLKIT
          </div>
        </div>
      </div>
    </footer>
  );
};
