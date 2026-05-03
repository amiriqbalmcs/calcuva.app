"use client";

import { useSearchParams } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Suspense } from "react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";

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
