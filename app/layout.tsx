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
  title: "EPMS - Employee Performance Management System",
  description: "Enterprise Employee Performance and Management System",
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
