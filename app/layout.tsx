import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://asksam.downtownsm.com"),
  title: "Ask Sam | Downtown Santa Monica Guide",
  description:
    "Your friendly guide to everything Downtown Santa Monica — restaurants, shopping, parking, events, and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ask Sam",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#6BC4BB",
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable}`}
      lang="en"
    >
      <head>
        <link
          href="/icons/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link href="/icons/icon-192.png" rel="icon" sizes="192x192" />
        <link href="/icons/icon-512.png" rel="icon" sizes="512x512" />
      </head>
      <body className="antialiased">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
