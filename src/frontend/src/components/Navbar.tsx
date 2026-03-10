import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface NavbarProps {
  scrolled: boolean;
  onAdminClick: () => void;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Order", href: "#order" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Reservations", href: "#reservations" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ scrolled, onAdminClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleLinkClick("#home")}
          className="flex flex-col leading-tight group text-left"
          data-ocid="nav.link"
        >
          <span
            className="font-display text-gold text-2xl font-bold tracking-wide leading-none"
            style={{ fontWeight: 700 }}
          >
            Gabbar's
          </span>
          <span className="font-body text-saffron text-xs tracking-[0.1em] italic mt-0.5 group-hover:text-gold transition-colors">
            Ab Goli Nahi... Khaana Kha!
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onClick={() => handleLinkClick(link.href)}
                className="font-body text-sm tracking-wider uppercase text-cream-text hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-saffron transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              data-ocid="nav.reserve.button"
              onClick={() => handleLinkClick("#reservations")}
              className="font-body text-sm tracking-wider uppercase px-5 py-2 border border-saffron text-saffron hover:bg-saffron hover:text-charcoal transition-all duration-300 rounded-sm font-medium"
            >
              Reserve Table
            </button>
          </li>
          <li>
            <button
              type="button"
              data-ocid="nav.admin.link"
              onClick={onAdminClick}
              className="font-body text-xs tracking-widest uppercase text-cream-text/35 hover:text-cream-text/70 transition-colors duration-300"
            >
              Admin
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-cream-text hover:text-gold transition-colors p-2"
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
            className="md:hidden bg-charcoal/98 backdrop-blur-md border-t border-saffron/20 overflow-hidden"
          >
            <ul className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                    onClick={() => handleLinkClick(link.href)}
                    className="font-body text-sm tracking-widest uppercase text-cream-text hover:text-gold transition-colors block w-full text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  data-ocid="nav.mobile.reserve.button"
                  onClick={() => handleLinkClick("#reservations")}
                  className="font-body text-sm tracking-wider uppercase px-5 py-2.5 border border-saffron text-saffron hover:bg-saffron hover:text-charcoal transition-all duration-300 inline-block rounded-sm font-medium"
                >
                  Reserve Table
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="nav.mobile.admin.link"
                  onClick={() => {
                    setMobileOpen(false);
                    onAdminClick();
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
