// ─────────────────────────────────────────────────────────────────
// Base CSV Export Utility
// ─────────────────────────────────────────────────────────────────

export interface BaseCSVConfig {
  fileNamePrefix: string;
  headers: string[];
  rows: string[][];
}

/**
 * Escapes a CSV cell value by wrapping in quotes if it contains
 * commas, quotes, or newlines. Internal quotes are doubled.
 */
function escapeCSVCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

/**
 * Generates and downloads a CSV file from the given config.
 */
export function generateBaseCSV(config: BaseCSVConfig) {
  const { fileNamePrefix, headers, rows } = config;

  const csvLines = [
    headers.map(escapeCSVCell).join(","),
    ...rows.map((row) => row.map(escapeCSVCell).join(",")),
  ];

  const csvContent = csvLines.join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }); // BOM for Excel
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const todayDateStr = new Date().toISOString().split("T")[0];

  link.href = url;
  link.download = `${fileNamePrefix}_${todayDateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────
// Debounced Generator (prevents rapid duplicate exports)
// ─────────────────────────────────────────────────────────────────

export class DebouncedExportGenerator<T> {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingFilters: T | null = null;
  private pendingPromises: Array<{
    resolve: () => void;
    reject: (err: Error) => void;
  }> = [];

  constructor(
    private generatorFn: (filters: T) => Promise<void>,
    private debounceMs: number = 350
  ) {}

  public request(filters: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.pendingFilters = filters;
      this.pendingPromises.push({ resolve, reject });

      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(async () => {
        const runFilters = this.pendingFilters!;

        this.pendingFilters = null;
        this.debounceTimer = null;

        try {
          await this.generatorFn(runFilters);
          this.pendingPromises.forEach((p) => p.resolve());
        } catch (err) {
          this.pendingPromises.forEach((p) => p.reject(err as Error));
        } finally {
          this.pendingPromises = [];
        }
      }, this.debounceMs);
    });
  }
}
