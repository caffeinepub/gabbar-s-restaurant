import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import GallerySection from "./components/GallerySection";
import HeroSection from "./components/HeroSection";
import MenuSection from "./components/MenuSection";
import Navbar from "./components/Navbar";
import OrderingSection from "./components/OrderingSection";
import ReservationsSection from "./components/ReservationsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WhatsAppButton from "./components/WhatsAppButton";
import LoyaltyPage from "./pages/LoyaltyPage";
import TrackOrderPage from "./pages/TrackOrderPage";

const toastOptions = {
  style: {
    background: "oklch(0.14 0.03 55)",
    color: "oklch(0.97 0.025 85)",
    border: "1px solid oklch(0.65 0.18 55)",
  },
};

/* ─── Home Page ─────────────────────────────────────────────── */
function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-charcoal font-body">
      <Navbar scrolled={scrolled} />
      <main>
        <HeroSection />
        <MenuSection />
        <OrderingSection />
        <GallerySection />
        <TestimonialsSection />
        <ReservationsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-center" toastOptions={toastOptions} />
    </div>
  );
}

/* ─── Track Order Page ──────────────────────────────────────── */
function TrackOrderRoute() {
  return (
    <div className="min-h-screen bg-charcoal font-body">
      <Navbar scrolled={true} />
      <main>
        <TrackOrderPage />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-center" toastOptions={toastOptions} />
    </div>
  );
}

/* ─── Loyalty Page ──────────────────────────────────────────── */
function LoyaltyRoute() {
  return (
    <div className="min-h-screen bg-charcoal font-body">
      <Navbar scrolled={true} />
      <main>
        <LoyaltyPage />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-center" toastOptions={toastOptions} />
    </div>
  );
}

/* ─── Admin Page ────────────────────────────────────────────── */
function AdminRoute() {
  return (
    <div className="min-h-screen bg-charcoal font-body">
      <AdminPanel
        onBack={() => {
          window.location.href = "/";
        }}
      />
      <Toaster position="top-center" toastOptions={toastOptions} />
    </div>
  );
}

/* ─── Router Setup ──────────────────────────────────────────── */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const trackOrderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track-order",
  component: TrackOrderRoute,
});

const loyaltyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loyalty",
  component: LoyaltyRoute,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  trackOrderRoute,
  loyaltyRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
