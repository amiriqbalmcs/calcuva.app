import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import { CALCULATORS } from "@/lib/calculators";

const contentDirectory = path.join(process.cwd(), "src/content");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  author: string;
  keywords: string[];
  contentHtml: string;
  image?: string;
  readingTime?: string;
  calculator?: string;
  faqs?: { q: string; a: string }[];
}

export async function getSortedPostsData(subfolder: "blog" | "guides") {
  const dir = path.join(contentDirectory, subfolder);
  if (!fs.existsSync(dir)) return [];
  
  const fileNames = fs.readdirSync(dir).filter(f => f.endsWith(".md"));
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const words = content.split(/\s+/g).length;
      const readingTime = Math.ceil(words / 200) + " min read";

      // For guides, if category is missing and we have a 'calculator' slug, 
      // look up the category from the CALCULATORS registry
      let category = (data.category as string) || "";
      if (subfolder === "guides" && !category && data.calculator) {
        const found = CALCULATORS.find(c => c.slug === data.calculator);
        if (found) category = found.category;
      }

      const excerpt = (data.excerpt as string) || (data.description as string) || "";

      return {
        slug,
        readingTime,
        ...(data as Omit<PostData, "slug" | "contentHtml" | "readingTime" | "excerpt">),
        excerpt,
        category, 
      };
    })
  );

  return allPostsData.sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";
    return dateA < dateB ? 1 : -1;
  });
}

export async function getPostData(subfolder: "blog" | "guides", slug: string): Promise<PostData> {
  const fullPath = path.join(contentDirectory, subfolder, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  const words = content.split(/\s+/g).length;
  const readingTime = Math.ceil(words / 200) + " min read";

  const excerpt = (data.excerpt as string) || (data.description as string) || "";

  return {
    slug,
    contentHtml,
    readingTime,
    ...(data as Omit<PostData, "slug" | "contentHtml" | "readingTime" | "excerpt">),
    excerpt,
  };
}
