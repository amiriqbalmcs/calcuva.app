import { getSortedPostsData } from "@/lib/markdown";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen, Plus, Percent, Divide, Activity as ActivityIcon } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";
import { Seo } from "@/components/Seo";
import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Research & Editorial — Finance, Health & Business Insights | Calcuva",
  description: "In-depth research, professional guides, and data-driven strategies to help you master your finances, health, and business metrics.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Research & Editorial | Calcuva",
    description: "In-depth research, professional guides, and data-driven strategies to help you master your finances, health, and business metrics.",
    url: `${SITE_URL}/blog`,
    siteName: "Calcuva",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: [`${SITE_URL}/og-image.png`] },
};

export default async function BlogPage() {
   const posts = await getSortedPostsData("blog");

   return (
      <div className="bg-background min-h-screen">
         <Seo 
            title="Research & Editorial — Expert Insights"
            description="In-depth research and data-driven strategies for better decisions."
            canonicalPath="/blog"
         />

         {/* Immersive Header - Elite Style */}
         <header className="relative min-h-[70vh] lg:min-h-[80vh] flex flex-col items-center justify-start border-b border-border/50 bg-hero overflow-hidden pt-32 sm:pt-48 pb-20">
            {/* Dynamic Texture Layer */}
            <div className="absolute inset-0 z-0">
               <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
               <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 dark:bg-indigo-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

               {/* Precision Pattern Overlay */}
               <div 
                  className="absolute inset-0 opacity-[0.08] dark:opacity-[0.03]" 
                  style={{ 
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px' 
                  }} 
               />
            </div>

            {/* Rich Icon Watermarks */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04] dark:opacity-[0.02] text-white dark:text-muted-foreground">
               <div className="absolute top-[10%] left-[10%] rotate-12"><Plus className="size-20 sm:size-32" /></div>
               <div className="absolute top-[15%] right-[15%] -rotate-45"><Percent className="size-16 sm:size-24" /></div>
               <div className="absolute bottom-[20%] left-[15%] -rotate-12"><Divide className="size-20 sm:size-28" /></div>
               <div className="absolute bottom-[10%] right-[10%] rotate-12"><ActivityIcon className="size-24 sm:size-36" /></div>
            </div>

            <div className="container-wide max-w-5xl relative z-10 text-hero-text text-center">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-up">
                  Calcuva Research
               </div>
               <h1 className="text-6xl sm:text-9xl font-bold tracking-tighter mb-8 animate-fade-up leading-[0.9]">
                  Expert Research <br />
                  <span className="opacity-40 italic font-medium">& Editorial.</span>
               </h1>
               <p className="text-lg sm:text-2xl font-medium text-white/70 dark:text-muted-foreground max-w-2xl mx-auto animate-fade-up leading-relaxed">
                  In-depth analysis, professional guides, and data-driven strategies to help you master your finances, health, and business metrics.
               </p>
            </div>
         </header>

         <main className="container-wide py-32 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {posts.map((post) => (
                  <Link 
                     key={post.slug} 
                     href={`/blog/${post.slug}`}
                     className="group flex flex-col bg-surface border border-border dark:border-white/5 rounded-2xl p-10 hover:border-signal/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
                     <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className={cn("px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest capitalize",
                           post.category === 'finance' ? "bg-finance/10 text-finance border-finance/20" :
                           post.category === 'health' ? "bg-health/10 text-health border-health/20" :
                           post.category === 'business' ? "bg-business/10 text-business border-business/20" :
                           post.category === 'sustainability' ? "bg-sustainability/10 text-sustainability border-sustainability/20" :
                           post.category === 'utility' ? "bg-utility/10 text-utility border-utility/20" :
                           "bg-secondary text-primary border-border"
                        )}>
                           {post.category}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-muted-foreground/50">
                           <Calendar className="size-3" /> {new Date(post.date).toLocaleDateString()}
                        </div>
                     </div>
                     <h3 className="text-2xl font-bold group-hover:text-signal transition-colors leading-tight mb-4 relative z-10">{post.title}</h3>
                     <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-10 font-medium relative z-10">{post.excerpt}</p>
                     <div className="mt-auto flex items-center justify-between pt-8 border-t border-border/10 relative z-10">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover:text-signal transition-all">
                           Read Analysis <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground/30">
                           <Clock className="size-3" /> {post.readingTime}
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </main>
      </div>
   );
}
