import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { AccentScript } from "@/components/theme/accent-script";
import { DEFAULT_ACCENT } from "@/lib/accent";
import { personJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const body = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.mark}®`,
  },
  description: `${site.name} (${site.alternateName}) — ${site.role.toLowerCase()} building platforms, products, and the occasional portfolio.`,
  // Both names indexable (FR-SEO-3 / NFR-SEO-1).
  keywords: [site.name, site.alternateName, site.role, "portfolio", "software engineer"],
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: `${site.name} — ${site.role}`,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-accent={DEFAULT_ACCENT}
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <AccentScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-accent-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer />
        <ChatLauncher />
      </body>
    </html>
  );
}
