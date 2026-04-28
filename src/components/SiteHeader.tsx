"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Calculator, History, Clock, Sun, Moon } from "lucide-react";
import { CALCULATORS, CATEGORIES, CategoryKey } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const navItems: { label: string; href: string; key?: CategoryKey }[] = [
  { label: "Home", href: "/" },
  { label: "Finance", href: "/category/finance", key: "finance" },
  { label: "Health", href: "/category/health", key: "health" },
  { label: "Business", href: "/category/business", key: "business" },
  { label: "Education", href: "/category/education", key: "education" },
  { label: "Utility", href: "/category/utility", key: "utility" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Track scroll for "snapping" effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize history on mount
  useEffect(() => {
    const stored = localStorage.getItem('calc_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Track history updates
  useEffect(() => {
    const isCalc = pathname.startsWith('/calculators/');
    if (!isCalc) return;

    const slug = pathname.split('/').filter(Boolean).pop();
    if (!slug || slug === 'calculators') return;

    const stored = JSON.parse(localStorage.getItem('calc_history') || '[]');
    const updated = [slug, ...stored.filter((s: string) => s !== slug)].slice(0, 5);
    
    localStorage.setItem('calc_history', JSON.stringify(updated));
    setHistory(updated);
  }, [pathname]);

  const historyTools = history.map(slug => CALCULATORS.find(c => c.slug === slug)).filter(Boolean);

  return (
    <header 
      className={cn(
        "sticky z-50 transition-all duration-500 ease-in-out",
        scrolled ? "top-0 px-0" : "top-6 px-4 sm:px-6"
      )}
    >
      <div 
        className={cn(
          "container-wide mx-auto backdrop-blur-xl transition-all duration-500 ease-in-out flex items-center justify-between",
          scrolled 
            ? "max-w-full rounded-none border-b border-border bg-background/80 h-14 px-8 shadow-md" 
            : "max-w-7xl border border-border/40 rounded-2xl bg-background/60 h-16 px-6 shadow-xl shadow-black/5"
        )}
      >
        <Link href="/" className="flex items-center group shrink-0" onClick={() => setOpen(false)}>
          <div className="relative h-9 w-auto flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Calcuva" className="h-full w-auto object-contain" />
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.key && pathname === `/category/${item.key}`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
             {historyTools.length > 0 && (
               <div className="relative group/history">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest transition-all">
                     <History className="size-3" />
                     History
                  </button>
                   <div className="absolute right-0 top-full pt-2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover/history:opacity-100 group-hover/history:translate-y-0 group-hover/history:pointer-events-auto transition-all duration-300 z-[100]">
                      <div className="bg-card border border-border rounded-2xl shadow-2xl p-2">
                         <div className="px-3 py-2 border-b border-border mb-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                               <Clock className="size-2.5" /> Recent Tools
                            </span>
                         </div>
                         {historyTools.map((t: any) => (
                           <Link 
                             key={t.slug} 
                             href={`/calculators/${t.slug}`}
                             className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
                           >
                             <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                               <Calculator className="size-4 text-muted-foreground" />
                             </div>
                             <div className="min-w-0">
                                <div className="text-[11px] font-bold truncate">{t.title}</div>
                                <div className="text-[9px] text-muted-foreground font-mono uppercase truncate">{t.category}</div>
                             </div>
                           </Link>
                         ))}
                      </div>
                   </div>
               </div>
             )}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            )}
            <button
              className="inline-flex size-9 items-center justify-center rounded-md hover:bg-secondary"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div 
          className={cn(
            "md:hidden absolute left-4 right-4 backdrop-blur-2xl bg-background/90 border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300",
            scrolled ? "top-16" : "top-20"
          )}
        >
          <nav className="p-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-3 text-sm font-medium rounded-md",
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
