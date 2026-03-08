import { motion } from "motion/react";
import { OrnamentDivider } from "./HeroSection";

const pillars = [
  {
    icon: "🫕",
    title: "Slow-Fire Mastery",
    desc: "Our curries simmer for 6–8 hours, allowing spices to bloom and fuse.",
  },
  {
    icon: "🔥",
    title: "Clay Tandoor",
    desc: "A 900°C wood-fired tandoor oven imported from Amritsar bakes every naan and kebab.",
  },
  {
    icon: "🌿",
    title: "Heirloom Spice Blends",
    desc: "Hand-ground masalas passed down three generations, sourced from Khari Baoli spice market.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative bg-charcoal-mid py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background ornament */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.06] pointer-events-none">
        <svg
          viewBox="0 0 400 800"
          className="w-full h-full"
          fill="oklch(0.65 0.18 55)"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M200 0 Q300 100 400 200 Q300 300 200 400 Q100 500 0 600 Q100 700 200 800"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="200"
            cy="400"
            r="150"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="200"
            cy="400"
            r="100"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M200 250 L215 285 L250 285 L225 305 L235 340 L200 320 L165 340 L175 305 L150 285 L185 285Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/80 mb-3 block">
              — Our Story —
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-ivory font-bold mb-6 leading-tight">
              Rooted in Tradition,
              <br />
              <span className="text-gold">Served with Soul</span>
            </h2>

            <OrnamentDivider light />

            <div className="mt-6 space-y-5 font-body text-cream-text/80 leading-relaxed text-base">
              <p>
                In 1987, Chef Harjinder Singh Sethi opened a small dhaba on the
                GT Road outside Ludhiana, armed with three clay pots, a
                wood-burning tandoor, and family recipes he had memorised
                watching his mother cook in her village kitchen.
              </p>
              <p>
                Over decades, those recipes were refined with influences from
                the Mughal royal kitchens — the slow-cooked, spice-layered
                techniques that once graced the tables of emperors. The{" "}
                <em>dum</em> method, the saffron brines, the tenderising of meat
                in papaya overnight — all preserved exactly as they were.
              </p>
              <p>
                Today, Gabbar's is a destination for those who seek more than
                just a meal. It is a sensory passage through two of India's most
                celebrated culinary traditions: the robust, generous flavours of
                rural Punjab and the intricate refinement of Awadhi-Mughlai
                cooking.
              </p>
            </div>

            {/* Pillars */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {pillars.map((p) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-charcoal border border-saffron/20 rounded-sm p-4"
                >
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className="font-display text-sm font-bold text-ivory mb-1">
                    {p.title}
                  </div>
                  <div className="font-body text-xs text-cream-text/60 leading-relaxed">
                    {p.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Since 1987 badge */}
            <div className="absolute -top-6 -left-6 z-10 bg-burgundy text-ivory w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-burgundy/30 border-4 border-ivory">
              <span className="font-body text-xs tracking-widest uppercase text-ivory/60 leading-none">
                Since
              </span>
              <span className="font-display text-2xl font-bold text-gold leading-none">
                1987
              </span>
              <span className="font-body text-xs tracking-wider text-ivory/60 uppercase">
                Saifai
              </span>
            </div>

            {/* Main image frame */}
            <div className="relative rounded-sm overflow-hidden aspect-[4/5] bg-charcoal-mid border border-saffron/20">
              <img
                src="/assets/generated/biryani.dim_600x400.jpg"
                alt="Dum Biryani - our signature dish"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              {/* Overlaid quote */}
              <div className="absolute bottom-6 left-6 right-6">
                <blockquote className="font-display text-lg text-ivory italic leading-snug">
                  "Cooking is poetry — every spice a word, every dish a verse."
                </blockquote>
                <cite className="font-body text-xs text-gold/80 mt-2 block not-italic tracking-wider uppercase">
                  — Chef H.S. Sethi, Founder
                </cite>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -bottom-5 -right-5 bg-saffron rounded-sm p-4 shadow-xl shadow-saffron/20">
              <div className="font-display text-3xl font-bold text-charcoal leading-none">
                200+
              </div>
              <div className="font-body text-xs text-charcoal/70 uppercase tracking-wider mt-1">
                Recipes Mastered
              </div>
            </div>

            {/* Decorative corner line */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-saffron/40 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-saffron/40 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
