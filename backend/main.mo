import Array "mo:base/Array";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "Types";
import Authorization "canister:authorization";

actor {
  // Storage
  var orders : HashMap.HashMap<Text, Types.Order> = HashMap.HashMap(10, Text.equal, Text.hash);
  var reservations : HashMap.HashMap<Text, Types.Reservation> = HashMap.HashMap(10, Text.equal, Text.hash);
  var loyaltyAccounts : HashMap.HashMap<Text, Types.LoyaltyAccount> = HashMap.HashMap(10, Text.equal, Text.hash);
  var coupons : HashMap.HashMap<Text, Types.Coupon> = HashMap.HashMap(10, Text.equal, Text.hash);
  var orderCounter : Nat = 0;
  var reservationCounter : Nat = 0;

  func generateOrderId() : Text {
    orderCounter += 1;
    "GBR" # Nat.toText(orderCounter)
  };

  func generateReservationId() : Text {
    reservationCounter += 1;
    "RES" # Nat.toText(reservationCounter)
  };

  // ORDERS
  public shared func placeOrder(
    customerName : Text,
    phone : Text,
    deliveryType : Types.DeliveryType,
    address : Text,
    items : [Types.OrderItem],
    totalAmount : Float,
    couponCode : ?Text
  ) : async { ok : Bool; orderId : Text; message : Text } {
    let now = Time.now();
    var discountAmount : Float = 0.0;

    // Validate coupon if provided
    switch (couponCode) {
      case (?code) {
        switch (coupons.get(code)) {
          case (?coupon) {
            if (coupon.active and coupon.usedCount < coupon.maxUses and totalAmount >= coupon.minOrder) {
              discountAmount := switch (coupon.discountType) {
                case (#Fixed) coupon.discountValue;
                case (#Percent) totalAmount * coupon.discountValue / 100.0;
              };
              let updated = { coupon with usedCount = coupon.usedCount + 1 };
              coupons.put(code, updated);
            };
          };
          case null {};
        };
      };
      case null {};
    };

    let id = generateOrderId();
    let order : Types.Order = {
      id;
      customerName;
      phone;
      deliveryType;
      address;
      items;
      totalAmount;
      couponCode;
      discountAmount;
      status = #Pending;
      createdAt = now;
      updatedAt = now;
      estimatedTime = ?"30-45 minutes";
    };
    orders.put(id, order);
    { ok = true; orderId = id; message = "Order placed successfully! Your order ID is " # id }
  };

  public query func getOrder(id : Text) : async ?Types.Order {
    orders.get(id)
  };

  public shared func updateOrderStatus(id : Text, status : Types.OrderStatus) : async Bool {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return false;

    switch (orders.get(id)) {
      case (?order) {
        let updated = { order with status; updatedAt = Time.now() };
        orders.put(id, updated);
        // Award loyalty points when delivered
        if (status == #Delivered) {
          let points = Int.abs(Float.toInt(order.totalAmount / 10.0));
          await addLoyaltyPoints(order.phone, points, "Order " # id # " completed");
        };
        true
      };
      case null false;
    }
  };

  public shared func listOrders() : async [Types.Order] {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return [];
    Iter.toArray(orders.vals())
  };

  public query func getOrdersByPhone(phone : Text) : async [Types.Order] {
    Array.filter<Types.Order>(Iter.toArray(orders.vals()), func(o) { o.phone == phone })
  };

  // RESERVATIONS
  public shared func createReservation(
    name : Text,
    phone : Text,
    date : Text,
    time : Text,
    guests : Nat,
    notes : Text
  ) : async { ok : Bool; reservationId : Text } {
    let id = generateReservationId();
    let reservation : Types.Reservation = {
      id;
      name;
      phone;
      date;
      time;
      guests;
      notes;
      status = #Pending;
      createdAt = Time.now();
    };
    reservations.put(id, reservation);
    { ok = true; reservationId = id }
  };

  public shared func listReservations() : async [Types.Reservation] {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return [];
    Iter.toArray(reservations.vals())
  };

  public shared func updateReservationStatus(id : Text, status : Types.ReservationStatus) : async Bool {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return false;

    switch (reservations.get(id)) {
      case (?res) {
        reservations.put(id, { res with status });
        true
      };
      case null false;
    }
  };

  // LOYALTY
  func addLoyaltyPoints(phone : Text, points : Int, description : Text) : async () {
    let now = Time.now();
    let tx : Types.LoyaltyTransaction = { points; description; timestamp = now };
    switch (loyaltyAccounts.get(phone)) {
      case (?acc) {
        let updated : Types.LoyaltyAccount = {
          phone;
          points = acc.points + points;
          history = Array.append(acc.history, [tx]);
        };
        loyaltyAccounts.put(phone, updated);
      };
      case null {
        loyaltyAccounts.put(phone, { phone; points; history = [tx] });
      };
    };
  };

  public query func getLoyaltyAccount(phone : Text) : async Types.LoyaltyAccount {
    switch (loyaltyAccounts.get(phone)) {
      case (?acc) acc;
      case null { phone; points = 0; history = [] };
    }
  };

  public shared func redeemPoints(phone : Text, pointsToRedeem : Int) : async { ok : Bool; discountAmount : Float; message : Text } {
    if (pointsToRedeem % 100 != 0) {
      return { ok = false; discountAmount = 0.0; message = "Points must be redeemed in multiples of 100" };
    };
    switch (loyaltyAccounts.get(phone)) {
      case (?acc) {
        if (acc.points < pointsToRedeem) {
          return { ok = false; discountAmount = 0.0; message = "Insufficient points" };
        };
        let discount = Float.fromInt(pointsToRedeem) / 10.0;
        let tx : Types.LoyaltyTransaction = {
          points = -pointsToRedeem;
          description = "Redeemed for \u{20B9}" # Float.toText(discount) # " discount";
          timestamp = Time.now();
        };
        loyaltyAccounts.put(phone, {
          phone;
          points = acc.points - pointsToRedeem;
          history = Array.append(acc.history, [tx]);
        });
        { ok = true; discountAmount = discount; message = "Redeemed " # Int.toText(pointsToRedeem) # " points for \u{20B9}" # Float.toText(discount) # " discount" }
      };
      case null { ok = false; discountAmount = 0.0; message = "No loyalty account found" };
    }
  };

  // COUPONS
  public shared func createCoupon(
    code : Text,
    discountType : Types.DiscountType,
    discountValue : Float,
    minOrder : Float,
    maxUses : Nat
  ) : async Bool {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return false;

    let coupon : Types.Coupon = {
      code;
      discountType;
      discountValue;
      minOrder;
      maxUses;
      usedCount = 0;
      active = true;
    };
    coupons.put(code, coupon);
    true
  };

  public query func validateCoupon(code : Text, orderTotal : Float) : async { valid : Bool; discountAmount : Float; message : Text } {
    switch (coupons.get(code)) {
      case (?coupon) {
        if (not coupon.active) {
          return { valid = false; discountAmount = 0.0; message = "Coupon is inactive" };
        };
        if (coupon.usedCount >= coupon.maxUses) {
          return { valid = false; discountAmount = 0.0; message = "Coupon usage limit reached" };
        };
        if (orderTotal < coupon.minOrder) {
          return { valid = false; discountAmount = 0.0; message = "Minimum order \u{20B9}" # Float.toText(coupon.minOrder) # " required" };
        };
        let discount = switch (coupon.discountType) {
          case (#Fixed) coupon.discountValue;
          case (#Percent) orderTotal * coupon.discountValue / 100.0;
        };
        { valid = true; discountAmount = discount; message = "Coupon applied! You save \u{20B9}" # Float.toText(discount) }
      };
      case null { valid = false; discountAmount = 0.0; message = "Invalid coupon code" };
    }
  };

  public shared func listCoupons() : async [Types.Coupon] {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return [];
    Iter.toArray(coupons.vals())
  };

  public shared func deactivateCoupon(code : Text) : async Bool {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return false;
    switch (coupons.get(code)) {
      case (?c) { coupons.put(code, { c with active = false }); true };
      case null false;
    }
  };

  // DASHBOARD
  public shared func getDashboardStats() : async { totalOrders : Nat; pendingOrders : Nat; totalRevenue : Float } {
    let caller = await Authorization.getCallerRoles();
    let isAdmin = Array.find<Text>(caller, func(r) { r == "admin" }) != null;
    if (not isAdmin) return { totalOrders = 0; pendingOrders = 0; totalRevenue = 0.0 };
    let allOrders = Iter.toArray(orders.vals());
    let pending = Array.filter<Types.Order>(allOrders, func(o) { o.status == #Pending });
    let revenue = Array.foldLeft<Types.Order, Float>(allOrders, 0.0, func(acc, o) {
      if (o.status == #Delivered) acc + o.totalAmount - o.discountAmount else acc
    });
    { totalOrders = allOrders.size(); pendingOrders = pending.size(); totalRevenue = revenue }
  };
};
