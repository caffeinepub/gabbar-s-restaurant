import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  ChefHat,
  Clock,
  Package,
  RefreshCw,
  Search,
  Star,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { OrnamentDivider } from "../components/HeroSection";
import { useActor } from "../hooks/useActor";

const STORAGE_KEY = "gabbar_orders";

export interface StoredOrder {
  id: string;
  customerName: string;
  phone: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  orderType: string;
  address: string;
  status: string;
  timestamp: number;
}

export function saveOrderLocally(order: StoredOrder) {
  try {
    const existing: StoredOrder[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );
    existing.unshift(order);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // ignore
  }
}

function getLocalOrder(orderId: string): StoredOrder | null {
  try {
    const orders: StoredOrder[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );
    return orders.find((o) => o.id === orderId) || null;
  } catch {
    return null;
  }
}

const STATUS_STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    icon: Clock,
    color: "text-amber-400",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle,
    color: "text-blue-400",
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: ChefHat,
    color: "text-orange-400",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    icon: Truck,
    color: "text-purple-400",
  },
  { key: "delivered", label: "Delivered", icon: Star, color: "text-green-400" },
];

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

function getStatusBadgeClass(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    confirmed: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    preparing: "bg-orange-500/20 text-orange-300 border-orange-400/30",
    out_for_delivery: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    delivered: "bg-green-500/20 text-green-300 border-green-400/30",
    cancelled: "bg-red-500/20 text-red-300 border-red-400/30",
  };
  return map[status] || map.pending;
}

function formatOrderId(id: string) {
  return id.startsWith("#") ? id : `#${id}`;
}

function getEstimatedTime(status: string) {
  const map: Record<string, string> = {
    pending: "Waiting for confirmation (5-10 min)",
    confirmed: "Order confirmed! Preparing soon (20-30 min)",
    preparing: "Being cooked fresh for you (15-20 min)",
    out_for_delivery: "On the way! (10-15 min)",
    delivered: "Delivered! Enjoy your meal 🎉",
    cancelled: "Order cancelled",
  };
  return map[status] || "Processing...";
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { actor } = useActor();

  const searchOrder = useCallback(
    async (id: string) => {
      const cleaned = id.trim().replace(/^#/, "");
      if (!cleaned) return;
      setLoading(true);
      setNotFound(false);
      setOrder(null);

      // 1. Check localStorage
      const local = getLocalOrder(cleaned);
      if (local) {
        // Try to get fresh status from backend
        if (actor) {
          try {
            const orders = await actor.getOrders();
            const backendOrder = orders.find(
              (o) => o.id.toString() === cleaned,
            );
            if (backendOrder) {
              const updated: StoredOrder = {
                ...local,
                status: Object.keys(backendOrder.status)[0] as string,
              };
              setOrder(updated);
              setLastRefresh(new Date());
              setLoading(false);
              return;
            }
          } catch {
            // fall through to local data
          }
        }
        setOrder(local);
        setLastRefresh(new Date());
        setLoading(false);
        return;
      }

      // 2. Try backend directly
      if (actor) {
        try {
          const orders = await actor.getOrders();
          const backendOrder = orders.find((o) => o.id.toString() === cleaned);
          if (backendOrder) {
            const found: StoredOrder = {
              id: cleaned,
              customerName: backendOrder.customerName,
              phone: backendOrder.phone,
              items: backendOrder.items.map((i) => ({
                name: i.name,
                quantity: Number(i.quantity),
                price: Number(i.price),
              })),
              total: Number(backendOrder.totalAmount),
              orderType: Object.keys(backendOrder.orderType)[0],
              address: backendOrder.address,
              status: Object.keys(backendOrder.status)[0],
              timestamp: Number(backendOrder.timestamp) / 1_000_000,
            };
            setOrder(found);
            setLastRefresh(new Date());
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }

      setNotFound(true);
      setLoading(false);
    },
    [actor],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(orderId);
  };

  // Auto-refresh every 30 seconds if order is active
  useEffect(() => {
    if (!order || order.status === "delivered" || order.status === "cancelled")
      return;
    const interval = setInterval(() => {
      searchOrder(order.id);
    }, 30000);
    return () => clearInterval(interval);
  }, [order, searchOrder]);

  const currentStepIndex = order ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-charcoal py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/70 mb-3 block">
            — Live Tracking —
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-ivory font-bold mb-4">
            Track Your Order
          </h1>
          <div className="max-w-xs mx-auto mb-4">
            <OrnamentDivider light />
          </div>
          <p className="font-body text-cream-text/60 text-sm">
            Enter your Order ID to check the live status of your order.
          </p>
        </motion.div>

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSearch}
          className="flex gap-3 mb-10"
          data-ocid="track.section"
        >
          <Input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. 1, 2, 3)"
            data-ocid="track.input"
            className="bg-charcoal-mid border-saffron/30 text-ivory placeholder:text-cream-text/40 focus:border-saffron flex-1 font-body"
          />
          <Button
            type="submit"
            disabled={loading || !orderId.trim()}
            data-ocid="track.submit_button"
            className="bg-saffron text-charcoal hover:bg-gold font-body uppercase tracking-widest text-xs px-6 rounded-sm"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {loading ? "Searching..." : "Track"}
          </Button>
        </motion.form>

        {/* Not found */}
        <AnimatePresence>
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="track.error_state"
              className="bg-red-500/10 border border-red-500/20 rounded-sm p-6 text-center"
            >
              <Package size={32} className="text-red-400/60 mx-auto mb-3" />
              <p className="font-display text-ivory text-lg mb-1">
                Order Not Found
              </p>
              <p className="font-body text-cream-text/60 text-sm">
                Order ID not found. Please check your Order ID or call us at{" "}
                <a
                  href="tel:+917983711781"
                  className="text-saffron hover:text-gold underline"
                >
                  +91 79837 11781
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order details */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              data-ocid="track.card"
              className="bg-charcoal-mid border border-saffron/20 rounded-sm overflow-hidden"
            >
              {/* Order header */}
              <div className="bg-charcoal border-b border-saffron/20 px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-display text-gold text-xl font-bold">
                    Order {formatOrderId(order.id)}
                  </div>
                  <div className="font-body text-cream-text/60 text-xs mt-0.5">
                    {order.customerName} ·{" "}
                    {order.orderType === "delivery" ? "Delivery" : "Pickup"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`font-body text-xs uppercase tracking-wider rounded-sm border ${getStatusBadgeClass(order.status)}`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                  {lastRefresh && (
                    <button
                      type="button"
                      onClick={() => searchOrder(order.id)}
                      data-ocid="track.secondary_button"
                      className="text-cream-text/40 hover:text-saffron transition-colors"
                      title="Refresh status"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Status timeline */}
              <div className="px-6 py-6">
                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute left-5 top-5 bottom-5 w-px bg-saffron/10" />
                  <div
                    className="absolute left-5 top-5 w-px bg-saffron/60 transition-all duration-1000"
                    style={{
                      height: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%`,
                    }}
                  />

                  <div className="space-y-6">
                    {STATUS_STEPS.map((step, idx) => {
                      const isActive =
                        STATUS_ORDER.indexOf(order.status) >= idx;
                      const isCurrent =
                        STATUS_ORDER.indexOf(order.status) === idx;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex items-start gap-5">
                          <div
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                              isCurrent
                                ? "bg-saffron border-saffron shadow-lg shadow-saffron/30"
                                : isActive
                                  ? "bg-saffron/30 border-saffron/60"
                                  : "bg-charcoal border-saffron/20"
                            }`}
                          >
                            <Icon
                              size={16}
                              className={
                                isActive
                                  ? "text-charcoal"
                                  : "text-cream-text/30"
                              }
                            />
                          </div>
                          <div className="pt-2">
                            <div
                              className={`font-body text-sm font-semibold ${
                                isCurrent
                                  ? "text-gold"
                                  : isActive
                                    ? "text-ivory"
                                    : "text-cream-text/40"
                              }`}
                            >
                              {step.label}
                              {isCurrent && (
                                <span className="ml-2 font-body text-xs text-saffron/80 font-normal">
                                  (Current)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Estimated time */}
              <div className="px-6 pb-4">
                <div className="bg-saffron/10 border border-saffron/20 rounded-sm px-4 py-3">
                  <div className="font-body text-xs text-saffron/70 uppercase tracking-wider mb-1">
                    Status Update
                  </div>
                  <div className="font-body text-sm text-ivory">
                    {getEstimatedTime(order.status)}
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="border-t border-saffron/10 px-6 py-4">
                <div className="font-body text-xs text-saffron/60 uppercase tracking-wider mb-3">
                  Order Items
                </div>
                <div className="space-y-1.5">
                  {order.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between font-body text-sm"
                    >
                      <span className="text-cream-text/80">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-ivory">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-saffron/10 flex justify-between font-body text-sm font-bold">
                  <span className="text-ivory">Total</span>
                  <span className="text-gold">₹{order.total}</span>
                </div>
              </div>

              {/* Contact help */}
              <div className="px-6 py-4 border-t border-saffron/10 bg-charcoal/50">
                <p className="font-body text-xs text-cream-text/50 text-center">
                  Need help?{" "}
                  <a
                    href="tel:+917983711781"
                    className="text-saffron hover:text-gold underline"
                  >
                    Call +91 79837 11781
                  </a>
                  {" or "}
                  <a
                    href="https://wa.me/917983711781"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:text-[#1fb058] underline"
                  >
                    WhatsApp us
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help text when no search yet */}
        {!order && !notFound && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            data-ocid="track.empty_state"
            className="text-center py-12"
          >
            <Package size={48} className="text-saffron/20 mx-auto mb-4" />
            <p className="font-body text-cream-text/40 text-sm">
              Your Order ID was shown after placing your order.
              <br />
              Can't find it? Call us at{" "}
              <a href="tel:+917983711781" className="text-saffron underline">
                +91 79837 11781
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
