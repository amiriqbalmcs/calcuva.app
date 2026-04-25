import { getPostData, getSortedPostsData } from "@/lib/markdown";
import { SiteHeader } from "@/components/SiteHeader";
import { Calendar, Clock, ArrowLeft, Share, Bookmark, Calculator, UserRound } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CALCULATORS } from "@/lib/calculators";
import { Seo } from "@/components/Seo";
import authorsData from "@/content/authors.json";

const authors = authorsData as Record<string, { name: string; role: string; bio: string; avatar?: string }>;

export async function generateStaticParams() {
  const posts = await getSortedPostsData("blog");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData("blog", slug);
  const author = authors[post.author] || authors["Admin"];

  // Intent-based tool discovery: Find a tool that matches the post's category
  const activeTool = CALCULATORS.find(c => c.category === post.category);

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
          "author": {
            "@type": "Person",
            "name": author.name,
            "jobTitle": author.role
          },
          "datePublished": post.date,
          "category": post.category
        }}
      />
      <main className="min-h-screen pt-8 pb-32">
        <div className="container-wide">
          {/* Back Navigation */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-signal transition-colors mb-12 group">
             <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" /> Back to Library
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-16">
            {/* Article Content */}
            <article className="max-w-3xl">
               <header className="mb-12">
                  <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">
                     <span className="px-2 py-0.5 rounded bg-secondary text-primary">{post.category}</span>
                     <span className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(post.date).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1"><Clock className="size-3" /> {post.readingTime}</span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                     {post.title}
                  </h1>
                  <div className="flex items-center gap-4 py-6 border-y border-border">
                     <div className="size-10 rounded-full bg-signal/10 flex items-center justify-center text-signal">
                        <UserRound className="size-5" />
                     </div>
                     <div>
                        <div className="text-xs font-bold">{author.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">{author.role}</div>
                     </div>
                  </div>
                  {author.bio && (
                    <div className="mt-6 text-[11px] text-muted-foreground italic leading-relaxed max-w-xl">
                       "{author.bio}"
                    </div>
                  )}
               </header>

               {/* Markdown Output */}
               <div 
                 className="prose dark:prose-invert max-w-none"
                 dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
               />

               {/* Tags/Footer */}
               <footer className="mt-20 pt-10 border-t border-border flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                   {post.keywords.map(k => (
                     <span key={k} className="text-[10px] font-mono font-bold bg-secondary/50 px-2.5 py-1 rounded-md text-muted-foreground">#{k.replace(' ', '-')}</span>
                   ))}
                </div>
               </footer>
            </article>

            {/* Sticky Sidebar Tool Recommendation */}
            <aside className="no-print">
               <div className="sticky top-28 space-y-8">
                  {activeTool && (
                    <div className="surface-card p-8 glass neo-shadow border-signal/20 bg-gradient-to-b from-signal/5 to-transparent">
                       <div className="flex items-center gap-2 text-signal mb-6">
                          <Calculator className="size-5" />
                          <h3 className="text-xs font-bold uppercase tracking-widest font-mono">Expert Decisions</h3>
                       </div>
                       <h4 className="text-xl font-bold mb-4 leading-tight">Apply theory to your data.</h4>
                       <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                          Ready to run your own scenarios? Our professional-grade <strong>{activeTool.title}</strong> is optimized for precise calculations.
                       </p>
                       <Link 
                         href={`/calculators/${activeTool.slug}`}
                         className="flex items-center justify-between w-full bg-signal text-white px-6 py-4 rounded-xl font-bold text-sm shadow-xl hover:bg-signal/90 transition-all group"
                       >
                         Open Calculator <ArrowLeft className="size-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                  )}

                  <div className="surface-card p-6 bg-secondary/20 border-dotted">
                     <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono mb-4">Share Insights</h3>
                     <div className="flex gap-2">
                        <button className="flex-1 p-2 rounded-lg bg-background border border-border hover:bg-secondary transition flex items-center justify-center"><Share className="size-4" /></button>
                        <button className="flex-1 p-2 rounded-lg bg-background border border-border hover:bg-secondary transition flex items-center justify-center"><Bookmark className="size-4" /></button>
                     </div>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
