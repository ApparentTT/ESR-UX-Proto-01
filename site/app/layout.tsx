import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrototypeBadge } from "@/components/prototype/PrototypeBadge";
import { InertNotice } from "@/components/prototype/InertNotice";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "ESR — website prototype",
  description: "Wireframe prototype of the ESR group website. Content and imagery are placeholder.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** 1440 design width; zoom up to 1920 (x1.333), then widen the content up to 1920 CSS px. */
const LARGE_SCREEN_SCRIPT = `(function(){var d=document.documentElement;function f(){var W=window.innerWidth,z=Math.min(4/3,Math.max(1,W/1440));d.style.setProperty("--ui-zoom",String(z));d.style.setProperty("--page-max",Math.round(Math.min(1920,Math.max(1440,W/z)))+"px")}f();addEventListener("resize",f)})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Large-screen scaling (see html in globals.css); runs before paint so nothing jumps */}
        <script dangerouslySetInnerHTML={{ __html: LARGE_SCREEN_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Icon font: display=block so ligature names never flash as text. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..24,400,0..1,0&display=block"
        />
      </head>
      <body className="min-h-(--full-h) bg-white font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-btn bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
        <InertNotice />
        <PrototypeBadge />
      </body>
    </html>
  );
}
