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
      "The Dum Biryani here is unlike anything I've had outside of Lucknow. The saffron aroma, the caramelised onions, the long-grain rice — it's all flawless. Zaika-e-Punjab is now our family's celebration destination.",
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
          className="text-center mb-14"
        >
          <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/70 mb-3 block">
            — Guest Voices —
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-ivory font-bold mb-6">
            Stories from Our Table
          </h2>
          <div className="max-w-lg mx-auto">
            <OrnamentDivider light />
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative bg-charcoal border border-saffron/15 rounded-sm p-7 hover:border-saffron/35 transition-all duration-300 hover:shadow-xl hover:shadow-saffron/5 flex flex-col"
              data-ocid={`testimonials.item.${i + 1}`}
            >
              {/* Opening quote mark */}
              <div
                className="absolute -top-5 left-6 font-display text-7xl text-saffron/20 leading-none select-none pointer-events-none"
                aria-hidden
              >
                "
              </div>

              {/* Stars */}
              <div className="mb-4">
                <StarRating count={t.rating} />
              </div>

              {/* Quote */}
              <blockquote className="font-body text-cream-text/80 text-sm leading-relaxed flex-1 italic mb-6">
                "{t.quote}"
              </blockquote>

              {/* Divider */}
              <div className="h-px bg-saffron/15 mb-4" />

              {/* Attribution */}
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
