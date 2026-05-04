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
  ChevronDown
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
};

const getTopTools = (category: CategoryKey) => {
  return CALCULATORS.filter(c => c.category === category).slice(0, 4);
};

export function MegaMenu() {
  const pathname = usePathname();
  const isCalculatorsActive = pathname.startsWith("/calculators") || pathname.startsWith("/category");

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all flex items-center h-8 leading-none",
              pathname === "/" 
                ? "text-foreground bg-secondary shadow-sm ring-1 ring-border/40" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
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
                ? "text-foreground bg-secondary shadow-sm ring-1 ring-border/40" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            )}>
              Tools
              <ChevronDown className="size-3 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-3 p-6 md:w-[800px] md:grid-cols-3 lg:w-[1000px] lg:grid-cols-4">
              {Object.entries(CATEGORIES).map(([key, category]) => {
                const Icon = categoryIcons[key as CategoryKey] || Calculator;
                const tools = getTopTools(key as CategoryKey);
                
                return (
                  <div key={key} className="space-y-3 p-3 rounded-xl hover:bg-secondary/20 transition-colors group/cat">
                    <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                      <div className="p-1.5 rounded-lg bg-muted text-primary/80 group-hover/cat:text-primary group-hover/cat:scale-110 transition-all">
                        <Icon className="size-4" />
                      </div>
                      <Link 
                        href={`/category/${key}`}
                        className="text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors"
                      >
                        {category.label}
                      </Link>
                    </div>
                    
                    <ul className="space-y-1">
                      {tools.map((tool) => (
                        <li key={tool.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/calculators/${tool.slug}`}
                              className="block p-1.5 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all line-clamp-1"
                            >
                              {tool.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="pt-1">
                        <Link
                          href={`/category/${key}`}
                          className="flex items-center gap-1 text-[10px] font-semibold text-primary/80 hover:text-primary transition-colors group/all"
                        >
                          View All
                          <ArrowRight className="size-3 group-hover/all:translate-x-1 transition-transform" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                );
              })}
              
              {/* Featured / Trending Section */}
              <div className="md:col-span-1 lg:col-span-1 border-l border-border/40 pl-4 space-y-4">
                 <div className="space-y-4 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/30 border border-primary/10">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Trending Now</h4>
                    <div className="space-y-3">
                      {[
                        { title: "Typing Test", slug: "typing-speed-test", icon: Zap },
                        { title: "Solar ROI", slug: "solar-roi-simulator-pakistan", icon: TrendingUp },
                        { title: "Age Calc", slug: "age-calculator", icon: Heart },
                      ].map((item) => (
                        <Link 
                          key={item.slug}
                          href={`/calculators/${item.slug}`}
                          className="flex items-center gap-3 group/item"
                        >
                           <div className="size-8 rounded-lg bg-background flex items-center justify-center border border-border group-hover/item:border-primary/40 transition-colors">
                              <item.icon className="size-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                           </div>
                           <span className="text-xs font-medium group-hover/item:text-primary transition-colors">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-primary/10">
                       <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                         Over 80+ precision tools designed for the 2026 digital landscape.
                       </p>
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
                ? "text-foreground bg-secondary shadow-sm ring-1 ring-border/40" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
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
                ? "text-foreground bg-secondary shadow-sm ring-1 ring-border/40" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
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
                ? "text-foreground bg-secondary shadow-sm ring-1 ring-border/40" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
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
                ? "text-foreground bg-secondary shadow-sm ring-1 ring-border/40" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            )}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
