import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Aurea Health: Concierge Health Optimization for High Performers",
  description:
    "Premium concierge health optimization for executives and high-performers. Blood work interpretation, supplement planning, nutrition protocol, and workout programming, all handled for you.",
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
      <body className="min-h-full bg-[#0a0a0a] text-[#f0ebe0]">{children}</body>
    </html>
  );
}
