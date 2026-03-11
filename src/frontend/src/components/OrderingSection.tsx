import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { IMAGES } from "../assets/images";
import { OrderType } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { addLoyaltyPoints } from "../pages/LoyaltyPage";
import { saveOrderLocally } from "../pages/TrackOrderPage";
import { OrnamentDivider } from "./HeroSection";
import VegNonVegIcon from "./VegNonVegIcon";

/* ─── Types ────────────────────────────────────────────────── */
interface OrderDish {
  name: string;
  description: string;
  price: number; // rupees
  image?: string;
  badge?: string;
  gradient?: string;
}

interface CartItem extends OrderDish {
  quantity: number;
}

/* ─── Menu Data (prices as plain numbers) ──────────────────── */
const orderMenuData: Record<string, OrderDish[]> = {
  appetizers: [
    {
      name: "Paneer Sholey – Atishi",
      description:
        "Choice of paneer marinated & grilled from Ramgarh ke Sholon ki Aag Se.",
      price: 179,
      image: IMAGES.paneerTikka,
      badge: "Veg",
    },
    {
      name: "Paneer Sholey – Malai",
      description: "Creamy malai paneer sholey, soft & lightly spiced.",
      price: 196,
      image: IMAGES.paneerTikka,
      badge: "Veg",
    },
    {
      name: "Paneer Sholey – Achari",
      description: "Tangy achari marinated paneer grilled to perfection.",
      price: 196,
      image: IMAGES.paneerTikka,
      badge: "Veg",
    },
    {
      name: "Paneer Sholey – Ajwaini",
      description: "Ajwain-scented paneer tikka from the clay tandoor.",
      price: 180,
      image: IMAGES.paneerTikka,
      badge: "Veg",
    },
    {
      name: "Dahi Ke Kabab",
      description:
        "Hung curd mixed with cheese, select spices and flesh fried to perfection.",
      price: 199,
      image: IMAGES.dahiKebab,
      badge: "Veg",
    },
    {
      name: "Hara Bhara Kabab",
      description:
        "Vegetarian kabab made from chana dal, green peas, paneer, spinach, plain flour and Indian spices.",
      price: 219,
      image: IMAGES.haraBharaKabab,
      badge: "Veg",
    },
    {
      name: "Tandoori Aloo",
      description:
        "Potato cases stuffed with paneer, dry fruits & select spices, char grilled.",
      price: 219,
      image: IMAGES.tandooriAloo,
      badge: "Veg",
    },
    {
      name: "Veg Seekh Kabab",
      description: "Mixed vegetables mince mixed with cheese and skewered.",
      price: 209,
      image: IMAGES.seekhKebab,
      badge: "Veg",
    },
    {
      name: "Soya Chaap – Tandoori Masala",
      description: "Jailor ka Manpasand soya chaap in tandoori masala.",
      price: 179,
      image: IMAGES.soyaChaap,
      badge: "Veg",
    },
    {
      name: "Soya Chaap – Malai",
      description: "Soya chaap in creamy malai marinade, grilled in tandoor.",
      price: 196,
      image: IMAGES.soyaChaap,
      badge: "Veg",
    },
    {
      name: "Mushroom Tikke – Malai",
      description: "Thakur ke Khet ke Mushroom Tikke in malai marinade.",
      price: 239,
      image: IMAGES.mushroomTikka,
      badge: "Veg",
    },
    {
      name: "Paneer Seekh Pao",
      description: "Mausi Ka Banaa – paneer seekh pao with chutneys.",
      price: 249,
      image: IMAGES.paneerRoll,
      badge: "Veg",
    },
    {
      name: "Pineapple Tikka",
      description: "Radha ka Pasandeeda – grilled pineapple tikka with spices.",
      price: 179,
      image: IMAGES.pineappleRaita,
      badge: "Veg",
    },
    {
      name: "Mix Veg Platter",
      description:
        "Dastan-e-Sholay – assorted veg platter with paneer sholey, mushroom tikka, soya chaap, dahi kabab & veg seekh.",
      price: 369,
      image: IMAGES.vegThali,
      badge: "Platter",
    },
    {
      name: "Murg Tandoori – Banjara",
      description: "Gabbar Mange – Murg Tandoori Tikka, Banjara style.",
      price: 299,
      image: IMAGES.tandooriChicken,
      badge: "Non-Veg",
    },
    {
      name: "Murg Tandoori – Jarda",
      description: "Gabbar Mange – Murg Tandoori Tikka, Jarda style.",
      price: 290,
      image: IMAGES.tandooriChicken,
      badge: "Non-Veg",
    },
    {
      name: "Murg Tandoori – Cheese Tikka",
      description: "Tandoori chicken tikka with cheese marinade.",
      price: 295,
      image: IMAGES.butterChicken,
      badge: "Non-Veg",
    },
    {
      name: "Murg Tandoori – Malai",
      description: "Creamy malai chicken tikka from the tandoor.",
      price: 280,
      image: IMAGES.chickenSeekh,
      badge: "Non-Veg",
    },
    {
      name: "Tandoori Chicken",
      description:
        "Kaalia ke Andaaz Mein – Punjab's well loved tandoori chicken.",
      price: 270,
      image: IMAGES.tandooriChicken,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Seekh",
      description: "Basanti Special seekh kabab – chicken seekh.",
      price: 239,
      image: IMAGES.chickenSeekh,
      badge: "Non-Veg",
    },
    {
      name: "Mutton Seekh",
      description: "Basanti Special seekh kabab – mutton seekh.",
      price: 279,
      image: IMAGES.muttonSeekh,
      badge: "Non-Veg",
    },
    {
      name: "Tangri Kebab – Tandoori Masala",
      description:
        "Hariram Nai ki Cutting Edge – Tangri Kebab in tandoori masala.",
      price: 269,
      image: IMAGES.tangriKebab,
      badge: "Non-Veg",
    },
    {
      name: "Tangri Kebab – Malai",
      description:
        "Hariram Nai ki Cutting Edge – Tangri Kebab in malai marinade.",
      price: 289,
      image: IMAGES.tangriKebab,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Seekh Pao",
      description: "Jailor ki Surang Se – chicken seekh pao with chutneys.",
      price: 299,
      image: IMAGES.chickenSeekh,
      badge: "Non-Veg",
    },
    {
      name: "Afghani Chicken",
      description: "Ramgarh ke Afghani Chicken – rich, creamy & smoky.",
      price: 279,
      image: IMAGES.tandooriChicken,
      badge: "Non-Veg",
    },
    {
      name: "Kalmi Kebab (4 pcs)",
      description:
        "Veeru ki Mohabbat ke Naam – kalmi kebab, crispy on outside, juicy inside.",
      price: 309,
      image: IMAGES.tangriKebab,
      badge: "Non-Veg",
    },
  ],
  soup: [
    {
      name: "Manchow Soup",
      description: "Itna Sannata Kyu Hai Bhai – spicy, tangy Manchow soup.",
      price: 59,
      image: IMAGES.manchowSoup,
    },
    {
      name: "Hot & Sour Soup",
      description: "Classic hot & sour vegetable soup.",
      price: 59,
      image: IMAGES.hotSourSoup,
    },
    {
      name: "Tomato Soup",
      description: "Fresh tomato soup with cream and croutons.",
      price: 69,
      image: IMAGES.tomatoSoup,
    },
  ],
  breakfast: [
    {
      name: "Aloo Parantha",
      description:
        "Veeru ki Taakat ka Raaz – stuffed potato paratha served with curd & butter.",
      price: 59,
      image: IMAGES.paneerParantha,
    },
    {
      name: "Paneer Parantha",
      description: "Paneer stuffed whole wheat paratha served with curd.",
      price: 79,
      image: IMAGES.paneerParantha,
    },
    {
      name: "Mix Parantha",
      description: "Mixed stuffed paratha with assorted fillings.",
      price: 96,
      image: IMAGES.paneerParantha,
    },
    {
      name: "Pyaaz Parantha",
      description: "Onion stuffed paratha, crispy on tawa with desi ghee.",
      price: 69,
      image: IMAGES.paneerParantha,
    },
    {
      name: "Chole Bhature",
      description:
        "Spiced chickpea curry served with deep-fried fluffy bhature.",
      price: 99,
      image: IMAGES.choleBhature,
    },
    {
      name: "Puri Bhaji",
      description: "Crispy deep-fried puris with spiced potato bhaji.",
      price: 79,
      image: IMAGES.choleBhature,
    },
    {
      name: "Veg Pakora",
      description: "Crispy batter-fried mixed vegetable fritters.",
      price: 89,
      image: IMAGES.vegPakora,
    },
    {
      name: "Paneer Pakora",
      description: "Golden fried cottage cheese fritters with chutney.",
      price: 109,
      image: IMAGES.paneerPakora,
    },
  ],
  biryanirice: [
    {
      name: "Rice Plain",
      description: "Arre O Samba, Laa to Zara Biryani – steamed plain rice.",
      price: 99,
      image: IMAGES.chickenBiryani,
    },
    {
      name: "Rice Jeera",
      description: "Cumin tempered steamed rice.",
      price: 109,
      image: IMAGES.chickenBiryani,
    },
    {
      name: "Matar Pulao",
      description: "Green peas pulao with aromatic whole spices.",
      price: 119,
      image: IMAGES.vegBiryani,
    },
    {
      name: "Veg Pulao",
      description: "Mixed vegetable pulao with basmati rice.",
      price: 129,
      image: IMAGES.vegBiryani,
    },
    {
      name: "Paneer Pulao",
      description: "Paneer and basmati rice cooked with spices.",
      price: 139,
      image: IMAGES.paneerTikka,
    },
    {
      name: "Veg Dum Biryani",
      description: "Lag Gaya Nishaana – vegetable biryani cooked dum style.",
      price: 169,
      image: IMAGES.vegBiryani,
    },
    {
      name: "Chaap Dum Biryani",
      description: "Soya chaap layered dum biryani.",
      price: 179,
      image: IMAGES.soyaChaap,
    },
    {
      name: "Egg Dum Biryani",
      description:
        "Jay Veeru ki Dosti ke Naam – egg dum biryani with saffron basmati.",
      price: 189,
      image: IMAGES.chickenBiryani,
    },
    {
      name: "Murg Dum Biryani",
      description: "Authentic chicken dum biryani with saffron and mint.",
      price: 219,
      image: IMAGES.chickenBiryani,
      badge: "Bestseller",
    },
    {
      name: "Gosht Dum Biryani",
      description:
        "Authentic mutton dum biryani – layered basmati with pre-marinated mutton cooked over dum.",
      price: 249,
      image: IMAGES.muttonBiryani,
      badge: "Signature",
    },
  ],
  chinese: [
    {
      name: "French Fries",
      description: "Gabbar Chala China – crispy golden French fries.",
      price: 69,
      image: IMAGES.frenchFries,
    },
    {
      name: "Honey Chilli Potato",
      description: "Crispy potato strips tossed in honey chilli sauce.",
      price: 109,
      image: IMAGES.honeyChilliPotato,
    },
    {
      name: "Veg Noodles",
      description: "Stir-fried noodles with mixed vegetables.",
      price: 129,
      image: IMAGES.hakkaNoodles,
    },
    {
      name: "Hakka Noodles",
      description: "Classic Hakka noodles with vegetables.",
      price: 179,
      image: IMAGES.hakkaNoodles,
    },
    {
      name: "Veg Chilli Garlic Noodle",
      description: "Noodles tossed in chilli garlic sauce.",
      price: 139,
      image: IMAGES.hakkaNoodles,
    },
    {
      name: "Veg Fried Rice",
      description: "Stir-fried rice with mixed vegetables.",
      price: 139,
      image: IMAGES.chickenBiryani,
    },
    {
      name: "Chilly Paneer (Dry/Gravy)",
      description: "Indo-Chinese crispy paneer in chilli sauce.",
      price: 149,
      image: IMAGES.chillyPaneer,
    },
    {
      name: "Paneer Fry",
      description: "Crispy fried paneer with chilli-soy glaze.",
      price: 189,
      image: IMAGES.paneerPakora,
    },
    {
      name: "Fry Chaap",
      description: "Deep fried soya chaap.",
      price: 179,
      image: IMAGES.soyaChaap,
    },
    {
      name: "Corn Salt & Pepper",
      description: "Baby corn tossed in salt and pepper.",
      price: 199,
      image: IMAGES.cornSaltPepper,
    },
    {
      name: "Mushroom Chilli",
      description: "Mushrooms in spicy Indo-Chinese chilli sauce.",
      price: 149,
      image: IMAGES.mushroomTikka,
    },
    {
      name: "Veg Manchurian",
      description: "Crispy vegetable balls in Manchurian gravy.",
      price: 179,
      image: IMAGES.haraBharaKabab,
    },
    {
      name: "Veg Spring Roll",
      description: "Crispy spring rolls filled with vegetables.",
      price: 129,
      image: IMAGES.vegPakora,
    },
    {
      name: "Paneer Finger",
      description: "Crispy paneer fingers with dipping sauce.",
      price: 209,
      image: IMAGES.paneerPakora,
    },
    {
      name: "Chilli Chaap",
      description: "Soya chaap in spicy chilli sauce.",
      price: 179,
      image: IMAGES.soyaChaap,
    },
    {
      name: "Singapore Noodles",
      description: "Thin noodles in Singapore-style curry sauce.",
      price: 219,
      image: IMAGES.hakkaNoodles,
    },
    {
      name: "Schezwan Noodles",
      description: "Spicy Schezwan sauce noodles.",
      price: 209,
      image: IMAGES.hakkaNoodles,
    },
    {
      name: "Egg Fried Rice",
      description: "Stir-fried rice with eggs.",
      price: 159,
      image: IMAGES.chickenBiryani,
    },
    {
      name: "Egg Noodles",
      description: "Noodles stir-fried with eggs.",
      price: 149,
      image: IMAGES.eggRoll,
    },
    {
      name: "Chicken Garlic Noodle",
      description: "Noodles with chicken in garlic sauce.",
      price: 169,
      image: IMAGES.chickenRoll,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Fried Rice",
      description: "Fried rice with chicken pieces.",
      price: 179,
      image: IMAGES.chickenBiryani,
      badge: "Non-Veg",
    },
    {
      name: "Chilly Chicken (Dry/Gravy)",
      description: "Indo-Chinese crispy chicken in chilli sauce.",
      price: 179,
      image: IMAGES.chillyChicken,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Balls",
      description: "Crispy chicken balls in soy-chilli glaze.",
      price: 199,
      image: IMAGES.chickenLollipop,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Manchurian",
      description: "Crispy chicken in Manchurian gravy.",
      price: 249,
      image: IMAGES.tandooriChicken,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Spring Roll",
      description: "Crispy spring rolls filled with spiced chicken.",
      price: 119,
      image: IMAGES.chickenRoll,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Lollipop",
      description: "Classic chicken lollipops in spicy sauce.",
      price: 279,
      image: IMAGES.chickenLollipop,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Drumsticks",
      description: "Crispy fried drumsticks with dipping sauce.",
      price: 299,
      image: IMAGES.tangriKebab,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Beans Fried",
      description: "Chicken stir-fried with beans.",
      price: 249,
      image: IMAGES.chickenSeekh,
      badge: "Non-Veg",
    },
    {
      name: "Meat Balls",
      description: "Spiced meat balls in sauce.",
      price: 229,
      image: IMAGES.muttonSeekh,
      badge: "Non-Veg",
    },
  ],
  sandwichespizza: [
    {
      name: "Veg Cheese Sandwich",
      description: "Soorma Bhopal ke Shoorveer – grilled veg cheese sandwich.",
      price: 99,
      image: IMAGES.vegCheeseSandwich,
      badge: "Veg",
    },
    {
      name: "Paneer Grilled Sandwich",
      description: "Grilled sandwich with spiced paneer filling.",
      price: 109,
      image: IMAGES.paneerSandwich,
      badge: "Veg",
    },
    {
      name: "Gabbar Special Sandwich",
      description: "Chef's special loaded sandwich.",
      price: 129,
      image: IMAGES.paneerSandwich,
      badge: "Special",
    },
    {
      name: "Chicken Grilled Sandwich",
      description: "Grilled chicken sandwich.",
      price: 139,
      image: IMAGES.chickenRoll,
      badge: "Non-Veg",
    },
    {
      name: "Aloo Patty Burger",
      description: "Burger Garam Hai – Maar Do Hathoda – aloo patty burger.",
      price: 69,
      image: IMAGES.vegBurger,
      badge: "Veg",
    },
    {
      name: "Veg Cheese Burger",
      description: "Veg cheese burger with fresh toppings.",
      price: 89,
      image: IMAGES.vegBurger,
      badge: "Veg",
    },
    {
      name: "Paneer Burger",
      description: "Crispy paneer patty burger.",
      price: 99,
      image: IMAGES.vegBurger,
      badge: "Veg",
    },
    {
      name: "Chicken Burger",
      description: "Juicy chicken patty burger.",
      price: 109,
      image: IMAGES.chickenBurger,
      badge: "Non-Veg",
    },
    {
      name: "Margherita Pizza",
      description: "Hamari Jail Ka – classic margherita pizza.",
      price: 189,
      image: IMAGES.margheritaPizza,
      badge: "Veg",
    },
    {
      name: "American Pizza",
      description: "American-style loaded pizza.",
      price: 199,
      image: IMAGES.margheritaPizza2,
      badge: "Veg",
    },
    {
      name: "Chilli Paneer Pizza",
      description: "Pizza topped with chilli paneer.",
      price: 209,
      image: IMAGES.chillyPaneer,
      badge: "Veg",
    },
    {
      name: "Paneer Tikka Pizza",
      description: "Pizza with paneer tikka topping.",
      price: 219,
      image: IMAGES.paneerTikkaPizza,
      badge: "Veg",
    },
    {
      name: "Mushroom Tikka Pizza",
      description: "Pizza topped with mushroom tikka.",
      price: 216,
      image: IMAGES.mushroomTikka,
      badge: "Veg",
    },
    {
      name: "Chicken Tikka Pizza",
      description: "Pizza topped with chicken tikka.",
      price: 229,
      image: IMAGES.tandooriChicken,
      badge: "Non-Veg",
    },
    {
      name: "Chilli Chicken Pizza",
      description: "Pizza with spicy chilli chicken topping.",
      price: 239,
      image: IMAGES.chillyChicken,
      badge: "Non-Veg",
    },
    {
      name: "Gabbar Special Pizza",
      description: "Chef's loaded special pizza.",
      price: 249,
      image: IMAGES.margheritaPizza2,
      badge: "Special",
    },
  ],
  rolls: [
    {
      name: "Veg Roll",
      description: "Bahut Yaarana Lagta Hai – fresh veg roll with chutneys.",
      price: 106,
      image: IMAGES.vegRoll,
      badge: "Veg",
    },
    {
      name: "Paneer Tikka Roll",
      description: "Paneer tikka wrapped in soft roti.",
      price: 139,
      image: IMAGES.paneerRoll,
      badge: "Veg",
    },
    {
      name: "Malai Chaap Roll",
      description: "Malai soya chaap roll.",
      price: 129,
      image: IMAGES.soyaChaap,
      badge: "Veg",
    },
    {
      name: "Masala Chaap Roll",
      description: "Masala soya chaap wrapped in roti.",
      price: 119,
      image: IMAGES.soyaChaap,
      badge: "Veg",
    },
    {
      name: "Egg Roll",
      description: "Egg and veggies rolled in thin paratha.",
      price: 109,
      image: IMAGES.eggRoll,
    },
    {
      name: "Chicken Tikka Roll",
      description: "Chicken tikka wrapped in roti.",
      price: 159,
      image: IMAGES.chickenRoll,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Seekh Roll",
      description: "Chicken seekh kabab roll.",
      price: 159,
      image: IMAGES.chickenSeekh,
      badge: "Non-Veg",
    },
    {
      name: "Chicken Dragon Roll",
      description: "Spicy dragon-sauce chicken roll.",
      price: 179,
      image: IMAGES.chickenRoll2,
      badge: "Non-Veg",
    },
  ],
  pasta: [
    {
      name: "White Sauce Pasta",
      description: "Creamy béchamel pasta with vegetables.",
      price: 189,
      image: IMAGES.whiteSaucePasta,
      badge: "Veg",
    },
    {
      name: "Red Sauce Pasta",
      description: "Pasta in tangy tomato red sauce.",
      price: 169,
      image: IMAGES.redSaucePasta,
      badge: "Veg",
    },
    {
      name: "Mix Sauce Pasta",
      description: "Pasta tossed in a blend of white and red sauce.",
      price: 199,
      image: IMAGES.redSaucePasta,
      badge: "Veg",
    },
  ],
  raita: [
    {
      name: "Chakka Dahi (Plain Curd)",
      description: "Keemat Jo Tum Kaho – fresh set plain curd.",
      price: 59,
      image: IMAGES.plainCurd,
    },
    {
      name: "Boondi Raita",
      description: "Chilled yoghurt with crispy boondi and spices.",
      price: 69,
      image: IMAGES.mixVegRaita,
    },
    {
      name: "Mix Veg Raita",
      description: "Yoghurt with mixed vegetables.",
      price: 79,
      image: IMAGES.mixVegRaita,
    },
    {
      name: "Pineapple Raita",
      description: "Sweet and tangy pineapple raita.",
      price: 89,
      image: IMAGES.pineappleRaita,
    },
    {
      name: "Veg Thali",
      description:
        "Basanti ki Rasoi ki Thali – Dal Tadka, Jeera Aloo, Paneer Butter Masala, Raita, Tandoori Roti, Rice.",
      price: 199,
      image: IMAGES.vegThali,
      badge: "Thali",
    },
    {
      name: "Veg Gabbar Thali",
      description:
        "Dal Makhni, Shahi Paneer, Mix Veg, Raita, Tandoori Roti, Rice, Sweet.",
      price: 239,
      image: IMAGES.vegThali,
      badge: "Thali",
    },
    {
      name: "Non Veg Thali",
      description:
        "Kukkad Masala, Dal Tadka, Jeera Aloo, Raita, Tandoori Roti.",
      price: 269,
      image: IMAGES.nonvegThali,
      badge: "Thali",
    },
    {
      name: "Non Veg Gabbar Thali",
      description:
        "Butter Chicken, Dal Makhni, Mix Veg, Raita, Tandoori Roti, Rice, Sweet.",
      price: 299,
      image: IMAGES.nonvegThali,
      badge: "Thali",
    },
  ],
};

const categoryLabels: Record<string, string> = {
  appetizers: "Appetizers",
  soup: "Soups",
  breakfast: "Breakfast",
  biryanirice: "Biryani & Rice",
  chinese: "Chinese",
  sandwichespizza: "Snacks & Pizza",
  rolls: "Rolls",
  pasta: "Pasta",
  raita: "Raita & Thali",
};

/* ─── Item Card Component ──────────────────────────────────── */
function OrderItemCard({
  dish,
  index,
  cartQty,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  dish: OrderDish;
  index: number;
  cartQty: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      data-ocid={`order.item.${index + 1}`}
      className="group relative bg-charcoal-mid rounded-sm overflow-hidden border border-saffron/10 hover:border-saffron/30 transition-all duration-300 hover:shadow-xl hover:shadow-saffron/5 flex flex-col"
    >
      {/* Image / gradient */}
      <div className="relative h-40 overflow-hidden flex-shrink-0">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${dish.gradient ?? "from-charcoal/80 to-charcoal-mid/60"}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-mid via-transparent to-transparent" />
        {dish.badge && (
          <span className="absolute top-2 right-2 font-body text-xs tracking-wider uppercase px-2 py-0.5 bg-saffron text-charcoal font-semibold rounded-sm">
            {dish.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-cream-text text-base font-semibold leading-snug group-hover:text-gold transition-colors flex items-center gap-1.5">
            {(dish.badge === "Veg" || dish.badge === "Non-Veg") && (
              <VegNonVegIcon
                isVeg={dish.badge === "Veg"}
                size={13}
                className="mt-0.5 flex-shrink-0"
              />
            )}
            {dish.name}
          </h3>
          <span className="font-body text-saffron font-bold text-base whitespace-nowrap flex-shrink-0">
            ₹{dish.price}
          </span>
        </div>
        <p className="font-body text-xs text-cream-text/55 leading-relaxed line-clamp-2 mb-4 flex-1">
          {dish.description}
        </p>

        {/* Cart controls */}
        {cartQty === 0 ? (
          <button
            type="button"
            data-ocid={`order.add_button.${index + 1}`}
            onClick={onAdd}
            className="w-full font-body text-xs tracking-widest uppercase py-2.5 bg-saffron/10 border border-saffron/30 text-saffron hover:bg-saffron hover:text-charcoal transition-all duration-200 rounded-sm font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={14} />
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-saffron/10 border border-saffron/30 rounded-sm overflow-hidden">
            <button
              type="button"
              onClick={onDecrease}
              className="px-3 py-2.5 text-saffron hover:bg-saffron hover:text-charcoal transition-all duration-200"
              aria-label={`Decrease ${dish.name}`}
            >
              <Minus size={14} />
            </button>
            <span className="font-body text-sm font-bold text-ivory px-4">
              {cartQty}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="px-3 py-2.5 text-saffron hover:bg-saffron hover:text-charcoal transition-all duration-200"
              aria-label={`Increase ${dish.name}`}
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ─── Cart Panel ───────────────────────────────────────────── */
function CartPanel({
  cart,
  total,
  onIncrease,
  onDecrease,
  onRemove,
  onClearCart,
}: {
  cart: CartItem[];
  total: number;
  onIncrease: (name: string) => void;
  onDecrease: (name: string) => void;
  onRemove: (name: string) => void;
  onClearCart: () => void;
}) {
  const isEmpty = cart.length === 0;

  return (
    <div
      data-ocid="order.cart.panel"
      className="bg-charcoal-mid border border-saffron/20 rounded-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-saffron/15">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-saffron" />
          <h3 className="font-display text-ivory text-lg font-semibold">
            Your Order
          </h3>
          {!isEmpty && (
            <span className="font-body text-xs bg-saffron text-charcoal px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={onClearCart}
            className="font-body text-xs text-cream-text/40 hover:text-cream-text/70 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Items */}
      <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-3">
        {isEmpty ? (
          <p className="font-body text-sm text-cream-text/40 text-center py-6">
            Your cart is empty.
            <br />
            <span className="text-xs">Add items from the menu above.</span>
          </p>
        ) : (
          cart.map((item) => (
            <div key={item.name} className="flex items-center gap-3 group">
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs font-semibold text-cream-text truncate">
                  {item.name}
                </p>
                <p className="font-body text-xs text-saffron">
                  ₹{item.price} × {item.quantity} = ₹
                  {item.price * item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onDecrease(item.name)}
                  className="w-6 h-6 flex items-center justify-center border border-saffron/30 text-saffron hover:bg-saffron hover:text-charcoal rounded-sm transition-all"
                  aria-label={`Decrease ${item.name}`}
                >
                  <Minus size={10} />
                </button>
                <span className="font-body text-xs font-bold text-ivory w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.name)}
                  className="w-6 h-6 flex items-center justify-center border border-saffron/30 text-saffron hover:bg-saffron hover:text-charcoal rounded-sm transition-all"
                  aria-label={`Increase ${item.name}`}
                >
                  <Plus size={10} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.name)}
                  className="w-6 h-6 flex items-center justify-center text-cream-text/30 hover:text-red-400 ml-1 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {!isEmpty && (
        <div className="px-5 py-4 border-t border-saffron/15">
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-cream-text/70 uppercase tracking-wider">
              Total
            </span>
            <span className="font-display text-gold text-xl font-bold">
              ₹{total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Checkout Form ────────────────────────────────────────── */
function CheckoutForm({
  cart,
  total,
  onOrderPlaced,
}: {
  cart: CartItem[];
  total: number;
  onOrderPlaced: () => void;
}) {
  const { actor } = useActor();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [orderError, setOrderError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Please add items to your cart first.");
      return;
    }
    setSubmitting(true);
    setOrderError("");

    try {
      if (!actor) throw new Error("Connection unavailable. Please try again.");
      const backendItems = cart.map((item) => ({
        name: item.name,
        quantity: BigInt(item.quantity),
        price: BigInt(item.price),
      }));
      const backendOrderType =
        orderType === "delivery" ? OrderType.delivery : OrderType.pickup;

      const result = await actor.placeOrder(
        name.trim(),
        phone.trim(),
        orderType === "delivery" ? address.trim() : "Pickup at restaurant",
        backendOrderType,
        backendItems,
        BigInt(total),
      );
      const newOrderId = result.id.toString();
      setPlacedOrderId(newOrderId);
      saveOrderLocally({
        id: newOrderId,
        customerName: name.trim(),
        phone: phone.trim(),
        items: cart.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total,
        orderType,
        address:
          orderType === "delivery" ? address.trim() : "Pickup at restaurant",
        status: "pending",
        timestamp: Date.now(),
      });

      setOrderSuccess(true);
      toast.success("Order placed successfully! 🎉");
      onOrderPlaced();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setOrderError(msg);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        data-ocid="order.success_state"
        className="bg-charcoal-mid border border-saffron/20 rounded-sm p-8 text-center"
      >
        <CheckCircle className="w-14 h-14 text-saffron mx-auto mb-4" />
        <h3 className="font-display text-2xl text-ivory font-bold mb-2">
          Order Confirmed!
        </h3>
        <p className="font-body text-cream-text/70 text-sm mb-1">
          Thank you, <span className="text-gold font-semibold">{name}</span>!
        </p>
        <p className="font-body text-cream-text/70 text-sm mb-4">
          {orderType === "delivery"
            ? `Delivering to: ${address}`
            : "Ready for pickup at Gabbar's, Saifai, Etawah."}
        </p>
        <div className="bg-charcoal rounded-sm p-4 mb-6 text-left space-y-1">
          {cart.map((item) => (
            <div
              key={item.name}
              className="flex justify-between text-xs font-body"
            >
              <span className="text-cream-text/70">
                {item.name} × {item.quantity}
              </span>
              <span className="text-saffron font-semibold">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-body pt-2 border-t border-saffron/15 mt-2">
            <span className="text-cream-text font-semibold">Total</span>
            <span className="text-gold font-bold">₹{total}</span>
          </div>
        </div>
        {placedOrderId && (
          <div className="bg-saffron/10 border border-saffron/30 rounded-sm px-4 py-3 mb-4">
            <div className="font-body text-xs text-saffron/70 uppercase tracking-wider mb-1">
              Your Order ID
            </div>
            <div className="font-display text-gold text-2xl font-bold">
              #{placedOrderId}
            </div>
            <div className="font-body text-xs text-cream-text/60 mt-1">
              Save this to track your order
            </div>
          </div>
        )}
        <p className="font-body text-xs text-cream-text/40 mb-3">
          We'll call you at {phone} to confirm your order.
        </p>
        <a
          href="/track-order"
          className="inline-block font-body text-xs tracking-widest uppercase px-5 py-2.5 border border-saffron/40 text-saffron hover:bg-saffron/10 transition-all rounded-sm"
        >
          Track Your Order →
        </a>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-charcoal-mid border border-saffron/20 rounded-sm p-6 space-y-5"
    >
      <h3 className="font-display text-ivory text-xl font-semibold mb-1">
        Checkout Details
      </h3>

      {/* Order type toggle */}
      <div className="flex gap-3">
        <label className="flex-1 cursor-pointer">
          <input
            type="radio"
            name="orderType"
            value="delivery"
            data-ocid="order.delivery.toggle"
            checked={orderType === "delivery"}
            onChange={() => setOrderType("delivery")}
            className="sr-only"
          />
          <div
            className={`text-center py-3 border rounded-sm font-body text-xs tracking-widest uppercase font-semibold transition-all duration-200 ${
              orderType === "delivery"
                ? "bg-saffron border-saffron text-charcoal"
                : "bg-transparent border-saffron/30 text-cream-text/60 hover:border-saffron/60 hover:text-cream-text"
            }`}
          >
            🛵 Delivery
          </div>
        </label>
        <label className="flex-1 cursor-pointer">
          <input
            type="radio"
            name="orderType"
            value="pickup"
            data-ocid="order.pickup.toggle"
            checked={orderType === "pickup"}
            onChange={() => setOrderType("pickup")}
            className="sr-only"
          />
          <div
            className={`text-center py-3 border rounded-sm font-body text-xs tracking-widest uppercase font-semibold transition-all duration-200 ${
              orderType === "pickup"
                ? "bg-saffron border-saffron text-charcoal"
                : "bg-transparent border-saffron/30 text-cream-text/60 hover:border-saffron/60 hover:text-cream-text"
            }`}
          >
            🏪 Pickup
          </div>
        </label>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label
          htmlFor="order-name"
          className="font-body text-xs tracking-widest uppercase text-cream-text/60"
        >
          Full Name
        </Label>
        <Input
          id="order-name"
          type="text"
          data-ocid="order.name.input"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          className="bg-charcoal border-saffron/20 text-ivory placeholder:text-cream-text/30 focus:border-saffron/60 focus-visible:ring-saffron/20"
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label
          htmlFor="order-phone"
          className="font-body text-xs tracking-widest uppercase text-cream-text/60"
        >
          Phone Number
        </Label>
        <Input
          id="order-phone"
          type="tel"
          data-ocid="order.phone.input"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          autoComplete="tel"
          className="bg-charcoal border-saffron/20 text-ivory placeholder:text-cream-text/30 focus:border-saffron/60 focus-visible:ring-saffron/20"
        />
      </div>

      {/* Address (delivery only) */}
      <AnimatePresence>
        {orderType === "delivery" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-1.5 overflow-hidden"
          >
            <Label
              htmlFor="order-address"
              className="font-body text-xs tracking-widest uppercase text-cream-text/60"
            >
              Delivery Address
            </Label>
            <Textarea
              id="order-address"
              data-ocid="order.address.textarea"
              required={orderType === "delivery"}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no., Street, Landmark, City"
              rows={3}
              className="bg-charcoal border-saffron/20 text-ivory placeholder:text-cream-text/30 focus:border-saffron/60 focus-visible:ring-saffron/20 resize-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {orderError && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            data-ocid="order.error_state"
            className="font-body text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2"
          >
            {orderError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="submit"
        data-ocid="order.submit_button"
        disabled={submitting || cart.length === 0}
        className="w-full font-body text-sm tracking-widest uppercase py-6 bg-saffron text-charcoal hover:bg-gold font-semibold transition-all duration-300 rounded-sm disabled:opacity-40"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Placing Order…
          </>
        ) : (
          `Place Order · ₹${total}`
        )}
      </Button>

      {orderType === "pickup" && (
        <p className="font-body text-xs text-cream-text/40 text-center">
          Pickup at Gabbar's, Saifai, Etawah — 11 AM to 11 PM daily
        </p>
      )}
    </form>
  );
}

/* ─── Main Section ─────────────────────────────────────────── */
export default function OrderingSection() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCartQty = (name: string) =>
    cart.find((i) => i.name === name)?.quantity ?? 0;

  const addItem = (dish: OrderDish) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === dish.name);
      if (existing) {
        return prev.map((i) =>
          i.name === dish.name ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const increaseQty = (name: string) => {
    setCart((prev) =>
      prev.map((i) =>
        i.name === name ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  };

  const decreaseQty = (name: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.name === name);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i.name !== name);
      return prev.map((i) =>
        i.name === name ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const removeItem = (name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  };

  const clearCart = () => setCart([]);

  const handleOrderPlaced = () => {
    clearCart();
    setMobileCartOpen(false);
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <section
      id="order"
      className="relative bg-charcoal-mid py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Top border */}
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
            — Order Online —
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory font-bold mb-6">
            Feast at Home
          </h2>
          <div className="max-w-lg mx-auto">
            <OrnamentDivider light />
          </div>
          <p className="font-body text-cream-text/70 mt-6 max-w-2xl mx-auto text-base leading-relaxed">
            Order your favourite North Indian & Mughlai dishes for home delivery
            or restaurant pickup. We cook fresh with love.
          </p>
        </motion.div>

        {/* Layout: menu + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Menu tabs */}
          <div>
            <Tabs defaultValue="appetizers">
              <div className="flex justify-start mb-8 overflow-x-auto pb-2">
                <TabsList className="bg-charcoal border border-saffron/20 rounded-sm p-1 gap-1 flex flex-nowrap h-auto">
                  {Object.keys(orderMenuData).map((cat) => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      data-ocid={`order.${cat}.tab`}
                      className="font-body text-xs tracking-widest uppercase text-cream-text/60 data-[state=active]:bg-saffron data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-sm px-4 py-2 transition-all duration-200 hover:text-cream-text whitespace-nowrap"
                    >
                      {categoryLabels[cat]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.entries(orderMenuData).map(([cat, dishes]) => (
                <TabsContent key={cat} value={cat}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {dishes.map((dish, i) => (
                      <OrderItemCard
                        key={dish.name}
                        dish={dish}
                        index={i}
                        cartQty={getCartQty(dish.name)}
                        onAdd={() => addItem(dish)}
                        onIncrease={() => increaseQty(dish.name)}
                        onDecrease={() => decreaseQty(dish.name)}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Right sidebar – desktop */}
          <div className="hidden lg:flex flex-col gap-5 sticky top-24">
            <CartPanel
              cart={cart}
              total={total}
              onIncrease={increaseQty}
              onDecrease={decreaseQty}
              onRemove={removeItem}
              onClearCart={clearCart}
            />
            {cart.length > 0 && (
              <CheckoutForm
                cart={cart}
                total={total}
                onOrderPlaced={handleOrderPlaced}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky cart bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-4 left-4 right-4 z-40 lg:hidden"
          >
            <button
              type="button"
              onClick={() => setMobileCartOpen(true)}
              className="w-full flex items-center justify-between bg-saffron text-charcoal px-5 py-4 rounded-sm font-semibold shadow-2xl shadow-saffron/30 font-body text-sm uppercase tracking-widest"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>
                  {cartCount} item{cartCount > 1 ? "s" : ""}
                </span>
              </div>
              <span>View Cart · ₹{total}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile cart drawer */}
      <AnimatePresence>
        {mobileCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileCartOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-charcoal rounded-t-2xl border-t border-saffron/20 p-5 pb-safe max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-ivory text-xl font-semibold">
                  Your Cart
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileCartOpen(false)}
                  className="text-cream-text/50 hover:text-cream-text transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="space-y-5">
                <CartPanel
                  cart={cart}
                  total={total}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  onRemove={removeItem}
                  onClearCart={clearCart}
                />
                {cart.length > 0 && (
                  <CheckoutForm
                    cart={cart}
                    total={total}
                    onOrderPlaced={handleOrderPlaced}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />
    </section>
  );
}
