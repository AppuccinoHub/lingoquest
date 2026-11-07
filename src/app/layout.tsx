import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://appuccinohub.github.io/lingoquest";
const previewTitle = "LingoQuest";
const previewBlurb =
  "Turn one world-language lesson into dozens of ACTFL activities. Students practise speaking privately and earn XP.";
const previewImage = {
  url: `${siteUrl}/og.png`,
  width: 1200,
  height: 630,
  alt: "LingoQuest home screen: one lesson in, dozens of speaking activities out.",
  type: "image/png",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LingoQuest — ACTFL-aligned lesson materials & speaking games",
    template: "%s · LingoQuest",
  },
  description:
    "Turn one world-language lesson into dozens of ACTFL-aligned supplemental activities, and give students a private, gamified way to practise speaking.",
  openGraph: {
    title: previewTitle,
    description: previewBlurb,
    url: siteUrl,
    siteName: "LingoQuest",
    type: "website",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: previewTitle,
    description: previewBlurb,
    images: [previewImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#5b3df5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<div className="flex-1" />}>{children}</Suspense>
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
