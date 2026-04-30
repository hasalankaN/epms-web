"use client";

import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { useGetResponseLogs } from "@/hooks/api/notifications/useGetResponseLogs";
import type { ResponseLog, ResponseLogStatus } from "@/types/notifications";

// ===== STATUS CONFIG =====

const STATUS_CONFIG: Record<
  ResponseLogStatus,
  { label: string; bg: string; text: string }
> = {
  RESPONDED: { label: "Responded", bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  PENDING: { label: "Pending", bg: "bg-[#FEF9C3]", text: "text-[#CA8A04]" },
  OVERDUE: { label: "Over Due", bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
};

// HH:MM:SS → "2 hrs 30 mins"
function formatDuration(hms: string | null): string {
  if (!hms) {
    return "—";
  }

  const [h, m] = hms.split(":").map(Number);

  const parts: string[] = [];

  if (h > 0) parts.push(`${h} hr${h !== 1 ? "s" : ""}`);

  if (m > 0) parts.push(`${m} min${m !== 1 ? "s" : ""}`);

  return parts.length ? parts.join(" ") : "< 1 min";
}

// ===== PROPS =====

interface ResponseTrackingTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  search?: string;
  status?: string | null;
  dateFrom?: Date | null;
  dateTo?: Date | null;
}

// ===== COMPONENT =====

export function ResponseTrackingTable({
  currentPage,
  onPageChange,
  search,
  status,
  dateFrom,
  dateTo,
}: ResponseTrackingTableProps) {
  const { data, isLoading, isError } = useGetResponseLogs({
    page: currentPage,
    size: 10,
    studentName: search || undefined,
    status: status ?? undefined,
    dateFrom: dateFrom ? dateFrom.toISOString() : undefined,
    dateTo: dateTo ? dateTo.toISOString() : undefined,
  });

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  const columns: Column<ResponseLog>[] = [
    {
      header: "Student",
      accessorKey: "student_name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[160px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B]">
          {item.student_name}
        </div>
      ),
    },
    {
      header: "Receiver",
      accessorKey: "receiver_name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[160px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">
          {item.receiver_name}
        </div>
      ),
    },
    {
      header: "Sent Time",
      accessorKey: "sent_at",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">
          {format(new Date(item.sent_at), "hh:mm a")}
        </div>
      ),
    },
    {
      header: "Response Time",
      accessorKey: "responded_at",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[130px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">
          {item.responded_at
            ? format(new Date(item.responded_at), "hh:mm a")
            : "—"}
        </div>
      ),
    },
    {
      header: "Duration",
      accessorKey: "duration",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[180px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {formatDuration(item.duration)}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[130px]",
      cell: (item) => {
        const config = STATUS_CONFIG[item.status];

        return (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold",
              config.bg,
              config.text,
            )}
          >
            {config.label}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      isError={isError}
      pagination={{
        variant: "simple",
        totalCount: data?.total ?? 0,
        currentPage,
        totalPages,
        onPageChange,
      }}
    />
  );
}
