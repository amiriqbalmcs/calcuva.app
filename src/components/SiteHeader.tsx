"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Calculator, Sun, Moon, ArrowRight } from "lucide-react";
import { CALCULATORS, CATEGORIES, CategoryKey } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { GlobalSearch } from "./GlobalSearch";

import Image from "next/image";

import { MegaMenu } from "./MegaMenu";

const navItems: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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


  const isHomePage = pathname === "/";

  return (
    <header 
      className={cn(
        "z-50 transition-all duration-500 ease-in-out w-full left-0 right-0",
        !scrolled ? "fixed top-6" : "sticky top-0",
        scrolled ? "px-0" : "px-4 sm:px-6"
      )}
    >
      <div 
        className={cn(
          "container-wide mx-auto backdrop-blur-2xl transition-all duration-500 ease-in-out flex items-center",
          scrolled 
            ? "max-w-full rounded-none border-b border-border bg-background/90 h-14 px-6 shadow-md" 
            : "max-w-7xl border border-white/10 dark:border-white/5 bg-hero text-white rounded-2xl h-16 px-6 shadow-2xl shadow-signal/20 dark:shadow-black/40"
        )}
      >
        {/* Left: Logo */}
        <div className="flex-[1] flex items-center gap-3">
          <Link href="/" className="flex items-center group shrink-0" onClick={() => setOpen(false)}>
            <div className={cn(
              "relative h-10 w-40 flex items-center justify-center group-hover:scale-105 transition-transform",
              (!scrolled || theme === 'dark') && "brightness-0 invert"
            )}>
              <Image 
                src="/logo.png" 
                alt="Calcuva" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex flex-[2] items-center justify-center gap-1">
          <MegaMenu />
        </nav>

        {/* Right: Actions */}
        <div className="flex-[1] flex items-center justify-end gap-3 lg:gap-6">
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
             <GlobalSearch variant={!scrolled ? "glass" : "default"} />
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  "size-10 rounded-full flex items-center justify-center transition-all",
                  !scrolled ? "text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <GlobalSearch variant={!scrolled ? "glass" : "default"} />
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  "size-9 rounded-full flex items-center justify-center transition-all",
                  !scrolled ? "text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
            )}
            <button
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-xl transition-all",
                !scrolled ? "text-white hover:bg-white/10" : "hover:bg-secondary"
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div 
          className={cn(
            "md:hidden absolute left-4 right-4 backdrop-blur-2xl bg-background/95 border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300",
            scrolled ? "top-16" : "top-20"
          )}
        >
          <div className="p-4 space-y-8 max-h-[80vh] overflow-y-auto">
            {/* Primary Mobile Nav */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-center px-4 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl border border-border/40 transition-all",
                    pathname === item.href 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary" 
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Categories Mobile Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Browse Tools</h4>
                <div className="h-px flex-1 bg-border/40 ml-4" />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/40 hover:border-primary/40 transition-all"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{cat.label}</span>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">{cat.description}</span>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer Meta */}
            <div className="pt-4 border-t border-border/40 text-center">
              <p className="text-[10px] text-muted-foreground italic">
                Precision Calculations for the 2026 Economy
              </p>
            </div>
          </div>
        </div>
      )}
    </header>


  );
};
