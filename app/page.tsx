import Hero from "@/components/Hero";
import Trust from "@/components/Trust";
import Services from "@/components/Services";
import DoctorProfile from "@/components/DoctorProfile";
import WhyChoose from "@/components/WhyChoose";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import AIAssistant from "@/components/AIAssistant";
import PopupManager from "@/components/PopupManager";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Trust />
      <Services />
      <DoctorProfile />
      <WhyChoose />
      <Testimonials />
      <FAQ />
      <Contact />
      
      {/* Floating Interactive Overlays */}
      <AIAssistant />
      <PopupManager />
    </div>
  );
}
