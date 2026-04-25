import { CATEGORIES, CALCULATORS, CategoryKey } from "@/lib/calculators";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Seo } from "@/components/Seo";

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((key) => ({
    key,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  
  if (!(key in CATEGORIES)) {
    notFound();
  }

  const catKey = key as CategoryKey;
  const cat = CATEGORIES[catKey];
  const items = CALCULATORS.filter((c) => c.category === catKey);

  return (
    <div className="container-wide pt-20 sm:pt-28">
      <Seo
        title={`${cat.label} Calculators — Calcuva`}
        description={`${cat.description} Browse ${items.length} free, instant ${cat.label.toLowerCase()} calculators on Calcuva.`}
      />
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono uppercase tracking-widest mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground/80">{cat.label}</span>
      </nav>
      <header className="mb-10 max-w-2xl">
        <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">{cat.code} · CATEGORY</div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">{cat.label} Calculators</h1>
        <p className="text-muted-foreground text-lg">{cat.description}</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {items.map((calc) => <CalculatorCard key={calc.slug} calc={calc} />)}
      </div>
    </div>
  );
}
