import { getPostData, getSortedPostsData } from "@/lib/markdown";
import { SiteHeader } from "@/components/SiteHeader";
import { Calendar, Clock, ArrowLeft, Calculator, UserRound, ShieldCheck } from "lucide-react";
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
    <>
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
          },
          "publisher": {
            "@type": "Organization",
            "name": "Calcuva",
            "url": "https://calcuva.app",
            "logo": { "@type": "ImageObject", "url": "https://calcuva.app/logo.png" }
          },
          "datePublished": post.date,
          "dateModified": post.date,
          "keywords": post.keywords?.join(", "),
          "articleSection": post.category,
          "inLanguage": "en-US",
        }}
      />
      <main className="min-h-screen pt-20 sm:pt-28 pb-32">
        <div className="container-wide">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all mb-16 group">
             <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Guides
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-16">
            <article className="max-w-3xl">
               <header className="mb-16">
                  <div className="flex items-center gap-6 text-[10px] font-mono font-black text-muted-foreground uppercase tracking-[0.3em] mb-10">
                     <span className={cn("px-2 py-1 rounded ring-1 ring-inset", 
                        post.category === 'finance' ? "bg-finance/5 text-finance ring-finance/20" :
                        post.category === 'health' ? "bg-health/5 text-health ring-health/20" :
                        post.category === 'business' ? "bg-business/5 text-business ring-business/20" :
                        "bg-secondary text-primary ring-border"
                     )}>{post.category}</span>
                     <span className="flex items-center gap-2"><Calendar className="size-3.5" /> {new Date(post.date).toLocaleDateString()}</span>
                     <span className="flex items-center gap-2"><Clock className="size-3.5" /> {post.readingTime}</span>
                     <BlogShareAction title={post.title} excerpt={post.excerpt} slug={post.slug} />
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-12 leading-[1.05] break-words">
                     {post.title}
                  </h1>
                  <div className="flex items-center gap-5 py-8 border-y border-border/40">
                     <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-foreground border border-border/40">
                        <UserRound className="size-6" />
                     </div>
                     <div>
                        <div className="text-sm font-bold text-foreground tracking-tight">{author.name}</div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{author.role}</div>
                     </div>
                  </div>
                  {author.bio && (
                    <div className="mt-6 text-[11px] text-muted-foreground italic leading-relaxed max-w-xl break-words">
                       "{author.bio}"
                    </div>
                  )}
               </header>

               <div 
                 className="prose dark:prose-invert max-w-none"
                 dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
               />

               <footer className="mt-20 pt-10 border-t border-border flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                   {post.keywords?.map(k => (
                     <span key={k} className="text-[10px] font-mono font-bold bg-secondary/50 px-2.5 py-1 rounded-md text-muted-foreground">#{k.replace(' ', '-')}</span>
                   ))}
                </div>
               </footer>
            </article>

             <aside className="no-print">
                <div className="sticky top-28 space-y-6">
                   {activeTool && (
                     <div className="surface-card p-10 bg-secondary/5 border-border/40 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent pointer-events-none" />
                        <div className="relative z-10 space-y-6">
                           <div className="size-12 rounded-2xl bg-background border border-border/60 flex items-center justify-center shadow-sm">
                              <Calculator className="size-6 text-muted-foreground" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-xl font-bold tracking-tight leading-tight">{activeTool.title}</h4>
                              <p className="text-xs text-muted-foreground font-medium leading-relaxed">Calculate and analyze results based on the insights in this guide.</p>
                           </div>
                           <Link 
                              href={`/calculators/${activeTool.slug}`}
                              className="flex items-center justify-center w-full h-12 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-foreground/90 transition-all shadow-xl shadow-black/10"
                           >
                              Open Tool
                           </Link>
                        </div>
                     </div>
                   )}
                   
                   <div className="space-y-4">
                      <BlogShareAction title={post.title} excerpt={post.excerpt} slug={post.slug} variant="sidebar" />
                   </div>
                </div>
             </aside>
          </div>
        </div>
      </main>
    </>
  );
}
