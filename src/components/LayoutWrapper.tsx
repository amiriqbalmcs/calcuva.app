"use client";
import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isEmbed = searchParams.get("embed") === "true";
  const isHomePage = pathname === "/";

  // Force scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isEmbed) {
    return (
      <main className="flex-1 bg-white dark:bg-zinc-950">
        {children}
      </main>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<main className="flex-1">{children}</main>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
