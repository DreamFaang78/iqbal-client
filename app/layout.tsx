import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";

export const metadata: Metadata = {
  metadataBase: new URL('https://hommed.org'),
  title: "HOMMED — Dr. IQBAL'S Homoeopathy Centre | Best Homoeopathic Doctor Kanpur",
  description: "An Advanced Homoeopathic Clinic in Kanpur — HOMMED offers expert HOMOEOPATHY consultation by Dr. Iqbal. Natural, safe treatments for Skin, Hair, Allergies, PCOS, Joint Pain and chronic disorders. Serving Kanpur, Uttar Pradesh.",
  keywords: "homoeopathy kanpur, dr iqbal homoeopathy, homoeopathic doctor kanpur, best homeopathic doctor kanpur, advanced homoeopathic clinic, natural healing, hommed clinic, best homoeopathy clinic kanpur, skin treatment kanpur, hair fall homoeopathy, thyroid treatment kanpur, PCOS treatment kanpur, diabetes homeopathy kanpur, joint pain treatment kanpur, dr iqbal quasim kanpur",
  verification: {
    google: "g9FB4jAnR6UT9SVxdAI7RYpdswg7K_Mkd0wH-U", // Add verification fallback from user GSC setup
  },
  openGraph: {
    title: "HOMMED — Dr. IQBAL'S Homoeopathy Centre | Best Homoeopathic Doctor Kanpur",
    description: "An Advanced Homoeopathic Clinic in Kanpur — HOMMED offers expert HOMOEOPATHY consultation by Dr. Iqbal. Natural, safe treatments for Skin, Hair, Allergies, PCOS, Joint Pain and chronic disorders.",
    url: 'https://hommed.org',
    siteName: 'HOMMED Homoeopathy',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'HOMMED — Dr. Iqbal\'s Homoeopathic Centre Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HOMMED — Dr. IQBAL'S Homoeopathy Centre | Best Homoeopathic Doctor Kanpur",
    description: "An Advanced Homoeopathic Clinic in Kanpur — HOMMED offers expert HOMOEOPATHY consultation by Dr. Iqbal. Natural, safe treatments for Skin, Hair, Allergies, PCOS, Joint Pain and chronic disorders.",
    images: ['/logo.png'],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              "name": "HOMMED — Dr. Iqbal's Homoeopathic Centre",
              "alternateName": "HOMMED Homoeopathy",
              "description": "Best Homeopathic clinic in Kanpur run by Dr. Iqbal Quasim. Treats thyroid, PCOS, skin disorders, hair fall, diabetes, joint pain, migraine and more. Online consultations available.",
              "url": "https://www.hommed.org",
              "logo": "https://www.hommed.org/logo.png",
              "image": "https://www.hommed.org/logo.png",
              "telephone": "+91-XXXXXXXXXX",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Civil Lines",
                "addressLocality": "Kanpur",
                "addressRegion": "Uttar Pradesh",
                "postalCode": "208001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "26.4499",
                "longitude": "80.3319"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                  "opens": "09:00",
                  "closes": "20:00"
                }
              ],
              "medicalSpecialty": "Homeopathy",
              "availableService": [
                {"@type": "MedicalTherapy", "name": "Thyroid Treatment (Hypothyroidism / Hyperthyroidism)"},
                {"@type": "MedicalTherapy", "name": "PCOS / Hormonal Imbalance Treatment"},
                {"@type": "MedicalTherapy", "name": "Skin Disorder Treatment — Psoriasis, Eczema, Vitiligo"},
                {"@type": "MedicalTherapy", "name": "Hair Fall & Alopecia Treatment"},
                {"@type": "MedicalTherapy", "name": "Diabetes Integrative Support"},
                {"@type": "MedicalTherapy", "name": "Migraine & Chronic Headache Relief"},
                {"@type": "MedicalTherapy", "name": "Joint Pain, Arthritis & Gout Treatment"},
                {"@type": "MedicalTherapy", "name": "Kidney Stone (Pathri) Treatment Without Surgery"},
                {"@type": "MedicalTherapy", "name": "Anxiety, Depression & Mental Health Support"},
                {"@type": "MedicalTherapy", "name": "Child Health — Immunity, Tonsils, Recurrent Infections"}
              ],
              "hasMap": "https://maps.google.com/?q=Civil+Lines+Kanpur",
              "sameAs": [
                "https://www.hommed.org"
              ],
              "founder": {
                "@type": "Physician",
                "name": "Dr. Iqbal Quasim",
                "jobTitle": "Chief Homeopathic Physician",
                "medicalSpecialty": "Homeopathy",
                "worksFor": {"@type": "MedicalClinic", "name": "HOMMED Homoeopathic Centre"}
              }
            })
          }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
