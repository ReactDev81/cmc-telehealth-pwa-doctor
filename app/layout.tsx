import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMC Telehealth PWA",
  description: "A Progressive Web App for CMC Telehealth",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-muted/30 text-foreground"
        suppressHydrationWarning
      >
        <Providers>
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
