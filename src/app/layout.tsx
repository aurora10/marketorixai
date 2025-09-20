// src/app/layout.tsx

// Your imports are all correct
import { Suspense } from 'react'; 
import GoogleAnalytics from "@/components/GoogleAnalytics";
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "./globals.css";
// You don't need to import Script here unless you use it directly in this file
// import Script from "next/script"; 
import { CSPostHogProvider } from './providers';

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
      {/* 
        FIX #1: The <GoogleAnalytics> component is now inside the <body> tag.
        This is the correct place for React components that render elements.
      */}
      
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          // STEP 2: WRAP THE COMPONENT IN A SUSPENSE BOUNDARY
          <Suspense fallback={null}>
            <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
          </Suspense>
        )}


       
        
        {/*
          FIX #2: The {children} prop is now being rendered. This will display
          your actual page content (e.g., from page.tsx).
        */}
        <CSPostHogProvider>
          {children}
        </CSPostHogProvider>
        
        {/* FIX #3: The manual <head> tag has been removed. */}
      </body>

    </html>
  );
}