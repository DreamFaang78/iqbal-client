import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";

export const metadata: Metadata = {
  title: "HOMMED — Dr. IQBAL'S Homoeopathy Centre | Best Homoeopathic Doctor Kanpur",
  description: "An Advanced Homoeopathic Clinic in Kanpur — HOMMED offers expert HOMOEOPATHY consultation by Dr. Iqbal. Natural, safe treatments for Skin, Hair, Allergies, PCOS, Joint Pain and chronic disorders. Serving Kanpur, Uttar Pradesh.",
  keywords: "homoeopathy kanpur, dr iqbal homoeopathy, homoeopathic doctor kanpur, advanced homoeopathic clinic, natural healing, hommed clinic, best homoeopathy clinic kanpur, skin treatment kanpur, hair fall homoeopathy, HOMOEOPATHY kanpur",
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
      <body className="bg-[#0E1F12] text-white min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
