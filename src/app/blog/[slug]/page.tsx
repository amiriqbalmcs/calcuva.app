import { getPostData, getSortedPostsData } from "@/lib/markdown";
import { SiteHeader } from "@/components/SiteHeader";
import { Calendar, Clock, ArrowLeft, Calculator, UserRound, ShieldCheck, Plus, Percent, Divide, Activity as ActivityIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CALCULATORS } from "@/lib/calculators";
import { Seo } from "@/components/Seo";
import { BlogShareAction } from "@/components/BlogShareAction";
import authorsData from "@/content/authors.json";
import type { Metadata } from "next";

const authors = authorsData as Record<string, { name: string; role: string; bio: string; avatar?: string }>;
import { SITE_URL } from "@/lib/constants";

const BASE_URL = SITE_URL;

export async function generateStaticParams() {
  const posts = await getSortedPostsData("blog");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData("blog", slug);
  const title = `${post.title} | Calcuva Research`;
  const description = post.excerpt || post.title;
  const url = `${BASE_URL}/blog/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Calcuva",
      type: "article",
      publishedTime: post.date,
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData("blog", slug);
  const author = authors[post.author] || authors["Admin"];

  const activeTool = post.calculator 
    ? CALCULATORS.find(c => c.slug === post.calculator) 
    : CALCULATORS.find(c => c.category === post.category);

  return (
    <div className="bg-background min-h-screen">
      <Seo 
        title={`${post.title} | Calcuva Research`}
        description={post.excerpt}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "url": `https://calcuva.app/blog/${post.slug}`,
          "image": "https://calcuva.app/og-image.png",
          "author": {
            "@type": "Person",
            "name": author.name,
            "jobTitle": author.role,
            "url": "https://calcuva.app/about"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Calcuva",
            "url": "https://calcuva.app",
            "logo": { "@type": "ImageObject", "url": "https://calcuva.app/logo.png" }
          },
          "datePublished": new Date(post.date).toISOString(),
          "dateModified": new Date(post.date).toISOString(),
          "keywords": post.keywords?.join(", "),
          "articleSection": post.category,
          "inLanguage": "en-US",
        }}
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
            <div className="absolute top-[10%] left-[10%] rotate-12"><Plus className="size-20" /></div>
            <div className="absolute top-[15%] right-[15%] -rotate-45"><Percent className="size-16" /></div>
            <div className="absolute bottom-[20%] left-[15%] -rotate-12"><Divide className="size-20" /></div>
            <div className="absolute bottom-[10%] right-[10%] rotate-12"><ActivityIcon className="size-24" /></div>
         </div>

         <div className="container-wide relative z-10 text-hero-text">
            <Link href="/blog" className="inline-flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all mb-12 group no-print">
               <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Research
            </Link>

            <div className="max-w-4xl mx-auto text-center">
               <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.3em] mb-10">
                  <span className={cn("px-2.5 py-1 rounded-lg border border-white/20 backdrop-blur-md capitalize text-white font-bold", 
                     post.category === 'finance' ? "bg-finance/40" :
                     post.category === 'health' ? "bg-health/40" :
                     post.category === 'business' ? "bg-business/40" :
                     post.category === 'sustainability' ? "bg-sustainability/40" :
                     post.category === 'utility' ? "bg-utility/40" :
                     "bg-white/20"
                  )}>{post.category}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap"><Calendar className="size-3.5 opacity-60" /> {new Date(post.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap"><Clock className="size-3.5 opacity-60" /> {post.readingTime}</span>
               </div>
               <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-[0.95] mb-12 break-words">
                  {post.title}
               </h1>
               <div className="flex items-center justify-center gap-5 pt-10 border-t border-white/5 max-w-xl mx-auto">
                  <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-2xl backdrop-blur-xl">
                     <UserRound className="size-6 opacity-60" />
                  </div>
                  <div className="text-left">
                     <div className="text-sm font-bold text-white tracking-tight">{author.name}</div>
                     <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] font-mono">{author.role}</div>
                  </div>
                  <div className="ml-auto">
                     <BlogShareAction title={post.title} excerpt={post.excerpt} slug={post.slug} />
                  </div>
               </div>
            </div>
         </div>
      </header>

      <main className="container-wide py-24 animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-20 items-start">
          <article className="max-w-3xl mx-auto lg:mx-0">
             <div 
               className="prose prose-zinc dark:prose-invert max-w-none prose-lg
               prose-p:text-muted-foreground prose-p:font-medium prose-p:leading-relaxed
               prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-16
               prose-h3:text-xl prose-h3:font-bold prose-h3:tracking-tight prose-h3:mt-12
               prose-blockquote:border-signal prose-blockquote:bg-surface prose-blockquote:rounded-2xl prose-blockquote:px-8 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:font-medium"
               dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
             />

             <footer className="mt-24 pt-12 border-t border-border dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex flex-wrap items-center gap-3">
                 {post.keywords?.map(k => (
                   <span key={k} className="text-[10px] font-mono font-black bg-surface border border-border dark:border-white/5 px-3 py-1.5 rounded-xl text-muted-foreground/60">#{k.replace(' ', '-')}</span>
                 ))}
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 font-mono">
                 Share Research <BlogShareAction title={post.title} excerpt={post.excerpt} slug={post.slug} />
              </div>
             </footer>
          </article>

           <aside className="no-print sticky top-32 space-y-8">
              {activeTool && (
                <div className="bg-surface border border-border dark:border-white/5 rounded-2xl p-10 relative overflow-hidden group shadow-2xl">

                   <div className="relative z-10 space-y-8">
                      <div className="size-16 rounded-2xl bg-secondary dark:bg-zinc-900 border border-border dark:border-white/10 flex items-center justify-center shadow-xl">
                         <Calculator className="size-8 text-muted-foreground/40 group-hover:text-signal transition-colors" />
                      </div>
                      <div className="space-y-3">
                         <div className="text-[9px] font-mono font-black text-signal uppercase tracking-[0.3em]">Tool Recommendation</div>
                         <h4 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-signal transition-colors">{activeTool.title}</h4>
                         <p className="text-sm text-muted-foreground font-medium leading-relaxed">Implement the findings of this research directly with our precision tool.</p>
                      </div>
                      <Link 
                         href={`/calculators/${activeTool.slug}`}
                         className="flex items-center justify-center w-full h-14 bg-foreground text-background dark:bg-white dark:text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl"
                      >
                         Open Analytics Tool
                      </Link>
                   </div>
                </div>
              )}
              
              <div className="p-8 bg-secondary/50 dark:bg-zinc-900/50 border border-border dark:border-white/5 rounded-2xl space-y-4">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 font-mono">Research Disclosure</h5>
                 <p className="text-xs text-muted-foreground/40 leading-relaxed font-medium">
                    This editorial analysis is for informational purposes. Consult with a qualified professional before making significant financial or health decisions.
                 </p>
              </div>
           </aside>
        </div>
      </main>
    </div>
  );
}
