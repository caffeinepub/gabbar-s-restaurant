import { motion } from "motion/react";
import { OrnamentDivider } from "./HeroSection";

interface Dish {
  name: string;
  description: string;
  price: string;
  image?: string;
  badge?: string;
  gradient?: string;
}

const featuredDishes: Dish[] = [
  {
    name: "Murgh Makhani",
    description:
      "Tender tandoor-roasted chicken simmered in velvety tomato-butter-cream sauce. The undisputed Mughlai classic.",
    price: "₹520",
    image: "/assets/generated/butter-chicken.dim_600x400.jpg",
    badge: "Bestseller",
  },
  {
    name: "Dum Biryani",
    description:
      "Long-grain Basmati sealed in a handi with saffron milk, whole spices, and caramelised onions.",
    price: "₹580",
    image: "/assets/generated/biryani.dim_600x400.jpg",
    badge: "Signature",
  },
  {
    name: "Dal Makhani",
    description:
      "Black urad dal slow-cooked overnight, finished with cream and smoky butter. A Punjabi institution.",
    price: "₹340",
    image: "/assets/generated/dal-makhani.dim_600x400.jpg",
  },
  {
    name: "Rogan Josh",
    description:
      "Kashmiri slow-braised lamb shank in aromatic Kashmiri chilli gravy with whole spices.",
    price: "₹620",
    gradient: "from-red-950/80 to-rose-900/60",
    badge: "Kashmiri",
  },
  {
    name: "Paneer Lababdar",
    description:
      "Cottage cheese cubes in a rich, smoky makhani-style gravy — a vegetarian showstopper.",
    price: "₹420",
    gradient: "from-orange-900/70 to-amber-800/60",
  },
  {
    name: "Garlic Naan / Tandoori Roti",
    description:
      "Pillowy naans leavened overnight, baked on the clay wall of the tandoor, brushed with butter and garlic.",
    price: "₹80",
    image: "/assets/generated/naan-bread.dim_600x400.jpg",
    badge: "Most Ordered",
  },
  {
    name: "Gulab Jamun",
    description:
      "Milk-solid spheres soaked in rose-saffron syrup, crowned with crushed pistachios and silver vark.",
    price: "₹180",
    image: "/assets/generated/gulab-jamun.dim_600x400.jpg",
    badge: "House Favourite",
  },
  {
    name: "Kesar Thandai",
    description:
      "Chilled almond-saffron milk with rose, fennel and cardamom — a festive North Indian cooler.",
    price: "₹180",
    gradient: "from-amber-700/60 to-orange-700/50",
    badge: "Seasonal",
  },
];

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group relative bg-charcoal-mid rounded-sm overflow-hidden border border-saffron/10 hover:border-saffron/30 transition-all duration-300 hover:shadow-xl hover:shadow-saffron/5"
    >
      {/* Image / Gradient placeholder */}
      <div className="relative h-48 overflow-hidden">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${dish.gradient ?? "from-charcoal/80 to-charcoal-mid/60"} flex items-center justify-center`}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-saffron/30"
              aria-hidden="true"
              role="presentation"
            >
              <path
                d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-mid via-transparent to-transparent" />
        {dish.badge && (
          <span className="absolute top-3 right-3 font-body text-xs tracking-wider uppercase px-2.5 py-1 bg-saffron text-charcoal font-semibold rounded-sm">
            {dish.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-cream-text text-lg font-semibold leading-snug group-hover:text-gold transition-colors">
            {dish.name}
          </h3>
          <span className="font-body text-saffron font-bold text-lg whitespace-nowrap flex-shrink-0">
            {dish.price}
          </span>
        </div>
        <p className="font-body text-sm text-cream-text/60 leading-relaxed line-clamp-3">
          {dish.description}
        </p>
      </div>
    </motion.article>
  );
}

export default function MenuSection() {
  return (
    <section
      id="menu"
      className="relative bg-charcoal py-24 px-4 sm:px-6 lg:px-8"
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
            — Our Offerings —
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory font-bold mb-6">
            Royal Menu of the Day
          </h2>
          <div className="max-w-lg mx-auto">
            <OrnamentDivider light />
          </div>
          <p className="font-body text-cream-text/70 mt-6 max-w-2xl mx-auto text-base leading-relaxed">
            Every dish is a journey through the royal kitchens of Mughal
            emperors and the hearty traditions of Punjab's dhabas — slow-cooked,
            freshly spiced, served with love.
          </p>
        </motion.div>

        {/* Featured dishes grid — no tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredDishes.map((dish, i) => (
            <DishCard key={dish.name} dish={dish} index={i} />
          ))}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />
    </section>
  );
}
