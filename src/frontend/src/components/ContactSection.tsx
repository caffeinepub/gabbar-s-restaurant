import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { OrnamentDivider } from "./HeroSection";

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    lines: [
      "Shop No. A-2, Inner Circle",
      "Kisaan Bazaar Road, Saifai",
      "Near Clock Tower, Etawah, UP 206130",
    ],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+91 79837 11781", "+91 90456 03226"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["reservations@gabbars.in", "info@gabbars.in"],
  },
];

const hours = [
  {
    days: "Every Day",
    time: "11:00 AM – 11:00 PM",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative bg-charcoal py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/70 mb-3 block">
            — Find Us —
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-ivory font-bold mb-6">
            Visit Us
          </h2>
          <div className="max-w-lg mx-auto">
            <OrnamentDivider light />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info cards */}
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-charcoal-mid border border-saffron/15 rounded-sm p-6 hover:border-saffron/35 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-sm bg-saffron/10 border border-saffron/20 flex items-center justify-center flex-shrink-0">
                  <info.icon size={18} className="text-saffron" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ivory">
                  {info.label}
                </h3>
              </div>
              <div className="space-y-1 pl-[52px]">
                {info.lines.map((line) => (
                  <p
                    key={line}
                    className="font-body text-sm text-cream-text/70 leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map + Hours grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 relative rounded-sm overflow-hidden bg-charcoal-mid border border-saffron/20 min-h-64"
            data-ocid="contact.map_marker"
          >
            {/* Decorative map-style background */}
            <div className="absolute inset-0 opacity-10">
              <svg
                viewBox="0 0 600 320"
                className="w-full h-full"
                fill="none"
                aria-hidden="true"
                role="presentation"
              >
                {/* Road grid */}
                <line
                  x1="0"
                  y1="80"
                  x2="600"
                  y2="80"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="160"
                  x2="600"
                  y2="160"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="240"
                  x2="600"
                  y2="240"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="2"
                />
                <line
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="320"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="1"
                />
                <line
                  x1="200"
                  y1="0"
                  x2="200"
                  y2="320"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="2"
                />
                <line
                  x1="300"
                  y1="0"
                  x2="300"
                  y2="320"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="1"
                />
                <line
                  x1="400"
                  y1="0"
                  x2="400"
                  y2="320"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="1"
                />
                <line
                  x1="500"
                  y1="0"
                  x2="500"
                  y2="320"
                  stroke="oklch(0.65 0.18 55)"
                  strokeWidth="2"
                />
                {/* Blocks */}
                <rect
                  x="110"
                  y="90"
                  width="80"
                  height="60"
                  fill="oklch(0.65 0.18 55)"
                  rx="2"
                />
                <rect
                  x="210"
                  y="90"
                  width="80"
                  height="60"
                  fill="oklch(0.65 0.18 55)"
                  rx="2"
                />
                <rect
                  x="110"
                  y="170"
                  width="80"
                  height="60"
                  fill="oklch(0.65 0.18 55)"
                  rx="2"
                />
                <rect
                  x="310"
                  y="90"
                  width="80"
                  height="130"
                  fill="oklch(0.65 0.18 55)"
                  rx="2"
                />
                <rect
                  x="410"
                  y="90"
                  width="80"
                  height="60"
                  fill="oklch(0.65 0.18 55)"
                  rx="2"
                />
                <rect
                  x="410"
                  y="170"
                  width="80"
                  height="60"
                  fill="oklch(0.65 0.18 55)"
                  rx="2"
                />
              </svg>
            </div>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-64 gap-4 py-12">
              <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center shadow-2xl shadow-saffron/30 animate-pulse">
                <MapPin
                  size={28}
                  className="text-charcoal"
                  fill="currentColor"
                />
              </div>
              <div className="text-center">
                <div className="font-display text-xl text-ivory font-semibold">
                  Visit Us
                </div>
                <div className="font-body text-sm text-cream-text/60 mt-1 tracking-wide">
                  Shop No. A-2, Kisaan Bazaar Road, Saifai
                </div>
                <div className="font-body text-xs text-saffron/70 mt-3 tracking-widest uppercase">
                  Landmark: Near Clock Tower
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-saffron/40 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-saffron/40 animate-ping [animation-delay:0.3s]" />
                <div className="w-2 h-2 rounded-full bg-saffron/40 animate-ping [animation-delay:0.6s]" />
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-saffron/30" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-saffron/30" />
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 bg-charcoal-mid border border-saffron/20 rounded-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-sm bg-saffron/10 border border-saffron/20 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-saffron" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ivory">
                Opening Hours
              </h3>
            </div>

            <div className="space-y-5">
              {hours.map((h) => (
                <div
                  key={h.days}
                  className="border-b border-saffron/10 pb-5 last:border-0 last:pb-0"
                >
                  <div className="font-display text-sm font-semibold text-ivory mb-1">
                    {h.days}
                  </div>
                  <div className="font-body text-xs text-cream-text/60 leading-relaxed">
                    {h.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Special note */}
            <div className="mt-6 bg-saffron/10 border border-saffron/20 rounded-sm p-4">
              <p className="font-body text-xs text-saffron/80 leading-relaxed">
                🎉 Special extended hours on public holidays and festive
                seasons. Follow us or call ahead for Diwali & Eid timings.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
