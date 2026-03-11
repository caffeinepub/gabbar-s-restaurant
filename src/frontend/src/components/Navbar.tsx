import { Menu, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IMAGES } from "../assets/images";

interface NavbarProps {
  scrolled: boolean;
}

const WA_URL =
  "https://wa.me/917983711781?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order%20at%20Gabbar%27s!";

const navLinks = [
  { label: "Menu", href: "/#menu", isRoute: false, anchor: "#menu" },
  { label: "Order", href: "/#order", isRoute: false, anchor: "#order" },
  { label: "Track Order", href: "/track-order", isRoute: true, anchor: null },
  { label: "Loyalty", href: "/loyalty", isRoute: true, anchor: null },
  {
    label: "Reservations",
    href: "/#reservations",
    isRoute: false,
    anchor: "#reservations",
  },
  { label: "Gallery", href: "/#gallery", isRoute: false, anchor: "#gallery" },
  { label: "Contact", href: "/#contact", isRoute: false, anchor: "#contact" },
];

export default function Navbar({ scrolled }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (link: (typeof navLinks)[0]) => {
    setMobileOpen(false);
    if (link.isRoute) {
      window.location.href = link.href;
    } else if (link.anchor) {
      const isHome =
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/gabbars-restaurant") ||
        window.location.pathname.endsWith("/gabbars-restaurant/");
      if (isHome) {
        const el = document.querySelector(link.anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = link.href;
      }
    }
  };

  const handleLogoClick = () => {
    setMobileOpen(false);
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md shadow-2xl"
          : "bg-charcoal/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        {/* Logo */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group text-left"
          data-ocid="nav.link"
        >
          <img
            src={IMAGES.logo}
            alt="Gabbar's Restaurant Logo"
            className="h-12 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-gold text-xl font-bold tracking-wide leading-none">
              Gabbar's
            </span>
            <span className="font-body text-saffron text-[10px] tracking-[0.1em] italic mt-0.5 group-hover:text-gold transition-colors">
              Ab Goli Nahi... Khaana Kha!
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "-")}.link`}
                onClick={() => handleLinkClick(link)}
                className="font-body text-xs tracking-wider uppercase text-cream-text hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-saffron transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
          <li>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="nav.whatsapp.button"
              className="font-body text-xs tracking-wider uppercase px-4 py-2 bg-[#25D366] text-white hover:bg-[#1fb058] transition-all duration-300 rounded-sm font-semibold flex items-center gap-1.5"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </li>
          <li>
            <button
              type="button"
              data-ocid="nav.admin.link"
              onClick={() => {
                window.location.href = "/admin";
              }}
              className="font-body text-xs tracking-widest uppercase text-cream-text/35 hover:text-cream-text/70 transition-colors duration-300"
            >
              Admin
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden text-cream-text hover:text-gold transition-colors p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-charcoal/98 backdrop-blur-md border-t border-saffron/20 overflow-hidden"
          >
            <ul className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/\s+/g, "-")}.link`}
                    onClick={() => handleLinkClick(link)}
                    className="font-body text-sm tracking-widest uppercase text-cream-text hover:text-gold transition-colors block w-full text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="nav.mobile.whatsapp.button"
                  className="font-body text-sm tracking-wider uppercase px-5 py-2.5 bg-[#25D366] text-white hover:bg-[#1fb058] transition-all duration-300 inline-flex items-center gap-2 rounded-sm font-semibold"
                >
                  <MessageCircle size={15} />
                  Order on WhatsApp
                </a>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="nav.mobile.admin.link"
                  onClick={() => {
                    setMobileOpen(false);
                    window.location.href = "/admin";
                  }}
                  className="font-body text-xs tracking-widest uppercase text-cream-text/40 hover:text-cream-text/70 transition-colors block w-full text-left"
                >
                  Admin Panel
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
