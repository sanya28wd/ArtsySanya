import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { InquiryBag } from "@/components/inquiry-bag";
import { InquiryProvider } from "@/components/inquiry-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { ToastContainer } from "@/components/toast-notification";
import { site } from "@/lib/site";

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
    <html lang="en">
      <body className="antialiased">
        <InquiryProvider>
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
