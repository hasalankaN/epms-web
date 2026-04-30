"use client";

import { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ScheduledToolbar } from "./views/Scheduled/ScheduledToolbar";
import { ScheduledTable } from "./views/Scheduled/ScheduledTable";

export function ScheduledTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("s_page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [search, setSearch] = useState("");
  const [scheduledOn, setScheduledOn] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);
  const [channel, setChannel] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("s_page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleFilterSelect = (key: string, value: string, label: string) => {
    if (key === "scheduledOn") setScheduledOn(label);
    else if (key === "scheduledFor") setScheduledFor(label);
    else if (key === "channel") setChannel(label);
    else if (key === "recipient") setRecipient(label);
  };

  const handleClearFilters = useCallback(() => {
    setScheduledOn(null);
    setScheduledFor(null);
    setChannel(null);
    setRecipient(null);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <ScheduledToolbar
        search={search}
        onSearchChange={setSearch}
        scheduledOnValue={scheduledOn}
        scheduledForValue={scheduledFor}
        channelValue={channel}
        recipientValue={recipient}
        onFilterSelect={handleFilterSelect}
        onClearFilters={handleClearFilters}
      />
      <ScheduledTable
        currentPage={currentPage}
        onPageChange={handlePageChange}
        channels={channel}
      />
    </div>
  );
}
