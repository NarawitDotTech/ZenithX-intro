import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zenith X · FTC team 33634",
  description:
    "Engineering notebook of Zenith X, FIRST Tech Challenge team 33634, for the 2026 season.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${code.variable} antialiased`}>
      <body className="min-h-screen">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
