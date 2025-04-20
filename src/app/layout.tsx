// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// import { GoogleTagManager } from '@next/third-parties/google'

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Marketorix",
//   description: "Transform Your Business with AI",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//       <GoogleTagManager gtmId="GTM-KMS7X44" />
//     </html>
//   );
// }

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { CSPostHogProvider } from './providers'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Marketorix",
  description: "Transform Your Business with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KMS7X44');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Removed gradient div */}
        {/* Removed relative wrapper */}
        {/* <CSPostHogProvider> */} {/* Temporarily commented out PostHog */}
        <noscript>
            <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KMS7X44"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
          </noscript>
          {/* Corrected structure: Removed duplicated noscript and wrapper */}
          {children}
        {/* </CSPostHogProvider> */} {/* Temporarily commented out PostHog */}
      </body>
    </html>
  );
}
