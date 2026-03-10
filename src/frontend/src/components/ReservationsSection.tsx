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
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { IMAGES } from "../assets/images";
import { useActor } from "../hooks/useActor";
import { OrnamentDivider } from "./HeroSection";

const timeSlots = [
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ReservationsSection() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    guests: "2",
    phone: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      if (!actor) throw new Error("Connection unavailable");
      const timestamp = BigInt(new Date(form.date).getTime());
      const guests = BigInt(Number.parseInt(form.guests, 10));
      await actor.addReservation(form.name, timestamp, guests, form.phone);
      setStatus("success");
      setForm({ name: "", date: "", time: "", guests: "2", phone: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        "Unable to process your reservation. Please call us directly.",
      );
    }
  };

  return (
    <section
      id="reservations"
      className="relative bg-charcoal py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative arch background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-40 top-10 w-96 h-96 rounded-full border border-saffron/15 opacity-40" />
        <div className="absolute -right-20 top-30 w-64 h-64 rounded-full border border-gold/15 opacity-30" />
        <div className="absolute -left-32 bottom-10 w-80 h-80 rounded-full border border-saffron/15 opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: info block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/80 mb-3 block">
              — Book a Table —
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-ivory font-bold mb-6 leading-tight">
              Reserve Your
              <br />
              <span className="text-gold">Royal Evening</span>
            </h2>

            <OrnamentDivider light />

            <p className="font-body text-cream-text/70 mt-6 leading-relaxed">
              Whether it's an intimate dinner for two or a grand family
              celebration, we ensure every table feels like a Mughal banquet.
              Book online or call us — we hold your reservation for 15 minutes.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { label: "Open Daily", value: "11:00 AM – 11:00 PM" },
                { label: "Private Dining", value: "By appointment" },
                {
                  label: "Group Bookings (12+)",
                  value: "+91 90456 03226",
                  tel: "+919045603226",
                },
              ].map((info) => (
                <div
                  key={info.label}
                  className="flex items-center gap-4 border-b border-saffron/20 pb-4"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                  <span className="font-body text-sm text-cream-text/50 flex-1 uppercase tracking-wider">
                    {info.label}
                  </span>
                  <span className="font-display text-sm font-semibold text-ivory">
                    {"tel" in info && info.tel ? (
                      <a
                        href={`tel:${info.tel}`}
                        data-ocid="reservations.phone.link"
                        className="text-saffron hover:text-gold underline underline-offset-2 decoration-saffron/40 hover:decoration-gold transition-colors duration-200"
                      >
                        {info.value}
                      </a>
                    ) : (
                      info.value
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative image */}
            <div className="mt-10 relative rounded-sm overflow-hidden h-48 border border-saffron/20">
              <img
                src={IMAGES.seekhKebab}
                alt="Fine dining experience"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="font-display text-xl text-ivory font-semibold">
                  Every table, a throne.
                </div>
                <div className="font-body text-xs text-gold/80 mt-1 tracking-wider uppercase">
                  Gabbar's
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-charcoal rounded-sm border border-saffron/20 p-8 shadow-2xl shadow-charcoal/20">
              <h3 className="font-display text-2xl text-ivory font-bold mb-6">
                Make a Reservation
              </h3>

              {/* Success state */}
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  data-ocid="reservations.form.success_state"
                  className="flex flex-col items-center text-center py-12 gap-4"
                >
                  <CheckCircle size={52} className="text-saffron" />
                  <h4 className="font-display text-xl text-ivory font-semibold">
                    Reservation Confirmed!
                  </h4>
                  <p className="font-body text-cream-text/70 text-sm leading-relaxed max-w-xs">
                    We've received your booking. Our team will confirm within 30
                    minutes via your phone number. A royal welcome awaits you.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="font-body text-sm tracking-wider uppercase px-6 py-2.5 border border-saffron/40 text-saffron hover:bg-saffron hover:text-charcoal transition-all duration-300 rounded-sm mt-2"
                  >
                    Make Another Booking
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="res-name"
                      className="font-body text-xs tracking-widest uppercase text-cream-text/60"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="res-name"
                      type="text"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      data-ocid="reservations.name.input"
                      className="bg-charcoal-mid border-saffron/20 text-ivory placeholder:text-cream-text/30 focus:border-saffron focus:ring-saffron/20 rounded-sm"
                    />
                  </div>

                  {/* Date + Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="res-date"
                        className="font-body text-xs tracking-widest uppercase text-cream-text/60"
                      >
                        Date *
                      </Label>
                      <Input
                        id="res-date"
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        data-ocid="reservations.date.input"
                        className="bg-charcoal-mid border-saffron/20 text-ivory focus:border-saffron focus:ring-saffron/20 rounded-sm [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="res-time"
                        className="font-body text-xs tracking-widest uppercase text-cream-text/60"
                      >
                        Time *
                      </Label>
                      <Select
                        value={form.time}
                        onValueChange={(val) => handleChange("time", val)}
                        required
                      >
                        <SelectTrigger
                          id="res-time"
                          data-ocid="reservations.time.select"
                          className="bg-charcoal-mid border-saffron/20 text-ivory focus:border-saffron rounded-sm data-[placeholder]:text-cream-text/30"
                        >
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-saffron/20">
                          {timeSlots.map((slot) => (
                            <SelectItem
                              key={slot}
                              value={slot}
                              className="text-cream-text focus:bg-saffron/20 focus:text-ivory font-body text-sm"
                            >
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Guests + Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="res-guests"
                        className="font-body text-xs tracking-widest uppercase text-cream-text/60"
                      >
                        Guests *
                      </Label>
                      <Input
                        id="res-guests"
                        type="number"
                        required
                        min={1}
                        max={10}
                        value={form.guests}
                        onChange={(e) => handleChange("guests", e.target.value)}
                        data-ocid="reservations.guests.input"
                        className="bg-charcoal-mid border-saffron/20 text-ivory focus:border-saffron focus:ring-saffron/20 rounded-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="res-phone"
                        className="font-body text-xs tracking-widest uppercase text-cream-text/60"
                      >
                        Phone *
                      </Label>
                      <Input
                        id="res-phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        data-ocid="reservations.phone.input"
                        className="bg-charcoal-mid border-saffron/20 text-ivory placeholder:text-cream-text/30 focus:border-saffron focus:ring-saffron/20 rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Error state */}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      data-ocid="reservations.form.error_state"
                      className="flex items-start gap-3 bg-red-950/40 border border-red-800/40 rounded-sm p-4"
                    >
                      <AlertCircle
                        size={16}
                        className="text-red-400 flex-shrink-0 mt-0.5"
                      />
                      <p className="font-body text-sm text-red-300">
                        {errorMsg}
                      </p>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    data-ocid="reservations.form.submit_button"
                    className="w-full bg-saffron text-charcoal font-body font-semibold tracking-widest uppercase text-sm py-3 hover:bg-gold transition-all duration-300 rounded-sm h-auto disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking Your Table...
                      </>
                    ) : (
                      "Confirm Reservation"
                    )}
                  </Button>

                  <p className="font-body text-xs text-cream-text/40 text-center">
                    By booking, you agree to our reservation policy. We hold
                    tables for 15 minutes.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
