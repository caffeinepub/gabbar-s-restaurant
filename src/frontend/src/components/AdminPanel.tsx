import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Link2,
  LogOut,
  Package,
  RefreshCw,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order, PetpoojaConfig, Reservation } from "../backend.d";
import { OrderStatus, OrderType } from "../backend.d";
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

/* ─── Status Badge ───────────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; className: string }> = {
    [OrderStatus.pending]: {
      label: "Pending",
      className:
        "bg-amber-500/20 text-amber-300 border-amber-400/30 hover:bg-amber-500/20",
    },
    [OrderStatus.confirmed]: {
      label: "Confirmed",
      className:
        "bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/20",
    },
    [OrderStatus.preparing]: {
      label: "Preparing",
      className:
        "bg-orange-500/20 text-orange-300 border-orange-400/30 hover:bg-orange-500/20",
    },
    [OrderStatus.delivered]: {
      label: "Delivered",
      className:
        "bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/20",
    },
    [OrderStatus.cancelled]: {
      label: "Cancelled",
      className:
        "bg-red-500/10 text-red-400/70 border-red-400/20 hover:bg-red-500/10",
    },
  };
  const c = config[status] ?? config[OrderStatus.pending];
  return (
    <Badge
      className={`font-body text-xs tracking-wider uppercase rounded-sm border ${c.className}`}
    >
      {c.label}
    </Badge>
  );
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
        <div className="bg-charcoal-mid border border-saffron/20 rounded-sm p-10 text-center shadow-2xl shadow-black/60">
          <div className="w-16 h-16 rounded-full bg-saffron/10 border border-saffron/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="text-saffron w-8 h-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gold mb-1">
            Gabbar's
          </h1>
          <p className="font-body text-xs tracking-[0.25em] uppercase text-saffron/70 mb-8">
            Admin Dashboard
          </p>
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
  const queryClient = useQueryClient();

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

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      const ok = await actor.updateOrderStatus(id, status);
      if (!ok) throw new Error("Update failed");
      return ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const isLoadingAny = isLoading || isFetching;

  return (
    <div>
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

      <div className="overflow-x-auto rounded-sm border border-saffron/15">
        <table data-ocid="admin.orders.table" className="w-full min-w-[860px]">
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
                Status
              </th>
              <th className="px-4 py-3 text-left font-body text-xs tracking-widest uppercase text-saffron/70">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingAny ? (
              <tr data-ocid="admin.orders.loading_state">
                <td colSpan={7} className="px-4 py-8">
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
                  colSpan={7}
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
                  key={`order-${String(order.id)}`}
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
                    <div className="space-y-1 max-w-[180px]">
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
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <StatusBadge status={order.status} />
                      <Select
                        value={order.status}
                        onValueChange={(val) =>
                          statusMutation.mutate({
                            id: order.id,
                            status: val as OrderStatus,
                          })
                        }
                        disabled={statusMutation.isPending}
                      >
                        <SelectTrigger
                          data-ocid={`admin.orders.status_select.${idx + 1}`}
                          className="h-7 text-xs font-body bg-charcoal border-saffron/20 text-cream-text/70 rounded-sm focus:ring-saffron/30 focus:border-saffron/40"
                        >
                          <SelectValue placeholder="Change…" />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal-mid border-saffron/20 text-ivory font-body text-xs">
                          <SelectItem value={OrderStatus.pending}>
                            Pending
                          </SelectItem>
                          <SelectItem value={OrderStatus.confirmed}>
                            Confirmed
                          </SelectItem>
                          <SelectItem value={OrderStatus.preparing}>
                            Preparing
                          </SelectItem>
                          <SelectItem value={OrderStatus.delivered}>
                            Delivered
                          </SelectItem>
                          <SelectItem value={OrderStatus.cancelled}>
                            Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
      <div className="flex items-center justify-between mb-5">
        <p className="font-body text-cream-text/60 text-sm">
          {reservations
            ? `${reservations.length} reservation${
                reservations.length !== 1 ? "s" : ""
              }`
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

/* ─── PetPooja Tab ───────────────────────────────────────────── */
function PetpoojaTab() {
  const { actor, isFetching } = useActor();
  const [apiKey, setApiKey] = useState("");
  const [outletId, setOutletId] = useState("");
  const [configLoaded, setConfigLoaded] = useState(false);

  /* Load existing config */
  useQuery<PetpoojaConfig | null>({
    queryKey: ["petpooja-config"],
    queryFn: async () => {
      if (!actor) return null;
      const cfg = await actor.getPetpoojaConfig();
      if (cfg) {
        if (!configLoaded) {
          setApiKey(cfg.apiKey);
          setOutletId(cfg.outletId);
          setConfigLoaded(true);
        }
      }
      return cfg;
    },
    enabled: !!actor && !isFetching,
  });

  /* Load orders for push list */
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });

  /* Save config mutation */
  const saveConfig = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.savePetpoojaConfig(apiKey.trim(), outletId.trim());
    },
    onSuccess: () => {
      toast.success("PetPooja configuration saved");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save configuration");
    },
  });

  /* Push order mutation */
  const pushOrder = useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.pushOrderToPetpooja(orderId);
    },
    onSuccess: (msg: string) => {
      toast.success(msg || "Order pushed to PetPooja");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to push order");
    },
  });

  return (
    <div className="space-y-8">
      {/* PetPooja Info Banner */}
      <div className="flex items-start gap-3 bg-saffron/5 border border-saffron/20 rounded-sm p-4">
        <Zap className="w-5 h-5 text-saffron mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-body text-ivory text-sm font-medium mb-1">
            PetPooja Billing Integration
          </p>
          <p className="font-body text-cream-text/50 text-xs leading-relaxed">
            Connect Gabbar's website orders directly to PetPooja's KOT (Kitchen
            Order Ticket) system. Configure your API credentials below, then
            push individual orders to generate KOTs automatically.
          </p>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-charcoal-mid border border-saffron/20 rounded-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Link2 className="w-4 h-4 text-saffron" />
          <h3 className="font-display text-gold text-lg font-bold">
            API Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="space-y-1.5">
            <Label
              htmlFor="petpooja-apikey"
              className="font-body text-xs tracking-widest uppercase text-saffron/70"
            >
              PetPooja API Key
            </Label>
            <Input
              id="petpooja-apikey"
              data-ocid="admin.petpooja.apikey.input"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-body text-sm bg-charcoal border-saffron/20 text-ivory placeholder:text-cream-text/30 focus:border-saffron/50 focus-visible:ring-saffron/20 rounded-sm h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="petpooja-outletid"
              className="font-body text-xs tracking-widest uppercase text-saffron/70"
            >
              Outlet ID
            </Label>
            <Input
              id="petpooja-outletid"
              data-ocid="admin.petpooja.outletid.input"
              type="text"
              placeholder="Enter outlet ID"
              value={outletId}
              onChange={(e) => setOutletId(e.target.value)}
              className="font-body text-sm bg-charcoal border-saffron/20 text-ivory placeholder:text-cream-text/30 focus:border-saffron/50 focus-visible:ring-saffron/20 rounded-sm h-10"
            />
          </div>
        </div>

        <Button
          data-ocid="admin.petpooja.save.button"
          onClick={() => saveConfig.mutate()}
          disabled={saveConfig.isPending || !apiKey.trim() || !outletId.trim()}
          className="bg-saffron hover:bg-saffron/90 text-charcoal font-body font-semibold tracking-widest uppercase text-xs px-6 py-2.5 rounded-sm h-auto transition-all duration-200"
        >
          {saveConfig.isPending ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Saving…
            </span>
          ) : (
            "Save Configuration"
          )}
        </Button>
      </div>

      {/* Push Orders Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-saffron" />
          <h3 className="font-display text-gold text-lg font-bold">
            Push Orders to PetPooja
          </h3>
        </div>
        <p className="font-body text-cream-text/50 text-xs mb-5 leading-relaxed">
          Select orders to generate KOTs in PetPooja. Delivered orders are shown
          in muted style.
        </p>

        <div className="rounded-sm border border-saffron/15 overflow-hidden">
          {ordersLoading || isFetching ? (
            <div
              className="p-6 space-y-3"
              data-ocid="admin.petpooja.loading_state"
            >
              {[0, 1, 2].map((n) => (
                <Skeleton
                  key={n}
                  className="h-14 w-full bg-charcoal-light/30 rounded-sm"
                />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="admin.petpooja.empty_state"
            >
              <Package className="w-10 h-10 text-saffron/20 mx-auto mb-3" />
              <p className="font-body text-cream-text/40 text-sm">
                No orders to push
              </p>
            </div>
          ) : (
            <div className="divide-y divide-saffron/10">
              {orders.map((order, idx) => {
                const isDelivered = order.status === OrderStatus.delivered;
                const isCancelled = order.status === OrderStatus.cancelled;
                const muted = isDelivered || isCancelled;
                return (
                  <div
                    key={`pp-order-${String(order.id)}`}
                    className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-150 ${
                      muted ? "opacity-50" : "hover:bg-charcoal-mid/40"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-body text-sm font-medium ${
                            muted ? "text-cream-text/40" : "text-ivory"
                          }`}
                        >
                          {order.customerName}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="font-body text-xs text-cream-text/40 mt-0.5">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")} ·{" "}
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""} ·{" "}
                        {formatTimestamp(order.timestamp)}
                      </p>
                    </div>
                    <Button
                      data-ocid={`admin.petpooja.push_button.${idx + 1}`}
                      size="sm"
                      variant="outline"
                      onClick={() => pushOrder.mutate(order.id)}
                      disabled={pushOrder.isPending || muted}
                      className={`font-body text-xs tracking-wider uppercase rounded-sm h-auto py-1.5 px-3 flex-shrink-0 transition-all duration-200 ${
                        muted
                          ? "border-saffron/10 text-cream-text/20 cursor-not-allowed"
                          : "border-saffron/30 text-saffron hover:bg-saffron/10 hover:border-saffron/60"
                      }`}
                    >
                      {pushOrder.isPending ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : isDelivered ? (
                        "Done"
                      ) : isCancelled ? (
                        "Cancelled"
                      ) : (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Push
                        </span>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Panel ────────────────────────────────────────────── */
export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { identity, clear, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal">
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
            Manage orders, reservations, and billing integrations
          </p>
        </motion.div>

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
              <TabsTrigger
                value="petpooja"
                data-ocid="admin.petpooja.tab"
                className="font-body text-sm tracking-wider uppercase text-cream-text/60 data-[state=active]:bg-saffron data-[state=active]:text-charcoal data-[state=active]:font-semibold rounded-sm px-5 py-2 transition-all duration-200 hover:text-cream-text flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                PetPooja
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>
            <TabsContent value="reservations">
              <ReservationsTab />
            </TabsContent>
            <TabsContent value="petpooja">
              <PetpoojaTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <footer className="border-t border-saffron/10 mt-16 py-6 text-center">
        <p className="font-body text-xs text-cream-text/25 tracking-wider">
          © {new Date().getFullYear()} Gabbar's — Admin Panel
        </p>
      </footer>
    </div>
  );
}
