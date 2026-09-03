import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { DynamicBackground } from "@/components/background";
import { Providers } from "./providers";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Histia | Fleets",
  description: "Manage your fleets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      data-glassmorphism="dark"
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <DynamicBackground />
          <div id="app-root" className="flex min-h-full flex-1 flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
