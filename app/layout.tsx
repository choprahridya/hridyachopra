import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CustomCursor } from "@/components/CustomCursor";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "hridyachopra — UI/UX & Brand Designer",
  description: "UI/UX & brand designer crafting considered digital experiences. Portfolio showcasing brand identity, user experience design, and digital strategy work.",
  keywords: ["UI/UX Designer", "Brand Designer", "Portfolio", "User Experience", "Visual Design"],
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body className="antialiased bg-bg text-text-primary">
        <CustomCursor />
        <Nav />
        {children}
      </body>
    </html>
  );
}
