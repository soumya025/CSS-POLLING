// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSS AGS Feedback Poll | NIT Silchar",
  description:
    "Computer Science Society, NIT Silchar — AGS position student feedback poll.",
  icons: { icon: "/images/css-logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
