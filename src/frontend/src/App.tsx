import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import GallerySection from "./components/GallerySection";
import HeroSection from "./components/HeroSection";
import MenuSection from "./components/MenuSection";
import Navbar from "./components/Navbar";
import OrderingSection from "./components/OrderingSection";
import ReservationsSection from "./components/ReservationsSection";
import TestimonialsSection from "./components/TestimonialsSection";

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ivory font-body">
      <Navbar scrolled={scrolled} />
      <main>
        <HeroSection />
        <MenuSection />
        <OrderingSection />
        <GallerySection />
        <AboutSection />
        <TestimonialsSection />
        <ReservationsSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.03 55)",
            color: "oklch(0.97 0.025 85)",
            border: "1px solid oklch(0.65 0.18 55)",
          },
        }}
      />
    </div>
  );
}
