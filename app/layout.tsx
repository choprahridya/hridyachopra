import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CustomCursor } from "@/components/CustomCursor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "hridyachopra — UI/UX & Brand Designer",
  description: "UI/UX & brand designer crafting considered digital experiences. Portfolio showcasing brand identity, user experience design, and digital strategy work.",
  keywords: ["UI/UX Designer", "Brand Designer", "Portfolio", "User Experience", "Visual Design", "Design Systems"],
  authors: [{ name: "Hridya Chopra" }],
  creator: "Hridya Chopra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hridyachopra.com",
    title: "hridyachopra — UI/UX & Brand Designer",
    description: "UI/UX & brand designer crafting considered digital experiences",
    siteName: "hridyachopra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "hridyachopra — UI/UX & Brand Designer",
    description: "UI/UX & brand designer crafting considered digital experiences",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-bg-primary text-text-primary">
        <CustomCursor />
        <Nav />
        {children}
      </body>
    </html>
  );
}
