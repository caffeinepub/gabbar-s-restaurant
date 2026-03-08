import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const menuData: Record<string, Dish[]> = {
  starters: [
    {
      name: "Seekh Kebab",
      description:
        "Minced lamb & spiced herbs on iron skewers, grilled to perfection in a clay tandoor.",
      price: "₹420",
      image: "/assets/generated/seekh-kebab.dim_600x400.jpg",
      badge: "Chef's Pick",
    },
    {
      name: "Galouti Kebab",
      description:
        "Silky-smooth Awadhi-style kebabs, 160 spices pressed into melt-in-the-mouth patties.",
      price: "₹480",
      gradient: "from-amber-900/80 to-orange-900/60",
    },
    {
      name: "Tandoori Jhinga",
      description:
        "Jumbo tiger prawns marinated in ajwain yoghurt, charred fragrant in the tandoor.",
      price: "₹650",
      gradient: "from-red-900/80 to-orange-800/60",
      badge: "Seafood",
    },
    {
      name: "Dahi Ke Kebab",
      description:
        "Crisp-fried hung-curd patties with green chutney, a Lucknow royal household classic.",
      price: "₹320",
      gradient: "from-yellow-900/60 to-amber-800/60",
    },
    {
      name: "Kakori Kebab",
      description:
        "Feather-light Kakori-style minced lamb kebabs, traditionally served with laccha paratha.",
      price: "₹460",
      gradient: "from-stone-800/80 to-amber-900/60",
    },
  ],
  mains: [
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
  ],
  breads: [
    {
      name: "Garlic Naan / Tandoori Roti",
      description:
        "Pillowy naans leavened overnight, baked on the clay wall of the tandoor, brushed with butter and garlic.",
      price: "₹80",
      image: "/assets/generated/naan-bread.dim_600x400.jpg",
      badge: "Most Ordered",
    },
    {
      name: "Laccha Paratha",
      description:
        "Flaky multi-layered whole-wheat paratha, slow-cooked on a tawa with desi ghee.",
      price: "₹90",
      gradient: "from-yellow-800/70 to-amber-700/60",
    },
    {
      name: "Sheermal",
      description:
        "Saffron-perfumed Awadhi sweet bread, served alongside kebabs and rich gravies.",
      price: "₹110",
      gradient: "from-amber-700/70 to-yellow-700/60",
      badge: "Awadhi",
    },
    {
      name: "Kulcha",
      description:
        "Leavened stuffed bread with spiced potato or paneer filling, a Punjabi breakfast staple.",
      price: "₹100",
      gradient: "from-stone-700/70 to-amber-800/60",
    },
  ],
  desserts: [
    {
      name: "Gulab Jamun",
      description:
        "Milk-solid spheres soaked in rose-saffron syrup, crowned with crushed pistachios and silver vark.",
      price: "₹180",
      image: "/assets/generated/gulab-jamun.dim_600x400.jpg",
      badge: "House Favourite",
    },
    {
      name: "Shahi Tukda",
      description:
        "Golden-fried bread drenched in condensed milk rabri, scattered with saffron and almonds.",
      price: "₹220",
      gradient: "from-amber-900/70 to-yellow-800/60",
      badge: "Mughlai Royal",
    },
    {
      name: "Phirni",
      description:
        "Set rice pudding scented with rose water and cardamom, served in individual earthen matkas.",
      price: "₹160",
      gradient: "from-stone-700/60 to-amber-700/50",
    },
    {
      name: "Kulfi Falooda",
      description:
        "Dense pistachio kulfi on rose falooda noodles, finished with basil seeds and vermicelli.",
      price: "₹200",
      gradient: "from-green-900/60 to-emerald-800/50",
    },
  ],
  drinks: [
    {
      name: "Kesar Thandai",
      description:
        "Chilled almond-saffron milk with rose, fennel and cardamom — a festive North Indian cooler.",
      price: "₹180",
      gradient: "from-amber-700/60 to-orange-700/50",
      badge: "Seasonal",
    },
    {
      name: "Mango Lassi",
      description:
        "Thick Alphonso mango blended with strained yoghurt and a pinch of cardamom.",
      price: "₹140",
      gradient: "from-yellow-700/70 to-orange-600/50",
    },
    {
      name: "Rose Sharbat",
      description:
        "House-made Rooh Afza-style rose concentrate with crushed ice and fresh mint.",
      price: "₹120",
      gradient: "from-pink-900/60 to-rose-800/50",
    },
    {
      name: "Masala Chaas",
      description:
        "Spiced buttermilk with roasted cumin, ginger, and fresh coriander — light and digestive.",
      price: "₹90",
      gradient: "from-green-800/60 to-teal-800/50",
    },
    {
      name: "Kashmiri Kahwa",
      description:
        "Aromatic green tea steeped with saffron, cinnamon sticks, cardamom, and almonds.",
      price: "₹160",
      gradient: "from-yellow-800/70 to-amber-600/60",
      badge: "Kashmiri",
    },
  ],
};

const categoryLabels: Record<string, string> = {
  starters: "Starters",
  mains: "Mains",
  breads: "Breads",
  desserts: "Desserts",
  drinks: "Drinks",
  menucard: "Menu Card",
};

const menuCardImages = [
  { src: "/assets/uploads/Menu-01-1.JPG", alt: "Gabbar's Menu - Cover" },
  { src: "/assets/uploads/Menu-02-2.JPG", alt: "Soup, Breakfast & Chinese" },
  {
    src: "/assets/uploads/Menu-03-3.JPG",
    alt: "Sandwiches, Burgers, Pizza & Rolls",
  },
  { src: "/assets/uploads/Menu-04-6.JPG", alt: "Main Course" },
  { src: "/assets/uploads/Menu-05-7.JPG", alt: "Biryani, Raita & Thali" },
  { src: "/assets/uploads/Menu-06-4.JPG", alt: "Appetizers" },
  { src: "/assets/uploads/menu-07-5.JPG", alt: "Main Course Veg" },
  { src: "/assets/uploads/Menub-08-8.JPG", alt: "Beverages, Sweets & Crunch" },
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
            The Royal Menu
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

        {/* Tabs */}
        <Tabs defaultValue="starters">
          <div className="flex justify-center mb-10">
            <TabsList className="bg-charcoal-mid border border-saffron/20 rounded-sm p-1 gap-1 flex flex-wrap justify-center h-auto">
              {Object.keys(menuData).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  data-ocid={`menu.${category}.tab`}
                  className="font-body text-xs tracking-widest uppercase text-cream-text/60 data-[state=active]:bg-saffron data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-sm px-5 py-2.5 transition-all duration-200 hover:text-cream-text"
                >
                  {categoryLabels[category]}
                </TabsTrigger>
              ))}
              <TabsTrigger
                value="menucard"
                data-ocid="menu.menucard.tab"
                className="font-body text-xs tracking-widest uppercase text-cream-text/60 data-[state=active]:bg-saffron data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-sm px-5 py-2.5 transition-all duration-200 hover:text-cream-text"
              >
                Menu Card
              </TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(menuData).map(([category, dishes]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {dishes.map((dish, i) => (
                  <DishCard key={dish.name} dish={dish} index={i} />
                ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="menucard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {menuCardImages.map((img, i) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group relative rounded-sm overflow-hidden border border-saffron/15 hover:border-saffron/40 transition-all duration-300 hover:shadow-xl hover:shadow-saffron/10 bg-charcoal-mid"
                  data-ocid={`menu.menucard.item.${i + 1}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="px-3 py-2 border-t border-saffron/10">
                    <p className="font-body text-xs text-cream-text/60 tracking-wide">
                      {img.alt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />
    </section>
  );
}
