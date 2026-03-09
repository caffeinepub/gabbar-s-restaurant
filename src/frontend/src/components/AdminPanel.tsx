import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  LogOut,
  Package,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { Order, Reservation } from "../backend.d";
import { OrderType } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

/* ─── Timestamp Conversion ──────────────────────────────────── */
function formatTimestamp(ts: bigint): string {
  try {
    return new Date(Number(ts / 1_000_000n)).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

/* ─── Props ──────────────────────────────────────────────────── */
interface AdminPanelProps {
  onBack: () => void;
}

/* ─── Login Screen ───────────────────────────────────────────── */
function AdminLoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-charcoal-mid border border-saffron/20 rounded-sm p-10 text-center shadow-2xl shadow-black/60">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-saffron/10 border border-saffron/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="text-saffron w-8 h-8" />
          </div>

          {/* Brand */}
          <h1 className="font-display text-3xl font-bold text-gold mb-1">
            Gabbar's
          </h1>
          <p className="font-body text-xs tracking-[0.25em] uppercase text-saffron/70 mb-8">
            Admin Dashboard
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-saffron/15" />
            <span className="font-body text-xs tracking-widest uppercase text-cream-text/40">
              Secure Access
            </span>
            <div className="flex-1 h-px bg-saffron/15" />
          </div>

          <p className="font-body text-cream-text/60 text-sm mb-8 leading-relaxed">
            Sign in with Internet Identity to access orders and reservations.
          </p>

          <Button
            data-ocid="admin.login_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-saffron hover:bg-saffron/90 text-charcoal font-body font-semibold tracking-widest uppercase text-sm py-3 rounded-sm h-auto transition-all duration-300"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Connecting…
              </span>
            ) : (
              "Admin Login"
            )}
          </Button>
        </div>

        <p className="text-center font-body text-xs text-cream-text/30 mt-6 tracking-wider">
          Only authorised personnel may access this panel
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Orders Tab ─────────────────────────────────────────────── */
function OrdersTab() {
  const { actor, isFetching } = useActor();

  const {
    data: orders,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });

  const isLoadingAny = isLoading || isFetching;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-body text-cream-text/60 text-sm">
          {orders
            ? `${orders.length} order${orders.length !== 1 ? "s" : ""}`
            : ""}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoadingAny || isRefetching}
          className="font-body text-xs text-cream-text/50 hover:text-saffron gap-1.5 h-auto py-1.5 px-3 rounded-sm"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-saffron/15">
        <table data-ocid="admin.orders.table" className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-saffron/20 bg-charcoal-mid/80">
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Type
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Items
              </th>
              <th className="px-4 py-3 text-right font-body text-xs tracking-widest uppercase text-saffron/70">
                Total
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingAny ? (
              <tr data-ocid="admin.orders.loading_state">
                <td colSpan={6} className="px-4 py-8">
                  <div className="space-y-3">
                    {[0, 1, 2, 3].map((n) => (
                      <Skeleton
                        key={n}
                        className="h-10 w-full bg-charcoal-light/30 rounded-sm"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ) : !orders || orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  data-ocid="admin.orders.empty_state"
                  className="px-4 py-16 text-center"
                >
                  <Package className="w-10 h-10 text-saffron/20 mx-auto mb-3" />
                  <p className="font-body text-cream-text/40 text-sm">
                    No orders yet
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr
                  key={`order-${order.customerName}-${String(order.timestamp)}`}
                  data-ocid={`admin.orders.item.${idx + 1}`}
                  className="border-b border-saffron/10 hover:bg-charcoal-mid/50 transition-colors duration-150"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-body text-ivory text-sm font-medium">
                        {order.customerName}
                      </p>
                      {order.address && (
                        <p className="font-body text-cream-text/40 text-xs mt-0.5 truncate max-w-[140px]">
                          {order.address}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-body text-cream-text/70 text-sm">
                    {order.phone}
                  </td>
                  <td className="px-4 py-4">
                    {order.orderType === OrderType.delivery ? (
                      <Badge className="bg-saffron/20 text-saffron border-saffron/30 font-body text-xs tracking-wider uppercase rounded-sm hover:bg-saffron/20">
                        Delivery
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-cream-text/20 text-cream-text/60 font-body text-xs tracking-wider uppercase rounded-sm"
                      >
                        Pickup
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1 max-w-[220px]">
                      {order.items.slice(0, 3).map((item) => (
                        <p
                          key={item.name}
                          className="font-body text-cream-text/60 text-xs"
                        >
                          <span className="text-cream-text/80">
                            {String(item.quantity)}×
                          </span>{" "}
                          {item.name}
                        </p>
                      ))}
                      {order.items.length > 3 && (
                        <p className="font-body text-saffron/60 text-xs">
                          +{order.items.length - 3} more
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-body text-gold font-semibold text-sm">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-body text-cream-text/50 text-xs whitespace-nowrap">
                    {formatTimestamp(order.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Reservations Tab ───────────────────────────────────────── */
function ReservationsTab() {
  const { actor, isFetching } = useActor();

  const {
    data: reservations,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<Reservation[]>({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReservations();
    },
    enabled: !!actor && !isFetching,
  });

  const isLoadingAny = isLoading || isFetching;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-body text-cream-text/60 text-sm">
          {reservations
            ? `${reservations.length} reservation${reservations.length !== 1 ? "s" : ""}`
            : ""}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoadingAny || isRefetching}
          className="font-body text-xs text-cream-text/50 hover:text-saffron gap-1.5 h-auto py-1.5 px-3 rounded-sm"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-saffron/15">
        <table
          data-ocid="admin.reservations.table"
          className="w-full min-w-[500px]"
        >
          <thead>
            <tr className="border-b border-saffron/20 bg-charcoal-mid/80">
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Name
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Guests
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Date &amp; Time
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingAny ? (
              <tr data-ocid="admin.reservations.loading_state">
                <td colSpan={4} className="px-4 py-8">
                  <div className="space-y-3">
                    {[0, 1, 2, 3].map((n) => (
                      <Skeleton
                        key={n}
                        className="h-10 w-full bg-charcoal-light/30 rounded-sm"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ) : !reservations || reservations.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  data-ocid="admin.reservations.empty_state"
                  className="px-4 py-16 text-center"
                >
                  <Users className="w-10 h-10 text-saffron/20 mx-auto mb-3" />
                  <p className="font-body text-cream-text/40 text-sm">
                    No reservations yet
                  </p>
                </td>
              </tr>
            ) : (
              reservations.map((res, idx) => (
                <tr
                  key={`res-${res.name}-${String(res.date)}`}
                  data-ocid={`admin.reservations.item.${idx + 1}`}
                  className="border-b border-saffron/10 hover:bg-charcoal-mid/50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 font-body text-ivory text-sm font-medium">
                    {res.name}
                  </td>
                  <td className="px-4 py-4 font-body text-cream-text/70 text-sm">
                    {res.phone}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-body text-gold font-semibold text-sm">
                      {Number(res.guests)}
                    </span>
                    <span className="font-body text-cream-text/40 text-xs ml-1">
                      pax
                    </span>
                  </td>
                  <td className="px-4 py-4 font-body text-cream-text/60 text-sm whitespace-nowrap">
                    {formatTimestamp(res.date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Admin Panel ────────────────────────────────────────────── */
export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  /* Show loading state while identity initializes */
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-saffron animate-spin mx-auto mb-4" />
          <p className="font-body text-cream-text/50 text-sm tracking-wider">
            Initializing…
          </p>
        </div>
      </div>
    );
  }

  /* Show login screen if not authenticated */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal">
        {/* Back button */}
        <div className="p-4 sm:p-6">
          <button
            type="button"
            data-ocid="admin.back.button"
            onClick={onBack}
            className="flex items-center gap-2 font-body text-sm text-cream-text/50 hover:text-saffron transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </button>
        </div>
        <AdminLoginScreen />
      </div>
    );
  }

  /* Admin dashboard */
  return (
    <div className="min-h-screen bg-charcoal font-body">
      {/* Top bar */}
      <header className="bg-charcoal-mid border-b border-saffron/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-ocid="admin.back.button"
              onClick={onBack}
              className="flex items-center gap-1.5 font-body text-sm text-cream-text/50 hover:text-saffron transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-5 bg-saffron/20" />
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-saffron" />
              <span className="font-display text-gold text-lg font-bold">
                Gabbar's
              </span>
              <span className="font-body text-cream-text/40 text-sm hidden sm:inline">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Principal */}
            <span className="font-body text-xs text-cream-text/30 hidden md:block truncate max-w-[160px]">
              {identity?.getPrincipal().toString().slice(0, 16)}…
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="font-body text-xs text-cream-text/50 hover:text-saffron gap-1.5 h-auto py-1.5 px-3 rounded-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl text-gold font-bold mb-2">
            Dashboard
          </h1>
          <p className="font-body text-cream-text/50 text-sm">
            View incoming orders and table reservations
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="orders">
            <TabsList className="bg-charcoal-mid border border-saffron/20 rounded-sm p-1 gap-1 h-auto mb-6">
              <TabsTrigger
                value="orders"
                data-ocid="admin.orders.tab"
                className="font-body text-sm tracking-wider uppercase text-cream-text/60 data-[state=active]:bg-saffron data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-sm px-5 py-2 transition-all duration-200 hover:text-cream-text flex items-center gap-2"
              >
                <Package className="w-3.5 h-3.5" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="reservations"
                data-ocid="admin.reservations.tab"
                className="font-body text-sm tracking-wider uppercase text-cream-text/60 data-[state=active]:bg-saffron data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-sm px-5 py-2 transition-all duration-200 hover:text-cream-text flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5" />
                Reservations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>
            <TabsContent value="reservations">
              <ReservationsTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-saffron/10 mt-16 py-6 text-center">
        <p className="font-body text-xs text-cream-text/25 tracking-wider">
          © {new Date().getFullYear()} Gabbar's — Admin Panel
        </p>
      </footer>
    </div>
  );
}
