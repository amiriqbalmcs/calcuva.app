import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const targetUrl = url.startsWith("http") ? url : `https://${url}`;
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const html = await response.text();

    const getMetaContent = (html: string, pattern: RegExp) => {
      const match = html.match(pattern);
      return match ? match[1] : null;
    };

    const title = 
      getMetaContent(html, /<meta property="og:title" content="([^"]+)"/i) ||
      getMetaContent(html, /<meta name="twitter:title" content="([^"]+)"/i) ||
      html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";

    const description = 
      getMetaContent(html, /<meta property="og:description" content="([^"]+)"/i) ||
      getMetaContent(html, /<meta name="twitter:description" content="([^"]+)"/i) ||
      getMetaContent(html, /<meta name="description" content="([^"]+)"/i) || "";

    const image = 
      getMetaContent(html, /<meta property="og:image" content="([^"]+)"/i) ||
      getMetaContent(html, /<meta name="twitter:image" content="([^"]+)"/i) || "";

    return NextResponse.json({ title, description, image });
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
