import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { OrderResponseItem, GetOrdersParams, GetOrdersResponse, OrderStatus, ProductType } from "@/hooks/api/orders/useGetOrders";
import { generateBaseCSV, DebouncedExportGenerator } from "@/utils/export/generate-base-csv";

// ─────────────────────────────────────────────────────────────────
// Filters (matches the URL params used by Orders)
// ─────────────────────────────────────────────────────────────────

export interface OrderCSVFilters {
  search?: string;
  status?: OrderStatus;
  product_type?: ProductType;
  date?: string;
}

// ─────────────────────────────────────────────────────────────────
// Data Fetching — fetches ALL pages
// ─────────────────────────────────────────────────────────────────

async function fetchAllOrders(filters: OrderCSVFilters): Promise<OrderResponseItem[]> {
  const PAGE_SIZE = 100;
  let allResults: OrderResponseItem[] = [];
  let currentPage = 1;
  let totalPages = 1;

  const apiParams: GetOrdersParams = {
    size: PAGE_SIZE,
    search: filters.search || undefined,
    status: filters.status || undefined,
    product_type: filters.product_type || undefined,
    date: filters.date || undefined,
  };

  do {
    const response = await api.get<{ data: GetOrdersResponse }>(
      API_ENDPOINTS.orders.GET_ALL,
      { params: { ...apiParams, page: currentPage } }
    );

    const pageData = response.data?.data;

    allResults = [...allResults, ...(pageData?.data ?? [])];
    totalPages = pageData?.meta?.totalPages ?? 1;
    currentPage++;
  } while (currentPage <= totalPages);

  return allResults;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";

  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatStatus(status: string | null | undefined): string {
  if (!status) return "-";

  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// ─────────────────────────────────────────────────────────────────
// Report Generator
// ─────────────────────────────────────────────────────────────────

async function runGenerateOrderCSV(filters: OrderCSVFilters): Promise<void> {
  const allOrders = await fetchAllOrders(filters);

  const rows = allOrders.map((item) => [
    formatDate(item.order_date),
    item.order_number || item.order_id,
    item.customer_name || "-",
    item.ordered_product || "-",
    item.product_type === "DIGITAL" ? "Digital" : "Delivery",
    item.ordered_quantity.toString(),
    item.order_amount,
    item.payment_method
      ? item.payment_method
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "-",
    item.commissions,
    formatStatus(item.order_status),
  ]);

  const fileNamePrefix = "Orders_Report";

  generateBaseCSV({
    fileNamePrefix,
    headers: [
      "Order Date",
      "Order ID",
      "Customer Name",
      "Product Name",
      "Product Type",
      "Quantity",
      "Amount",
      "Payment Method",
      "Commissions",
      "Status",
    ],
    rows,
  });
}

// ─────────────────────────────────────────────────────────────────
// Debounced Export (public API)
// ─────────────────────────────────────────────────────────────────

const orderCSVGenerator = new DebouncedExportGenerator(runGenerateOrderCSV);

export function generateOrderCSV(filters: OrderCSVFilters): Promise<void> {
  return orderCSVGenerator.request(filters);
}
