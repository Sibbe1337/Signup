import "./globals.css";

import { type Metadata } from "next";
import { Inter, Rubik } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

const fontHeading = Rubik({
  variable: "--font-heading",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MoodyTunes - AI-Powered Music Discovery",
  description: "Find the perfect soundtrack for your videos, games, and stories with our intelligent music recommendation engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen font-sans antialiased",
        fontSans.variable,
        fontHeading.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
