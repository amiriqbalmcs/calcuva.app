import Link from "next/link";
import { CALCULATORS, CATEGORIES, CategoryKey } from "@/lib/calculators";
import { Calculator, Shield, Cpu, BookOpen, Mail, FileCode, ArrowRight } from "lucide-react";
import { SITE_NAME, SITE_DOMAIN } from "@/lib/constants";
import { useState } from "react";
import { EmbedDialog } from "./EmbedDialog";
import Image from "next/image";

export const SiteFooter = () => {
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const footerGroups = [
    {
      title: "Finance & Tax",
      categories: ["finance", "tax"] as CategoryKey[],
    },
    {
      title: "Health & Lifestyle",
      categories: ["health", "lifestyle", "travel"] as CategoryKey[],
    },
    {
      title: "Work & Productivity",
      categories: ["business", "productivity", "utility"] as CategoryKey[],
    },
    {
      title: "Education & Growth",
      categories: ["education", "sustainability", "benchmarks"] as CategoryKey[],
    },
  ];

  return (
    <footer className="relative mt-32 bg-hero text-white overflow-hidden border-t border-white/5">
      {/* Top Glowing Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-signal/50 to-transparent shadow-[0_0_20px_rgba(37,99,235,0.3)]" />

      {/* Large Watermark Background */}
      <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none text-white">
        <Calculator className="size-[600px] -mr-48 -mt-24 rotate-12" />
      </div>

      <div className="container-wide relative pt-24 pb-12">
        {/* Pre-Footer: Simple CTA */}
        <div className="relative mb-24 animate-fade-up">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative group">

            <div className="max-w-xl text-center md:text-left relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Need a specific tool?</h3>
              <p className="text-white/50 text-base sm:text-lg font-medium leading-relaxed">
                If we are missing a calculator you need, let us know. We build new tools based on your feedback every week.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-10 py-5 bg-white text-[#050b2b] rounded-2xl font-black uppercase tracking-[0.15em] text-xs hover:scale-105 transition-all shadow-2xl whitespace-nowrap relative z-10"
            >
              Request a Tool
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand Identity */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block mb-10 group">
              <div className="relative h-10 w-40 flex items-center justify-center group-hover:scale-105 transition-transform brightness-0 invert">
                <Image
                    src="/logo.png"
                    alt={SITE_NAME}
                    fill
                    className="object-contain opacity-90 group-hover:opacity-100 transition-all"
                />
              </div>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-10 font-medium">
              Free and professional online calculators for finance, health, and daily use.
              We make complex math simple for everyone.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://facebook.com/calcuva" target="_blank" rel="noopener noreferrer" className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Link>
              <Link href={`mailto:hello@${SITE_DOMAIN}`} className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <Mail className="size-5" />
              </Link>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-12">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 mb-10 font-mono">{group.title}</h4>
                <div className="space-y-12">
                  {group.categories.map(catKey => {
                    const cat = CATEGORIES[catKey];
                    const items = CALCULATORS.filter(c => c.category === catKey).slice(0, 4);
                    if (items.length === 0) return null;
                    return (
                      <div key={catKey}>
                        <div className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-5 font-mono">{cat.label}</div>
                        <ul className="space-y-4">
                          {items.map((c) => (
                            <li key={c.slug}>
                              <Link href={`/calculators/${c.slug}`} className="text-xs font-bold text-white/70 hover:text-white transition-all flex items-center group/link">
                                <ArrowRight className="size-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-signal" />
                                {c.title.replace(/ Calculator$/, "")}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authority Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-white/5">
          {[
            { t: "Private Math", d: "Data stays in your browser.", i: Cpu },
            { t: "No Tracking", d: "No server-side saving.", i: Shield },
            { t: "Expert Guides", d: "Strategy in every tool.", i: BookOpen },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-5 group">
              <div className="size-14 rounded-[20px] bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-signal/10 group-hover:border-signal/30 transition-all shadow-xl">
                <item.i className="size-6 text-white/30 group-hover:text-signal transition-colors" />
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 mb-1 font-mono">{item.t}</h5>
                <p className="text-xs text-white/50 font-bold tracking-tight">{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-mono">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-rose-500 transition-colors">Disclaimer</Link>
            <button onClick={() => setIsEmbedOpen(true)} className="hover:text-signal transition-colors flex items-center gap-2">
              <FileCode className="size-3" /> Embed
            </button>
          </div>

          <div className="flex items-center gap-5 text-[10px] font-mono text-white/10 tracking-[0.4em] font-black">
            <span className="w-16 h-[1px] bg-white/5" />
            © {new Date().getFullYear()} CALCUVA · PRECISION
            <span className="w-16 h-[1px] bg-white/5" />
          </div>
        </div>
      </div>

      <EmbedDialog isOpen={isEmbedOpen} onClose={() => setIsEmbedOpen(false)} isWholeSite={true} />
    </footer>
  );
};
