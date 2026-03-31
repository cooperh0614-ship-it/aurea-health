import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthRefresher from "./components/AuthRefresher";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Aurea Health: Concierge Health Optimization for High Performers",
  description:
    "Premium concierge health optimization for executives and high-performers. Blood work interpretation, supplement planning, nutrition protocol, and workout programming, all handled for you.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aurea",
  },
  other: {
    "theme-color": "#0a0a0a",
  },
  openGraph: {
    title: "Aurea Health",
    description:
      "Premium concierge health optimization for executives and high-performers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a0a] text-[#f0ebe0]">
        <AuthRefresher />
        <ErrorBoundary>{children}</ErrorBoundary>
        <div aria-hidden="true" className="grain-overlay" />
      </body>
    </html>
  );
}
