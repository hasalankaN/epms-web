import { Inter } from "next/font/google";

import type { Metadata } from "next";

import Providers from "@/components/providers/ReactQueryProvider";
import "./globals.css";
import "@/public/icons.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BINZO",
  description: "Binzo Learning Management System Admin Panel",
  icons: {
    icon: "/mobile-logo.svg",
    shortcut: "/mobile-logo.svg",
    apple: "/mobile-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
