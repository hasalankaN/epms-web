# Data Export Implementation Guide (PDF & CSV)

This document outlines the architecture and implementation details for the data export system used in the Binzo LMS Admin Web project.

## 1. Prerequisites

The following dependencies must be installed:

```bash
# For PDF Generation
npm install jspdf jspdf-autotable

# For CSV Generation
npm install papaparse
```

## 2. Core Architecture

The system is split into three layers to ensure reusability and performance.

### A. Base PDF Generator (`utils/pdf/generate-base-pdf.ts`)
This is the core engine that handles page layout, styling, and table rendering using `jspdf`.

### B. Base CSV Generator (`utils/export/generate-base-csv.ts`)
CSV exporting follows the same "Data Fetching -> Transformation" pattern but is simpler as it doesn't require layout logic.

```typescript
import Papa from "papaparse";

export interface BaseCSVConfig {
  fileNamePrefix: string;
  tableHeaders: string[];
  tableRows: string[][];
}

export function generateBaseCSV(config: BaseCSVConfig) {
  const { fileNamePrefix, tableHeaders, tableRows } = config;

  const csvData = [tableHeaders, ...tableRows];
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  const todayDateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileNamePrefix}_${todayDateStr}.csv`);
  link.click();
}
```

### C. Debounced Request Handler
To prevent multiple redundant downloads when a user clicks the export button rapidly, we use a `DebouncedGenerator` class. It batches requests and executes only the last one after a 350ms cooling period. This applies to both PDF and CSV exports.

### D. Feature-Specific Generators
Each module should have its own generator that:
1.  Fetches **all** pages of data from the API (ignoring UI pagination).
2.  Transforms the raw API Data into table rows.
3.  Calls the `generateBasePDF` or `generateBaseCSV` with the correct configuration.

---

## 3. Reference Implementation: Products Report

### Data Fetching Strategy
When generating reports (PDF or CSV), we must fetch the entire dataset, not just the current page shown in the UI.

```typescript
async function fetchAllProducts(filters: ProductFilters): Promise<ProductDataType[]> {
  const PAGE_SIZE = 100;
  let allData: ProductDataType[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const response = await api.get(API_ENDPOINTS.products.GET_ALL, {
      params: { ...filters, page: currentPage, size: PAGE_SIZE }
    });
    allData = [...allData, ...response.data.results];
    totalPages = response.data.totalPages;
    currentPage++;
  } while (currentPage <= totalPages);

  return allData;
}
```

### Table Mapping
Map your local types to the array structure required by `jspdf-autotable`.

| Field | Source | Formatting |
| :--- | :--- | :--- |
| Product Name | `p.productName` | Default to "-" |
| Price | `p.price` | `LKR ${val.toLocaleString()}` |
| Stock | `p.quantity` | String conversion |
| Status | `p.stockStatus` | Uppercase |

---

## 4. Best Practices for Future Reports

1.  **Orientation**: Use `landscape` for tables with more than 6 columns to prevent text crowding.
2.  **Column Styling**: Always define `columnStyles` for fixed widths (especially for names/descriptions) and alignment (right-align currency/numbers).
3.  **Naming Convention**: Filenames should follow the pattern: `[Prefix]_from-[Start]_to-[End]_[GenerationDate].pdf`.
4.  **Error Handling**: Wrap the `request()` call in a try/catch in the UI to show a "Toast" notification if the data fetch fails.

## 5. Troubleshooting

- **Large Datasets**: If generating 5000+ rows, the browser might hang. Consider implementing a background-task worker or server-side generation for extreme cases.
- **Font Issues**: The default is `helvetica`. If special currency symbols like "රු" (LKR in Sinhala) are needed, you must load a custom `.ttf` font using `doc.addFont()`.
- **Table Overflow**: If columns overlap, reduce `fontSize` (default 9) or increase the `orientation` to landscape.
