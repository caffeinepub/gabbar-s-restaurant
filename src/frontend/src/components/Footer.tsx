import { motion } from "motion/react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About Us", href: "#about" },
  { label: "Reservations", href: "#reservations" },
  { label: "Contact", href: "#contact" },
];

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="relative bg-charcoal border-t border-saffron/20">
      {/* Top ornament */}
      <div className="h-1 bg-gradient-to-r from-transparent via-saffron/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="font-display text-gold text-3xl font-bold leading-none mb-1">
                Gabbar's
              </div>
              <div className="font-body text-cream-text/50 text-xs tracking-[0.3em] uppercase">
                North Indian &amp; Mughlai
              </div>
            </div>
            <p className="font-body text-sm text-cream-text/60 leading-relaxed max-w-xs mt-4">
              A culinary journey through the royal kitchens of the Mughals and
              the warm hearths of Punjab. Authenticity served since 2021.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              <button
                type="button"
                data-ocid="footer.social.link"
                aria-label="Follow on Instagram"
                className="w-9 h-9 rounded-sm border border-saffron/20 flex items-center justify-center text-cream-text/60 hover:border-saffron/60 hover:text-saffron transition-all duration-300"
              >
                <SiInstagram size={15} />
              </button>
              <button
                type="button"
                data-ocid="footer.facebook.link"
                aria-label="Follow on Facebook"
                className="w-9 h-9 rounded-sm border border-saffron/20 flex items-center justify-center text-cream-text/60 hover:border-saffron/60 hover:text-saffron transition-all duration-300"
              >
                <SiFacebook size={15} />
              </button>
              <button
                type="button"
                data-ocid="footer.x.link"
                aria-label="Follow on X"
                className="w-9 h-9 rounded-sm border border-saffron/20 flex items-center justify-center text-cream-text/60 hover:border-saffron/60 hover:text-saffron transition-all duration-300"
              >
                <SiX size={15} />
              </button>
            </div>

            {/* Tagline */}
            <div className="mt-8 font-display text-sm italic text-saffron/60">
              "Where every meal is a royal memory."
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-ivory font-semibold mb-5 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-ocid={`footer.${link.label.toLowerCase().replace(/\s+/g, "-")}.link`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="font-body text-sm text-cream-text/60 hover:text-saffron transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-saffron/30 group-hover:bg-saffron transition-colors flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact brief */}
          <div>
            <h4 className="font-display text-ivory font-semibold mb-5 text-lg">
              Contact
            </h4>
            <div className="space-y-4 font-body text-sm text-cream-text/60">
              <div>
                <div className="text-saffron/60 text-xs tracking-wider uppercase mb-1">
                  Address
                </div>
                <div>
                  Shop No. A-2, Inner Circle,
                  <br />
                  Kisaan Bazaar Road, Near Clock Tower,
                  <br />
                  Saifai, Etawah, UP 206130
                </div>
              </div>
              <div>
                <div className="text-saffron/60 text-xs tracking-wider uppercase mb-1">
                  Phone
                </div>
                <div>+91 79837 11781 / +91 90456 03226</div>
              </div>
              <div>
                <div className="text-saffron/60 text-xs tracking-wider uppercase mb-1">
                  Email
                </div>
                <div>reservations@gabbars.in</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-saffron/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-cream-text/40">
            © {currentYear} Gabbar's. All rights reserved.
          </p>
          <p className="font-body text-xs text-cream-text/40">
            Built with <span className="text-saffron/60">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron/60 hover:text-saffron transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
