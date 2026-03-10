import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Types from old system
  type OldReservation = {
    name : Text;
    date : Time.Time;
    guests : Nat;
    phone : Text;
  };

  type OldOrderType = {
    #delivery;
    #pickup;
  };

  type OldOrderItem = {
    name : Text;
    quantity : Nat;
    price : Nat;
  };

  type OldOrder = {
    customerName : Text;
    phone : Text;
    address : Text;
    orderType : OldOrderType;
    items : [OldOrderItem];
    totalAmount : Nat;
    timestamp : Time.Time;
  };

  type OldActor = {
    reservations : List.List<OldReservation>;
    orders : List.List<OldOrder>;
  };

  // Types from new system
  type NewReservation = OldReservation;

  type NewOrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #delivered;
    #cancelled;
  };

  type NewOrder = {
    customerName : Text;
    phone : Text;
    address : Text;
    orderType : OldOrderType;
    items : [OldOrderItem];
    totalAmount : Nat;
    timestamp : Time.Time;
    status : NewOrderStatus;
    id : Nat;
  };

  type NewActor = {
    reservations : List.List<NewReservation>;
    orders : Map.Map<Nat, NewOrder>;
    nextOrderId : Nat;
    petpoojaConfig : ?{ apiKey : Text; outletId : Text };
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = Map.empty<Nat, NewOrder>();
    var idCounter = 1;

    old.orders.values().forEach(
      func(order) {
        let newOrder = {
          order with
          status = #pending;
          id = idCounter;
        };
        newOrders.add(idCounter, newOrder);
        idCounter += 1;
      }
    );

    {
      reservations = old.reservations;
      orders = newOrders;
      nextOrderId = idCounter;
      petpoojaConfig = null;
    };
  };
};
