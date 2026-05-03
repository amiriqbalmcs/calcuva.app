"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Calculator, Sun, Moon } from "lucide-react";
import { CALCULATORS, CATEGORIES, CategoryKey } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { GlobalSearch } from "./GlobalSearch";

const navItems: { label: string; href: string; key?: CategoryKey }[] = [
  { label: "Home", href: "/" },
  { label: "Finance", href: "/category/finance", key: "finance" },
  { label: "Health", href: "/category/health", key: "health" },
  { label: "Business", href: "/category/business", key: "business" },
  { label: "Sustainability", href: "/category/sustainability", key: "sustainability" },
  { label: "Education", href: "/category/education", key: "education" },
  { label: "Utility", href: "/category/utility", key: "utility" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
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


  return (
    <header 
      className={cn(
        "sticky z-50 transition-all duration-500 ease-in-out",
        scrolled ? "top-0 px-0" : "top-6 px-4 sm:px-6"
      )}
    >
      <div 
        className={cn(
          "container-wide mx-auto backdrop-blur-2xl transition-all duration-500 ease-in-out flex items-center justify-between",
          scrolled 
            ? "max-w-full rounded-none border-b border-border bg-background/70 h-14 px-8 shadow-sm" 
            : "max-w-7xl border border-border/40 rounded-2xl bg-background/40 h-16 px-6 shadow-xl shadow-black/5"
        )}
      >
        <Link href="/" className="flex items-center group shrink-0" onClick={() => setOpen(false)}>
          <div className="relative h-9 w-auto flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Calcuva" className="h-full w-auto object-contain logo-dark-mode" />
          </div>
        </Link>

        <div className="flex items-center gap-3 lg:gap-6">
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.key && pathname === `/category/${item.key}`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all",
                    isActive 
                      ? "text-foreground bg-secondary shadow-sm ring-1 ring-border/40" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 lg:gap-4">
             <GlobalSearch />
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
            <GlobalSearch />
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
