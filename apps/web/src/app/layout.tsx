import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";

import { readContent } from "@decha/content/server";
import { isBlank } from "@decha/content";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await readContent();
  const brand = isBlank(site.brandName) ? "DECHA" : site.brandName;

  return {
    title: isBlank(site.seoTitle) ? brand : site.seoTitle,
    description: isBlank(site.seoDescription) ? undefined : site.seoDescription,
    openGraph: {
      title: isBlank(site.seoTitle) ? brand : site.seoTitle,
      description: isBlank(site.seoDescription) ? undefined : site.seoDescription,
      locale: "tr_TR",
      type: "website",
    },
  };
}

export const viewport = {
  themeColor: "#08080a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
