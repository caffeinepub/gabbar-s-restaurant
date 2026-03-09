import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

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
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1400x700.jpg')",
          opacity: 0.75,
        }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/45 to-charcoal/75" />
      {/* Warm golden vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-charcoal/50" />

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-saffron to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        {/* Small tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="font-body text-xs tracking-[0.35em] uppercase text-gold border border-gold/30 px-4 py-1.5 rounded-sm">
            Since 2021
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-ivory font-bold leading-tight mb-4"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}
        >
          A Royal Feast
          <br />
          <span className="text-gold">Awaits</span>
        </motion.h1>

        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="my-6"
        >
          <OrnamentDivider light />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-body text-sm text-ivory/90 tracking-widest max-w-2xl mx-auto mb-6"
        >
          Slow-cooked traditions · Tandoor-kissed flavours · Timeless recipes
        </motion.p>

        {/* Punch line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="mb-10"
        >
          <span className="font-display text-2xl md:text-3xl text-saffron drop-shadow-lg">
            "Ab Goli Nahi...{" "}
            <span className="text-gold italic">Khaana Kha!"</span>
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => scrollTo("#menu")}
            data-ocid="hero.menu.primary_button"
            className="font-body text-sm tracking-widest uppercase px-10 py-4 bg-saffron text-charcoal font-semibold hover:bg-gold transition-all duration-300 rounded-sm shadow-lg shadow-saffron/20 hover:shadow-gold/30 hover:scale-105"
          >
            Explore Menu
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#reservations")}
            data-ocid="hero.reserve.secondary_button"
            className="font-body text-sm tracking-widest uppercase px-10 py-4 border-2 border-gold/60 text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 rounded-sm font-medium"
          >
            Reserve a Table
          </button>
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
