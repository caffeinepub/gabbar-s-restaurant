import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle,
  Crown,
  Gift,
  Phone,
  Star,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrnamentDivider } from "../components/HeroSection";

const LOYALTY_KEY = "gabbar_loyalty";

interface LoyaltyTransaction {
  type: "earned" | "redeemed";
  points: number;
  description: string;
  orderId?: string;
  date: number;
}

interface LoyaltyAccount {
  phone: string;
  name: string;
  points: number;
  totalEarned: number;
  transactions: LoyaltyTransaction[];
}

function getLoyaltyData(): Record<string, LoyaltyAccount> {
  try {
    return JSON.parse(localStorage.getItem(LOYALTY_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLoyaltyData(data: Record<string, LoyaltyAccount>) {
  localStorage.setItem(LOYALTY_KEY, JSON.stringify(data));
}

export function addLoyaltyPoints(
  phone: string,
  name: string,
  orderId: string,
  orderTotal: number,
) {
  const data = getLoyaltyData();
  const points = Math.floor(orderTotal / 10);
  if (points <= 0) return;
  const existing = data[phone] || {
    phone,
    name,
    points: 0,
    totalEarned: 0,
    transactions: [],
  };
  existing.points += points;
  existing.totalEarned += points;
  existing.name = name;
  existing.transactions.unshift({
    type: "earned",
    points,
    description: `Order #${orderId} delivered`,
    orderId,
    date: Date.now(),
  });
  data[phone] = existing;
  saveLoyaltyData(data);
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LoyaltyPage() {
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{
    valid: boolean;
    msg: string;
  } | null>(null);

  const COUPONS: Record<
    string,
    {
      type: "fixed" | "percent";
      value: number;
      minOrder: number;
      label: string;
    }
  > = {
    GABBAR10: {
      type: "percent",
      value: 10,
      minOrder: 200,
      label: "10% off on orders above ₹200",
    },
    WELCOME50: {
      type: "fixed",
      value: 50,
      minOrder: 300,
      label: "₹50 off on orders above ₹300",
    },
    ROYAL100: {
      type: "fixed",
      value: 100,
      minOrder: 500,
      label: "₹100 off on orders above ₹500",
    },
    LOYALTY20: {
      type: "percent",
      value: 20,
      minOrder: 400,
      label: "20% off for loyalty members (orders above ₹400)",
    },
  };

  // Load saved phone
  useEffect(() => {
    const saved = localStorage.getItem("gabbar_loyalty_phone");
    if (saved) setPhone(saved);
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.trim().replace(/\D/g, "").slice(-10);
    if (cleaned.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    const data = getLoyaltyData();
    if (data[cleaned]) {
      setAccount(data[cleaned]);
      setNotFound(false);
      localStorage.setItem("gabbar_loyalty_phone", cleaned);
    } else {
      setAccount(null);
      setNotFound(true);
    }
  };

  const handleRedeem = () => {
    if (!account) return;
    const pts = Number.parseInt(redeemPoints, 10);
    if (!pts || pts <= 0 || pts % 100 !== 0) {
      toast.error("Please enter points in multiples of 100.");
      return;
    }
    if (pts > account.points) {
      toast.error("Not enough points.");
      return;
    }
    const discount = Math.floor(pts / 100) * 10;
    const data = getLoyaltyData();
    const acc = data[account.phone];
    acc.points -= pts;
    acc.transactions.unshift({
      type: "redeemed",
      points: pts,
      description: `Redeemed for ₹${discount} discount`,
      date: Date.now(),
    });
    saveLoyaltyData(data);
    setAccount({ ...acc });
    setRedeemPoints("");
    toast.success(
      `✅ ${pts} points redeemed! You get ₹${discount} off your next order.`,
    );
  };

  const handleCouponValidate = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const coupon = COUPONS[code];
    if (coupon) {
      setCouponCode(code);
      setCouponMsg({ valid: true, msg: `Valid! ${coupon.label}` });
      toast.success(`Coupon ${code} applied!`);
    } else {
      setCouponCode("");
      setCouponMsg({
        valid: false,
        msg: "Invalid coupon code. Please try again.",
      });
    }
  };

  const discountFromPoints = account
    ? Math.floor(account.points / 100) * 10
    : 0;
  const tier = account
    ? account.totalEarned >= 1000
      ? "Gold"
      : account.totalEarned >= 500
        ? "Silver"
        : "Bronze"
    : null;

  const tierColors: Record<string, string> = {
    Gold: "text-amber-400 border-amber-400/40",
    Silver: "text-slate-300 border-slate-300/40",
    Bronze: "text-orange-400 border-orange-400/40",
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-charcoal py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Crown size={40} className="text-gold mx-auto mb-4" />
          <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/70 mb-3 block">
            — Exclusive Rewards —
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-ivory font-bold mb-4">
            Gabbar's Loyalty Club
          </h1>
          <div className="max-w-xs mx-auto mb-4">
            <OrnamentDivider light />
          </div>
          <p className="font-body text-cream-text/60 text-sm max-w-md mx-auto">
            Earn 1 point for every ₹10 spent. Redeem 100 points for ₹10 off your
            next order.
          </p>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              icon: TrendingUp,
              title: "Earn Points",
              desc: "1 point per ₹10 spent",
            },
            {
              icon: Gift,
              title: "Redeem Rewards",
              desc: "100 points = ₹10 off",
            },
            { icon: Star, title: "Level Up", desc: "Bronze → Silver → Gold" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-charcoal-mid border border-saffron/20 rounded-sm px-5 py-4 text-center"
            >
              <Icon size={20} className="text-saffron mx-auto mb-2" />
              <div className="font-display text-ivory text-sm font-semibold mb-1">
                {title}
              </div>
              <div className="font-body text-cream-text/50 text-xs">{desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Phone lookup */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-charcoal-mid border border-saffron/20 rounded-sm p-6 mb-6"
        >
          <h2 className="font-display text-ivory text-xl font-semibold mb-4 flex items-center gap-2">
            <Phone size={18} className="text-saffron" />
            Look Up Your Account
          </h2>
          <form
            onSubmit={handleLookup}
            className="flex gap-3"
            data-ocid="loyalty.section"
          >
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your 10-digit phone number"
              data-ocid="loyalty.input"
              type="tel"
              maxLength={10}
              className="bg-charcoal border-saffron/30 text-ivory placeholder:text-cream-text/40 focus:border-saffron font-body"
            />
            <Button
              type="submit"
              data-ocid="loyalty.submit_button"
              className="bg-saffron text-charcoal hover:bg-gold font-body uppercase tracking-widest text-xs px-6 rounded-sm whitespace-nowrap"
            >
              Check Points
            </Button>
          </form>

          {/* Not found */}
          <AnimatePresence>
            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-ocid="loyalty.error_state"
                className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-sm px-4 py-3"
              >
                <p className="font-body text-amber-300 text-sm">
                  No account found for this number. Points are added
                  automatically when your order is delivered.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Account details */}
        <AnimatePresence>
          {account && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Points card */}
              <div
                className="bg-charcoal-mid border border-saffron/30 rounded-sm overflow-hidden"
                data-ocid="loyalty.card"
              >
                <div className="bg-gradient-to-r from-charcoal to-charcoal-mid px-6 py-5 border-b border-saffron/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-body text-cream-text/60 text-xs uppercase tracking-wider mb-1">
                        Account Holder
                      </div>
                      <div className="font-display text-ivory text-xl font-bold">
                        {account.name}
                      </div>
                      <div className="font-body text-cream-text/50 text-xs mt-0.5">
                        +91 {account.phone}
                      </div>
                    </div>
                    {tier && (
                      <Badge
                        className={`font-body text-xs uppercase tracking-wider rounded-sm border bg-transparent ${tierColors[tier]}`}
                      >
                        {tier} Member
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-saffron/10">
                  <div className="px-6 py-5">
                    <div className="font-body text-saffron/70 text-xs uppercase tracking-wider mb-1">
                      Available Points
                    </div>
                    <div className="font-display text-gold text-4xl font-bold">
                      {account.points}
                    </div>
                    <div className="font-body text-cream-text/50 text-xs mt-1">
                      ≈ ₹{discountFromPoints} discount
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="font-body text-saffron/70 text-xs uppercase tracking-wider mb-1">
                      Total Earned
                    </div>
                    <div className="font-display text-ivory text-4xl font-bold">
                      {account.totalEarned}
                    </div>
                    <div className="font-body text-cream-text/50 text-xs mt-1">
                      lifetime points
                    </div>
                  </div>
                </div>
              </div>

              {/* Redeem section */}
              {account.points >= 100 && (
                <div className="bg-charcoal-mid border border-gold/20 rounded-sm p-6">
                  <h3 className="font-display text-ivory text-lg font-semibold mb-3 flex items-center gap-2">
                    <Gift size={18} className="text-gold" />
                    Redeem Points
                  </h3>
                  <p className="font-body text-cream-text/60 text-sm mb-4">
                    You have{" "}
                    <span className="text-gold font-semibold">
                      {account.points} points
                    </span>
                    . Redeem in multiples of 100 (100 pts = ₹10).
                  </p>
                  <div className="flex gap-3">
                    <Input
                      value={redeemPoints}
                      onChange={(e) => setRedeemPoints(e.target.value)}
                      placeholder="Enter points (e.g. 100, 200)"
                      data-ocid="loyalty.textarea"
                      type="number"
                      min={100}
                      step={100}
                      max={account.points}
                      className="bg-charcoal border-gold/30 text-ivory placeholder:text-cream-text/40 focus:border-gold font-body"
                    />
                    <Button
                      type="button"
                      onClick={handleRedeem}
                      data-ocid="loyalty.primary_button"
                      className="bg-gold text-charcoal hover:bg-saffron font-body uppercase tracking-widest text-xs px-6 rounded-sm whitespace-nowrap font-semibold"
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              )}

              {/* Transaction history */}
              {account.transactions.length > 0 && (
                <div className="bg-charcoal-mid border border-saffron/20 rounded-sm p-6">
                  <h3 className="font-display text-ivory text-lg font-semibold mb-4">
                    Transaction History
                  </h3>
                  <div className="space-y-3" data-ocid="loyalty.list">
                    {account.transactions.slice(0, 10).map((tx, i) => (
                      <div
                        key={tx.date + tx.description}
                        data-ocid={`loyalty.item.${i + 1}`}
                        className="flex items-center justify-between py-2.5 border-b border-saffron/10 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              tx.type === "earned"
                                ? "bg-green-500/20"
                                : "bg-amber-500/20"
                            }`}
                          >
                            {tx.type === "earned" ? (
                              <TrendingUp
                                size={14}
                                className="text-green-400"
                              />
                            ) : (
                              <Gift size={14} className="text-amber-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-body text-sm text-ivory">
                              {tx.description}
                            </div>
                            <div className="font-body text-xs text-cream-text/50">
                              {formatDate(tx.date)}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-display text-base font-bold ${
                            tx.type === "earned"
                              ? "text-green-400"
                              : "text-amber-400"
                          }`}
                        >
                          {tx.type === "earned" ? "+" : "-"}
                          {tx.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coupon section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-charcoal-mid border border-saffron/20 rounded-sm p-6 mt-6"
        >
          <h2 className="font-display text-ivory text-xl font-semibold mb-2 flex items-center gap-2">
            <Gift size={18} className="text-saffron" />
            Coupon Codes
          </h2>
          <p className="font-body text-cream-text/60 text-sm mb-4">
            Enter a coupon code below to check your discount.
          </p>

          <div className="flex gap-3 mb-4">
            <Input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Enter coupon code (e.g. GABBAR10)"
              data-ocid="loyalty.search_input"
              className="bg-charcoal border-saffron/30 text-ivory placeholder:text-cream-text/40 focus:border-saffron font-body font-mono tracking-wider"
            />
            <Button
              type="button"
              onClick={handleCouponValidate}
              data-ocid="loyalty.secondary_button"
              className="bg-saffron/80 text-charcoal hover:bg-saffron font-body uppercase tracking-widest text-xs px-6 rounded-sm whitespace-nowrap"
            >
              Validate
            </Button>
          </div>

          <AnimatePresence>
            {couponMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-ocid={
                  couponMsg.valid
                    ? "loyalty.success_state"
                    : "loyalty.error_state"
                }
                className={`flex items-start gap-3 px-4 py-3 rounded-sm border ${
                  couponMsg.valid
                    ? "bg-green-500/10 border-green-500/20 text-green-300"
                    : "bg-red-500/10 border-red-500/20 text-red-300"
                }`}
              >
                {couponMsg.valid ? (
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                )}
                <span className="font-body text-sm">{couponMsg.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Available coupons */}
          <div className="mt-5">
            <div className="font-body text-xs text-saffron/60 uppercase tracking-wider mb-3">
              Available Coupons
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(COUPONS).map(([code, coupon]) => (
                <button
                  type="button"
                  key={code}
                  className={`border rounded-sm px-4 py-3 cursor-pointer transition-all ${
                    couponCode === code
                      ? "border-saffron/60 bg-saffron/10"
                      : "border-saffron/20 hover:border-saffron/40"
                  }`}
                  onClick={() => {
                    setCouponInput(code);
                  }}
                  data-ocid={`loyalty.item.${Object.keys(COUPONS).indexOf(code) + 1}`}
                >
                  <div className="font-mono text-gold text-sm font-bold tracking-wider">
                    {code}
                  </div>
                  <div className="font-body text-cream-text/60 text-xs mt-0.5">
                    {coupon.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
