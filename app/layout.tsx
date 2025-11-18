import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { BreakpointDebug } from "@/components/BreakpointDebug";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bizbo | From Idea to App - Design Thinking Workshops & Digital Product Development",
  description: "Simplify the process of building a market-defining digital web app. Get clarity, validation, and quality-first execution through Design Thinking workshops, prototypes, and expert consultancy. Transform your idea into a product your customers can't live without.",
  keywords: ["design thinking", "digital product development", "prototyping", "UX design", "workshop facilitation", "New Zealand"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://kit.fontawesome.com/ee98d92ca8.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <!-- Start of HubSpot Embed Code -->
        <Script type="text/javascript" id="hs-script-loader" async defer src="//js-ap1.hs-scripts.com/442452565.js"></Script>
        <!-- End of HubSpot Embed Code -->
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          <BreakpointDebug />
        </ThemeProvider>
      </body>
    </html>
  );
}
