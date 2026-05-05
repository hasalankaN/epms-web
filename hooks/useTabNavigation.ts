import { useCallback } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

/**
 * useTabNavigation
 *
 * Shared hook for URL-driven tab switching.
 * Automatically resets the `page` parameter to 1 whenever the tab changes,
 * preventing stale pagination from carrying over between tabs.
 *
 * @param defaultTab - The tab value to fall back to when no `tab` param is present.
 * @param validTabs  - Array of valid tab value strings for guard checking.
 *
 * @example
 * const { activeTab, handleTabChange } = useTabNavigation("orders", tabs.map(t => t.value));
 */
export function useTabNavigation<T extends string>(
  defaultTab: T,
  validTabs: readonly T[]
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as T;
  const activeTab = validTabs.includes(currentTab) ? currentTab : defaultTab;

  const handleTabChange = useCallback(
    (tabValue: T) => {
      // Clear all existing filters/params when switching tabs
      const params = new URLSearchParams();

      params.set("tab", tabValue);

      // Always reset to page 1 when switching tabs
      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname]
  );

  return { activeTab, handleTabChange };
}
