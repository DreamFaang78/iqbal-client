import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HOMMED — Dr. IQBAL'S Homeopathy Centre | Best Homeopathic Doctor Kanpur",
  description: "Thak Gaye Baar Baar Dawaiyaan Badalne Se? HOMMED offers advanced homeopathic consultation by Dr. Iqbal — Natural, safe, permanent cures for Skin, Hair, Allergies, PCOS, and chronic disorders in Kanpur.",
  keywords: "homeopathy kanpur, dr iqbal homeopathy, homeopathic doctor kanpur, natural healing, hommed clinic, best homeopathy clinic kanpur, skin treatment kanpur, hair fall homeopathy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0A1628] text-white min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
