import { Star } from "lucide-react";
import { motion } from "motion/react";
import { OrnamentDivider } from "./HeroSection";

// Precomputed decorative motif paths (avoids array-index-key lint issue)
const MOTIF_PATHS = Array.from({ length: 8 }, (_, row) =>
  Array.from({ length: 12 }, (__, col) => ({
    key: `motif-r${row}-c${col}`,
    d: `M${col * 15 + 7.5} ${row * 15 + 2} L${col * 15 + 9} ${row * 15 + 7} L${col * 15 + 14} ${row * 15 + 6} L${col * 15 + 10} ${row * 15 + 9} L${col * 15 + 12} ${row * 15 + 14} L${col * 15 + 7.5} ${row * 15 + 11} L${col * 15 + 3} ${row * 15 + 14} L${col * 15 + 5} ${row * 15 + 9} L${col * 15 + 1} ${row * 15 + 6} L${col * 15 + 6} ${row * 15 + 7}Z`,
  })),
).flat();

const testimonials = [
  {
    name: "Priya Sharma",
    city: "New Delhi",
    rating: 5,
    quote:
      "The Dum Biryani here is unlike anything I've had outside of Lucknow. The saffron aroma, the caramelised onions, the long-grain rice — it's all flawless. Gabbar's is now our family's celebration destination.",
    initial: "PS",
  },
  {
    name: "Arjun Mehra",
    city: "Chandigarh",
    rating: 5,
    quote:
      "As a Punjabi who grew up on proper makke di roti and sarson da saag, I am incredibly picky. This place doesn't just tick the boxes — it redefines them. The Dal Makhani tastes like it's been slow-cooked since yesterday. Because it has.",
    initial: "AM",
  },
  {
    name: "Fatima Zaidi",
    city: "Lucknow",
    rating: 5,
    quote:
      "My grandfather was a Mughlai chef. When I tasted the Galouti Kebabs here, I genuinely teared up. The texture, the warmth of cardamom, the hint of kewra — it is authentic Awadhi cooking preserved with deep respect.",
    initial: "FZ",
  },
  {
    name: "Ramesh Gupta",
    city: "Agra",
    rating: 5,
    quote:
      "The Chicken Tikka Masala was absolutely divine — rich, creamy, and perfectly spiced. I've eaten at top restaurants across Agra and Delhi, but Gabbar's stands in a class of its own. Will definitely visit again!",
    initial: "RG",
  },
  {
    name: "Sunita Yadav",
    city: "Kanpur",
    rating: 5,
    quote:
      "Came for the food, stayed for the ambiance! The Dal Bukhara was slow-cooked to perfection — smoky, velvety, and deeply aromatic. The decor and warmth of this place feels like a royal dining hall. A gem in Etawah!",
    initial: "SY",
  },
];

const STAR_POSITIONS = ["1st", "2nd", "3rd", "4th", "5th"] as const;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_POSITIONS.slice(0, count).map((pos) => (
        <Star key={`star-${pos}`} size={14} className="text-gold fill-gold" />
      ))}
    </div>
  );
}

/** Google "G" multicolour SVG logo */
function GoogleGLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="Google"
      role="img"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** Google Reviews aggregate banner */
function GoogleReviewsBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 bg-charcoal border border-white/10 rounded-xl px-8 py-6 max-w-2xl mx-auto shadow-lg shadow-black/30"
    >
      {/* Google branding */}
      <div className="flex items-center gap-3">
        <GoogleGLogo size={36} />
        <div className="text-left">
          <p className="font-display text-ivory text-base font-semibold leading-tight">
            Reviews from Google
          </p>
          <p className="font-body text-cream-text/50 text-xs tracking-wide mt-0.5">
            Verified by Google Maps
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-12 bg-white/10" />

      {/* Aggregate score */}
      <div className="flex items-center gap-3">
        <span className="font-display text-5xl font-bold text-gold leading-none">
          4.8
        </span>
        <div>
          <div className="flex gap-0.5 mb-1">
            {(["1st", "2nd", "3rd", "4th", "5th"] as const).map((pos) => (
              <Star
                key={`agg-star-${pos}`}
                size={16}
                className="text-gold fill-gold"
              />
            ))}
          </div>
          <p className="font-body text-cream-text/50 text-xs tracking-wide">
            Based on 200+ reviews
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** Small Google badge shown on each card */
function GoogleBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
      <GoogleGLogo size={13} />
      <span className="font-body text-[10px] text-cream-text/60 tracking-wide">
        Google Review
      </span>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative bg-charcoal-mid py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background motif */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          fill="oklch(0.75 0.16 80)"
          aria-hidden="true"
          role="presentation"
        >
          {MOTIF_PATHS.map(({ key, d }) => (
            <path key={key} d={d} />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/70 mb-3 block">
            — Guest Voices from Google —
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-ivory font-bold mb-6">
            Stories from Our Table
          </h2>
          <div className="max-w-lg mx-auto mb-10">
            <OrnamentDivider light />
          </div>

          {/* Google Reviews aggregate banner */}
          <GoogleReviewsBanner />
        </motion.div>

        {/* Testimonial cards — 3-col on desktop, wrap for 5 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative bg-charcoal border border-saffron/15 rounded-sm p-7 hover:border-[#4285F4]/40 hover:shadow-xl hover:shadow-[#4285F4]/8 transition-all duration-300 flex flex-col group"
              data-ocid={`testimonials.item.${i + 1}`}
            >
              {/* Google-blue top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-sm bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Opening quote mark */}
              <div
                className="absolute -top-5 left-6 font-display text-7xl text-saffron/20 leading-none select-none pointer-events-none"
                aria-hidden
              >
                "
              </div>

              {/* Top row: Stars + Google badge */}
              <div className="flex items-center justify-between mb-4">
                <StarRating count={t.rating} />
                <GoogleBadge />
              </div>

              {/* Quote */}
              <blockquote className="font-body text-cream-text/80 text-sm leading-relaxed flex-1 italic mb-6">
                "{t.quote}"
              </blockquote>

              {/* Divider */}
              <div className="h-px bg-saffron/15 mb-4" />

              {/* Attribution + Verified tag */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-saffron/20 border border-saffron/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-xs font-bold text-saffron">
                      {t.initial}
                    </span>
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold text-ivory">
                      {t.name}
                    </div>
                    <div className="font-body text-xs text-cream-text/40 tracking-wider">
                      {t.city}
                    </div>
                  </div>
                </div>
                <span className="font-body text-[10px] text-[#34A853]/80 tracking-wide border border-[#34A853]/20 rounded-full px-2 py-0.5 bg-[#34A853]/5 flex-shrink-0">
                  ✓ Verified
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
