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
  title: "Zenith X 33634 — FTC 2026 Engineering Notebook",
  description:
    "Zenith X, FIRST Tech Challenge team 33634: our process, our robot's intake, our team and our season log for FTC 2026.",
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
