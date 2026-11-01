import { api } from "@/lib/axios";

/**
 * Downloads a file from an API endpoint, extracting filename from Content-Disposition header.
 */
export async function downloadFileFromEndpoint(url: string, fallbackFilename = "downloaded-file"): Promise<void> {
  const response = await api.get(url, {
    responseType: "blob",
  });

  const blob = new Blob([response.data]);
  let filename = fallbackFilename;

  const disposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
  if (disposition && typeof disposition === "string") {
    const filenameMatch = disposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i);
    if (filenameMatch && filenameMatch[1]) {
      filename = decodeURIComponent(filenameMatch[1].trim());
    }
  }

  // Trigger client download
  if (typeof window !== "undefined") {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  }
}

