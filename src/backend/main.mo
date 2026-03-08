import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Reservation = {
    name : Text;
    date : Time.Time;
    guests : Nat;
    phone : Text;
  };

  let reservations = List.empty<Reservation>();

  public shared ({ caller }) func addReservation(name : Text, date : Time.Time, guests : Nat, phone : Text) : async () {
    let reservation : Reservation = {
      name;
      date;
      guests;
      phone;
    };
    reservations.add(reservation);
  };

  public query ({ caller }) func getAllReservations() : async [Reservation] {
    reservations.toArray();
  };

  type OrderType = {
    #delivery;
    #pickup;
  };

  type OrderItem = {
    name : Text;
    quantity : Nat;
    price : Nat;
  };

  type Order = {
    customerName : Text;
    phone : Text;
    address : Text;
    orderType : OrderType;
    items : [OrderItem];
    totalAmount : Nat;
    timestamp : Time.Time;
  };

  let orders = List.empty<Order>();

  public shared ({ caller }) func placeOrder(customerName : Text, phone : Text, address : Text, orderType : OrderType, items : [OrderItem], totalAmount : Nat) : async () {
    let order : Order = {
      customerName;
      phone;
      address;
      orderType;
      items;
      totalAmount;
      timestamp = Time.now();
    };
    orders.add(order);
  };

  public query ({ caller }) func getOrders() : async [Order] {
    orders.toArray();
  };
};
