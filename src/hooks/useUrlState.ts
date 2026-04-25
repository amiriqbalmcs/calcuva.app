"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

/**
 * A hook that syncs a piece of state with a URL query parameter.
 * Used for creating shareable, stateful calculator links.
 */
export function useUrlState<T extends string | number>(
  key: string,
  defaultValue: T
): [T, (val: T) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<T>(defaultValue);

  // Sync from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const val = params.get(key);
    if (val !== null) {
      if (typeof defaultValue === "number") {
        setState(Number(val) as T);
      } else {
        setState(val as T);
      }
    }
  }, [key, defaultValue]);

  const updateUrl = useCallback(
    (val: T) => {
      const params = new URLSearchParams(window.location.search);
      params.set(key, val.toString());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, key]
  );

  const setUrlState = (val: T) => {
    setState(val);
    updateUrl(val);
  };

  return [state, setUrlState];
}
