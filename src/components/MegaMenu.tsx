"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  Activity,
  GraduationCap,
  Wrench,
  Briefcase,
  Leaf,
  Zap,
  ArrowRight,
  TrendingUp,
  Heart,
  Calculator,
  Compass,
  LayoutGrid,
  ChevronDown,
  Receipt,
  Keyboard,
  Sparkles,
  Home
} from "lucide-react";
import { CATEGORIES, CategoryKey, CALCULATORS } from "@/lib/calculators";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const categoryIcons: Record<CategoryKey, any> = {
  finance: Banknote,
  health: Activity,
  education: GraduationCap,
  utility: Wrench,
  business: Briefcase,
  sustainability: Leaf,
  benchmarks: Zap,
  tax: Receipt,
  productivity: Keyboard,
  travel: Compass,
  lifestyle: Heart,
};

const getTopTools = (category: CategoryKey) => {
  return CALCULATORS.filter(c => c.category === category).slice(0, 4);
};

export function MegaMenu() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const isCalculatorsActive = pathname.startsWith("/calculators") || pathname.startsWith("/category") || pathname.startsWith("/categories");

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const topMode = !scrolled;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all flex items-center h-8 leading-none",
              pathname === "/"
                ? (topMode ? "text-white bg-white/20 ring-1 ring-white/30" : "text-foreground bg-secondary shadow-sm ring-1 ring-border/40")
                : (topMode ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40")
            )}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="!p-0 !m-0 !h-auto !w-auto !bg-transparent !border-none !ring-0 !shadow-none !outline-none !appearance-none group">
            <div className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all flex items-center gap-1 h-8 leading-none",
              isCalculatorsActive
                ? (topMode ? "text-white bg-white/20 ring-1 ring-white/30" : "text-foreground bg-secondary shadow-sm ring-1 ring-border/40")
                : (topMode ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40")
            )}>
              Tools
              <ChevronDown className="size-3 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-2 p-6 md:w-[850px] md:grid-cols-4 lg:w-[1100px] lg:grid-cols-5 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50">
              <div className="md:col-span-3 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                {Object.entries(CATEGORIES).map(([key, category]) => {
                  const Icon = categoryIcons[key as CategoryKey] || Calculator;
                  const tools = getTopTools(key as CategoryKey);

                  return (
                    <div key={key} className="space-y-2.5 p-2 rounded-xl transition-colors hover:bg-secondary/30">
                      <div className="flex items-center gap-2 border-b border-border/30 pb-1.5">
                        <div className="p-1 rounded-md bg-secondary text-primary/70">
                          <Icon className="size-3.5" />
                        </div>
                        <Link
                          href={`/category/${key}`}
                          className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                        >
                          {category.label}
                        </Link>
                      </div>

                      <ul className="space-y-0.5">
                        {tools.map((tool) => (
                          <li key={tool.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/calculators/${tool.slug}`}
                                className="block py-1 rounded-md text-[10px] font-medium text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all line-clamp-1"
                              >
                                {tool.title.replace(/ Calculator$/, "")}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                        <li className="pt-1">
                          <Link
                            href={`/category/${key}`}
                            className="flex items-center gap-1 text-[9px] font-bold text-primary/60 hover:text-primary transition-colors group/all"
                          >
                            All {category.label} Tools
                            <ArrowRight className="size-2.5 group-hover/all:translate-x-0.5 transition-transform" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Featured / Trending Section */}
              <div className="hidden lg:block border-l border-border/40 pl-6 space-y-4">
                <div className="space-y-4 p-4 rounded-2xl bg-gradient-to-br from-secondary/50 to-background border border-border/50 shadow-inner">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="size-3 text-signal" />
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">Popular Tools</h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "Typing Test", slug: "typing-speed-test", icon: Zap },
                      { title: "Solar ROI", slug: "solar-roi-simulator-pakistan", icon: TrendingUp },
                      { title: "Mortgage", slug: "mortgage-calculator", icon: Home },
                      { title: "Age Calc", slug: "age-calculator", icon: Heart },
                    ].map((item) => (
                      <Link
                        key={item.slug}
                        href={`/calculators/${item.slug}`}
                        className="flex items-center gap-3 group/item"
                      >
                        <div className="size-7 rounded-lg bg-background flex items-center justify-center border border-border group-hover/item:border-signal/30 transition-colors shadow-sm">
                          <item.icon className="size-3.5 text-muted-foreground group-hover/item:text-signal transition-colors" />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-border/40">
                    <Link
                      href="/categories"
                      className="flex items-center justify-between p-2 rounded-xl bg-secondary/50 border border-border/50 hover:border-signal/30 transition-all group/all-cat"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="size-3 text-signal" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground">All Categories</span>
                      </div>
                      <ArrowRight className="size-3 text-muted-foreground group-hover/all-cat:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/guides" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all flex items-center h-8 leading-none",
              pathname === "/guides"
                ? (topMode ? "text-white bg-white/20 ring-1 ring-white/30" : "text-foreground bg-secondary shadow-sm ring-1 ring-border/40")
                : (topMode ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40")
            )}>
              Guides
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all flex items-center h-8 leading-none",
              pathname === "/blog"
                ? (topMode ? "text-white bg-white/20 ring-1 ring-white/30" : "text-foreground bg-secondary shadow-sm ring-1 ring-border/40")
                : (topMode ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40")
            )}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all flex items-center h-8 leading-none",
              pathname === "/about"
                ? (topMode ? "text-white bg-white/20 ring-1 ring-white/30" : "text-foreground bg-secondary shadow-sm ring-1 ring-border/40")
                : (topMode ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40")
            )}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all flex items-center h-8 leading-none",
              pathname === "/contact"
                ? (topMode ? "text-white bg-white/20 ring-1 ring-white/30" : "text-foreground bg-secondary shadow-sm ring-1 ring-border/40")
                : (topMode ? "text-white/70 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40")
            )}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
