import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { InquiryBag } from "@/components/inquiry-bag";
import { InquiryProvider } from "@/components/inquiry-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { ToastContainer } from "@/components/toast-notification";
import { publicAsset, site } from "@/lib/site";

const rootArtworkStyles = {
  "--asset-artxai": `url("${publicAsset("/artworks/artxai-bg.png")}")`,
  "--asset-festival-garden": `url("${publicAsset("/artworks/festival-garden.jpg")}")`,
  "--asset-peacock-nocturne": `url("${publicAsset("/artworks/peacock-nocturne.jpg")}")`,
  "--asset-turquoise-metamorphosis": `url("${publicAsset("/artworks/turquoise-metamorphosis.jpg")}")`,
} as CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ArtsySanya — Art with a little more feeling",
    template: "%s | ArtsySanya",
  },
  description:
    "Original art, prints, rangoli, and custom creative work by Dubai-based artist & AI engineering student Sanya Wadhawan.",
  openGraph: {
    type: "website",
    siteName: "ArtsySanya",
    title: "ArtsySanya — Made by hand. Imagined without limits.",
    description:
      "Original art, prints, rangoli, and custom creative work by Sanya Wadhawan in Dubai.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={rootArtworkStyles}>
      <head>
        <link rel="stylesheet" href={publicAsset("/vendor/liquid-glass/glass.css")} />
      </head>
      <body className="antialiased">
        <InquiryProvider>
          <ScrollProgress />
          <CustomCursor />
          <ToastContainer />
          <Header />
          {children}
          <footer>
            <div className="wordmark">
              artsy<span>sanya</span>
            </div>
            <p>Made with colour & code in Dubai, UAE.</p>
            <div className="footer-links">
              <a href={site.instagram} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
              <a href={`mailto:${site.email}`}>Email ↗</a>
            </div>
          </footer>
          <InquiryBag />
        </InquiryProvider>
      </body>
    </html>
  );
}
