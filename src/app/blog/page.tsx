import { getSortedPostsData } from "@/lib/markdown";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research & Editorial — Finance, Health & Business Insights | Calcuva",
  description: "In-depth research, professional guides, and data-driven strategies to help you master your finances, health, and business metrics.",
  alternates: { canonical: "https://calcuva.app/blog" },
  openGraph: {
    title: "Research & Editorial | Calcuva",
    description: "In-depth research, professional guides, and data-driven strategies to help you master your finances, health, and business metrics.",
    url: "https://calcuva.app/blog",
    siteName: "Calcuva",
    images: [{ url: "https://calcuva.app/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://calcuva.app/og-image.png"] },
};



const categoryColors: Record<string, string> = {
   finance: "bg-finance-soft text-finance",
   health: "bg-health-soft text-health",
   business: "bg-business-soft text-business",
   utility: "bg-utility-soft text-utility",
};

export default async function BlogPage() {
   const posts = await getSortedPostsData("blog");

   return (
      <>
         <main className="min-h-screen pt-20 sm:pt-28 pb-24">
            {/* Hero */}
            <section className="container-wide mb-20 text-center sm:text-left">
               <div className="flex items-center justify-center sm:justify-start gap-2 mb-6 font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground animate-fade-up">
                  <BookOpen className="size-3.5 text-signal" />
                  <span>Calcuva Editorial · Expertise & Insight</span>
               </div>
               <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 animate-fade-up">
                  The Science of <br />
                  <span className="text-signal">Better Decisions.</span>
               </h1>
               <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
                  In-depth research, professional guides, and data-driven strategies
                  to help you master your finances, health, and business metrics.
               </p>
            </section>

            {/* Post Grid */}
            <section className="container-wide">
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, i) => (
                     <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col surface-card p-0 overflow-hidden glass hover:border-signal/40 transition-all duration-500 neo-shadow animate-fade-up"
                        style={{ animationDelay: `${200 + i * 100}ms` }}
                     >
                        <div className="aspect-[16/9] bg-secondary flex items-center justify-center relative overflow-hidden">
                           {/* Placeholder for actual image */}
                           <div className="absolute inset-0 bg-gradient-to-br from-signal/10 to-transparent group-hover:scale-110 transition-transform duration-700" />
                           <BookOpen className="size-12 text-muted-foreground/20" />
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                           <div className="flex items-center justify-between mb-4">
                              <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", categoryColors[post.category] || "bg-secondary text-muted-foreground")}>
                                 {post.category}
                              </span>
                              <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-mono font-bold">
                                 <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(post.date).toLocaleDateString()}</span>
                                 <span className="flex items-center gap-1"><Clock className="size-3" /> {post.readingTime}</span>
                              </div>
                           </div>

                           <h3 className="text-xl font-bold mb-4 leading-snug group-hover:text-signal transition-colors line-clamp-2">
                              {post.title}
                           </h3>
                           <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                              {post.excerpt}
                           </p>

                           <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-widest text-signal group-hover:translate-x-1 transition-transform">
                              Read Analysis <ArrowRight className="size-3 ml-2" />
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </section>
         </main>
      </>
   );
}
