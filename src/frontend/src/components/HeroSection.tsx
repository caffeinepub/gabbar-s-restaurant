import { ChevronDown, MapPin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { IMAGES } from "../assets/images";

const OrnamentDivider = ({ light = false }: { light?: boolean }) => (
  <div
    className={`flex items-center gap-4 ${light ? "text-gold/60" : "text-saffron/50"}`}
  >
    <div className={`flex-1 h-px ${light ? "bg-gold/30" : "bg-saffron/30"}`} />
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5Z" />
    </svg>
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
      role="presentation"
    >
      <circle cx="6" cy="6" r="3" />
    </svg>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5Z" />
    </svg>
    <div className={`flex-1 h-px ${light ? "bg-gold/30" : "bg-saffron/30"}`} />
  </div>
);

export { OrnamentDivider };

const WA_URL =
  "https://wa.me/917983711781?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order%20at%20Gabbar%27s!";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${IMAGES.heroPage})`,
          opacity: 0.65,
        }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/75 via-charcoal/50 to-charcoal/80" />
      {/* Warm golden vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.10 0.03 55) 100%)",
        }}
      />

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-saffron to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4 flex justify-center"
        >
          <img
            src={IMAGES.logo}
            alt="Gabbar's Restaurant"
            className="h-28 md:h-36 w-auto object-contain drop-shadow-2xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </motion.div>

        {/* Since badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4"
        >
          <span className="font-body text-xs tracking-[0.35em] uppercase text-gold border border-gold/30 px-4 py-1.5 rounded-sm">
            Since 2021
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-ivory font-bold leading-tight mb-3"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
        >
          <span className="text-gold">GABBAR'S</span>
        </motion.h1>

        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="my-5"
        >
          <OrnamentDivider light />
        </motion.div>

        {/* Punch line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mb-3"
        >
          <span className="font-display text-2xl md:text-3xl text-saffron drop-shadow-lg">
            "Ab Goli Nahi...{" "}
            <span className="text-gold italic">Khaana Kha!"</span>
          </span>
        </motion.div>

        {/* Location */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="font-body text-xs text-ivory/70 tracking-widest flex items-center justify-center gap-1.5 mb-8"
        >
          <MapPin size={12} className="text-saffron" />
          Saifai, Etawah, Uttar Pradesh
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => scrollTo("#order")}
            data-ocid="hero.order.primary_button"
            className="font-body text-sm tracking-widest uppercase px-10 py-4 bg-saffron text-charcoal font-semibold hover:bg-gold transition-all duration-300 rounded-sm shadow-lg shadow-saffron/20 hover:shadow-gold/30 hover:scale-105"
          >
            Order Now
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#menu")}
            data-ocid="hero.menu.secondary_button"
            className="font-body text-sm tracking-widest uppercase px-10 py-4 border-2 border-gold/60 text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 rounded-sm font-medium"
          >
            View Menu
          </button>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="hero.whatsapp.button"
            className="font-body text-sm tracking-widest uppercase px-8 py-4 bg-[#25D366] text-white hover:bg-[#1fb058] transition-all duration-300 rounded-sm font-semibold flex items-center gap-2 shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle size={16} />
            Order on WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/70 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.8,
            ease: "easeInOut",
          }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
