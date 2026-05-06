export function formatChatSidebarTime(dateString: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  if (diffHours < 24) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (diffDays === 1) return "Yesterday";

  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getMessageGroupDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - messageDay.getTime()) / 86400000
  );

  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "YESTERDAY";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  }).toUpperCase();
}

export function getAttachmentFileType(mimeType: string): "pdf" | "image" | "doc" | "other" {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("image")) return "image";

  if (
    mimeType.includes("word") ||
    mimeType.includes("doc") ||
    mimeType.includes("text")
  ) {
    return "doc";
  }

  return "other";
}
