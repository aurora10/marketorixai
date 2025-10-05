// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "./globals.css";
import { CSPostHogProvider } from './providers';
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter'
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Marketorix",
  description: "Transform your business with Marketorix, your expert AI Integrator. We provide custom AI solutions to drive growth and efficiency."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Marketorix",
              "url": "https://www.marketorix.ai",
              "logo": "https://www.marketorix.ai/logo.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+32465811031",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <CSPostHogProvider>
          {children}
        </CSPostHogProvider>
        
        <CookieConsentBanner />
        <AnalyticsWrapper gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>

    </html>
  );
}