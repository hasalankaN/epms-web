// ─────────────────────────────────────────────────────────────────
// Base PDF Export Utility  (uses jspdf + jspdf-autotable)
// ─────────────────────────────────────────────────────────────────

import { jsPDF } from "jspdf";
import autoTable, { type RowInput, type Styles } from "jspdf-autotable";

export interface BasePDFConfig {

  /** Filename prefix – date is appended automatically */
  fileNamePrefix: string;

  /** Page title printed at the top of the document */
  title: string;

  /** Optional subtitle / filter description line */
  subtitle?: string;

  /** Table column header labels */
  headers: string[];

  /** Table data rows (each row must align with headers) */
  rows: string[][];

  /** "portrait" | "landscape" (default: landscape for wide tables) */
  orientation?: "portrait" | "landscape";

  /** jspdf-autotable columnStyles override */
  columnStyles?: Record<number, Partial<Styles>>;

  /** Font size for body rows (default: 8) */
  fontSize?: number;
}

/**
 * Generates and automatically downloads a styled PDF report.
 */
export function generateBasePDF(config: BasePDFConfig): void {
  const {
    fileNamePrefix,
    title,
    subtitle,
    headers,
    rows,
    orientation = "landscape",
    columnStyles = {},
    fontSize = 8,
  } = config;

  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const todayStr = new Date().toLocaleDateString("en-GB");

  // ── Title ──
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 43); // #0F172B
  doc.text(title, margin, 16);

  // ── Subtitle / filter line ──
  let bodyStartY = 22;

  if (subtitle) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(subtitle, margin, 21);
    bodyStartY = 27;
  }

  // ── Generated date (right-aligned) ──
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${todayStr}`, pageWidth - margin, 16, { align: "right" });

  // ── Separator line ──
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(0.3);
  doc.line(margin, bodyStartY, pageWidth - margin, bodyStartY);
  bodyStartY += 3;

  // ── Table ──
  const tableRows: RowInput[] = rows.map((row) => row);

  autoTable(doc, {
    startY: bodyStartY,
    head: [headers],
    body: tableRows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize,
      cellPadding: 2.5,
      font: "helvetica",
      textColor: [15, 23, 43],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [2, 6, 24],   // #020618
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: fontSize,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles,
    didDrawPage: (data) => {
      // ── Footer with page number ──
      const pageCount = (doc.internal as any).getNumberOfPages();
      const pageNum = data.pageNumber;

      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Page ${pageNum} of ${pageCount}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 5,
        { align: "right" }
      );
    },
  });

  // ── Download ──
  const todayDateStr = new Date().toISOString().split("T")[0];

  doc.save(`${fileNamePrefix}_${todayDateStr}.pdf`);
}

// ─────────────────────────────────────────────────────────────────
// Debounced Generator (prevents rapid duplicate exports)
// ─────────────────────────────────────────────────────────────────

export class DebouncedPDFGenerator<T> {
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
