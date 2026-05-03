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
    <footer className="relative mt-24 border-t border-border bg-background overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='currentColor' stroke-width='1' stroke-dasharray='1 4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-wide relative pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand Identity */}
          <div className="lg:col-span-4 max-w-sm">
            <Link href="/" className="inline-block h-8 w-auto mb-6 group">
              <img src="/logo.png" alt={SITE_NAME} className="h-full w-auto object-contain group-hover:scale-105 transition-transform logo-dark-mode" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-medium">
              {SITE_NAME} is your smart toolkit for everyday decisions.
              From financial mastery to health tracking, we provide accurate,
              private, and easy-to-use tools built for everyone.
            </p>
            <div className="flex items-center gap-3">
              <Link href="https://www.facebook.com/calcuva/" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-secondary/50 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Link>
              <Link href="#" className="size-9 rounded-full bg-secondary/50 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </Link>
              <Link href="#" className="size-9 rounded-full bg-secondary/50 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm">
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
              <Link href={`mailto:hello@${SITE_DOMAIN}`} className="size-9 rounded-full bg-secondary/50 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm">
                <Mail className="size-4" />
              </Link>
            </div>
          </div>

          {/* Categorized Tools Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {grouped.map((g) => (
              <div key={g.cat}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8">{g.label}</h4>
                <ul className="space-y-4">
                  {g.items.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/calculators/${c.slug}`} className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all flex items-center group/link">
                        <span className="w-0 group-hover/link:w-2 h-px bg-foreground mr-0 group-hover/link:mr-2 transition-all opacity-0 group-hover/link:opacity-100" />
                        {c.title.replace(/ Calculator$/, "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Authority Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-12 border-y border-border/40">
          {[
            { t: "Private Math", d: "Everything you type stays inside your own browser.", i: Cpu },
            { t: "No Tracking", d: "Your inputs are never saved or sent to any server.", i: Shield },
            { t: "Expert Guides", d: "Detailed strategies explaining the math behind the results.", i: BookOpen },
          ].map((item, idx) => (
            <div key={idx} className="surface-card p-6 border-border/30 bg-secondary/5 group hover:border-foreground/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <item.i className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">{item.t}</h5>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Real Bottom Footer */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-rose-500 transition-colors">Disclaimer</Link>
          </div>
          <div className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest bg-secondary/50 px-4 py-2 rounded-xl border border-border/40">
            © {new Date().getFullYear()} CALCUVA · YOUR SMART TOOLKIT
          </div>
        </div>
      </div>
    </footer>
  );
};
