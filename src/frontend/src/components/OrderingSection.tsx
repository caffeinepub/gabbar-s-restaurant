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
import { OrderType } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { OrnamentDivider } from "./HeroSection";

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
  starters: [
    {
      name: "Seekh Kebab",
      description:
        "Minced lamb & spiced herbs on iron skewers, grilled to perfection in a clay tandoor.",
      price: 420,
      image: "/assets/generated/seekh-kebab.dim_600x400.jpg",
      badge: "Chef's Pick",
    },
    {
      name: "Galouti Kebab",
      description:
        "Silky-smooth Awadhi-style kebabs, 160 spices pressed into melt-in-the-mouth patties.",
      price: 480,
      gradient: "from-amber-900/80 to-orange-900/60",
    },
    {
      name: "Tandoori Jhinga",
      description:
        "Jumbo tiger prawns marinated in ajwain yoghurt, charred fragrant in the tandoor.",
      price: 650,
      gradient: "from-red-900/80 to-orange-800/60",
      badge: "Seafood",
    },
    {
      name: "Dahi Ke Kebab",
      description:
        "Crisp-fried hung-curd patties with green chutney, a Lucknow royal household classic.",
      price: 320,
      gradient: "from-yellow-900/60 to-amber-800/60",
    },
    {
      name: "Kakori Kebab",
      description:
        "Feather-light Kakori-style minced lamb kebabs, traditionally served with laccha paratha.",
      price: 460,
      gradient: "from-stone-800/80 to-amber-900/60",
    },
  ],
  mains: [
    {
      name: "Murgh Makhani",
      description:
        "Tender tandoor-roasted chicken simmered in velvety tomato-butter-cream sauce.",
      price: 520,
      image: "/assets/generated/butter-chicken.dim_600x400.jpg",
      badge: "Bestseller",
    },
    {
      name: "Dum Biryani",
      description:
        "Long-grain Basmati sealed in a handi with saffron milk, whole spices, and caramelised onions.",
      price: 580,
      image: "/assets/generated/biryani.dim_600x400.jpg",
      badge: "Signature",
    },
    {
      name: "Dal Makhani",
      description:
        "Black urad dal slow-cooked overnight, finished with cream and smoky butter.",
      price: 340,
      image: "/assets/generated/dal-makhani.dim_600x400.jpg",
    },
    {
      name: "Rogan Josh",
      description:
        "Kashmiri slow-braised lamb shank in aromatic Kashmiri chilli gravy with whole spices.",
      price: 620,
      gradient: "from-red-950/80 to-rose-900/60",
      badge: "Kashmiri",
    },
    {
      name: "Paneer Lababdar",
      description:
        "Cottage cheese cubes in a rich, smoky makhani-style gravy — a vegetarian showstopper.",
      price: 420,
      gradient: "from-orange-900/70 to-amber-800/60",
    },
  ],
  breads: [
    {
      name: "Garlic Naan",
      description:
        "Pillowy naans leavened overnight, baked on the clay wall of the tandoor, brushed with butter.",
      price: 80,
      image: "/assets/generated/naan-bread.dim_600x400.jpg",
      badge: "Most Ordered",
    },
    {
      name: "Laccha Paratha",
      description:
        "Flaky multi-layered whole-wheat paratha, slow-cooked on a tawa with desi ghee.",
      price: 90,
      gradient: "from-yellow-800/70 to-amber-700/60",
    },
    {
      name: "Sheermal",
      description:
        "Saffron-perfumed Awadhi sweet bread, served alongside kebabs and rich gravies.",
      price: 110,
      gradient: "from-amber-700/70 to-yellow-700/60",
      badge: "Awadhi",
    },
    {
      name: "Kulcha",
      description:
        "Leavened stuffed bread with spiced potato or paneer filling, a Punjabi breakfast staple.",
      price: 100,
      gradient: "from-stone-700/70 to-amber-800/60",
    },
  ],
  desserts: [
    {
      name: "Gulab Jamun",
      description:
        "Milk-solid spheres soaked in rose-saffron syrup, crowned with crushed pistachios.",
      price: 180,
      image: "/assets/generated/gulab-jamun.dim_600x400.jpg",
      badge: "House Favourite",
    },
    {
      name: "Shahi Tukda",
      description:
        "Golden-fried bread drenched in condensed milk rabri, scattered with saffron and almonds.",
      price: 220,
      gradient: "from-amber-900/70 to-yellow-800/60",
      badge: "Mughlai Royal",
    },
    {
      name: "Phirni",
      description:
        "Set rice pudding scented with rose water and cardamom, served in individual earthen matkas.",
      price: 160,
      gradient: "from-stone-700/60 to-amber-700/50",
    },
    {
      name: "Kulfi Falooda",
      description:
        "Dense pistachio kulfi on rose falooda noodles, finished with basil seeds and vermicelli.",
      price: 200,
      gradient: "from-green-900/60 to-emerald-800/50",
    },
  ],
  drinks: [
    {
      name: "Kesar Thandai",
      description:
        "Chilled almond-saffron milk with rose, fennel and cardamom — a festive North Indian cooler.",
      price: 180,
      gradient: "from-amber-700/60 to-orange-700/50",
      badge: "Seasonal",
    },
    {
      name: "Mango Lassi",
      description:
        "Thick Alphonso mango blended with strained yoghurt and a pinch of cardamom.",
      price: 140,
      gradient: "from-yellow-700/70 to-orange-600/50",
    },
    {
      name: "Rose Sharbat",
      description:
        "House-made rose concentrate with crushed ice and fresh mint.",
      price: 120,
      gradient: "from-pink-900/60 to-rose-800/50",
    },
    {
      name: "Masala Chaas",
      description:
        "Spiced buttermilk with roasted cumin, ginger, and fresh coriander — light and digestive.",
      price: 90,
      gradient: "from-green-800/60 to-teal-800/50",
    },
    {
      name: "Kashmiri Kahwa",
      description:
        "Aromatic green tea steeped with saffron, cinnamon sticks, cardamom, and almonds.",
      price: 160,
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
          <h3 className="font-display text-cream-text text-base font-semibold leading-snug group-hover:text-gold transition-colors">
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

      await actor.placeOrder(
        name.trim(),
        phone.trim(),
        orderType === "delivery" ? address.trim() : "Pickup at restaurant",
        backendOrderType,
        backendItems,
        BigInt(total),
      );

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
        <p className="font-body text-xs text-cream-text/40">
          We'll call you at {phone} to confirm your order.
        </p>
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
            <Tabs defaultValue="starters">
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
