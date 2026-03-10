import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Restaurant Types
  type Reservation = {
    name : Text;
    date : Time.Time;
    guests : Nat;
    phone : Text;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #delivered;
    #cancelled;
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
    status : OrderStatus;
    id : Nat;
  };

  type PetpoojaConfig = {
    apiKey : Text;
    outletId : Text;
  };

  let reservations = List.empty<Reservation>();
  var nextOrderId = 1;

  let orders = Map.empty<Nat, Order>();
  var petpoojaConfig : ?PetpoojaConfig = null;

  // Reservations - User level access for adding, Admin for viewing all
  public shared ({ caller }) func addReservation(name : Text, date : Time.Time, guests : Nat, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reservations");
    };
    let reservation : Reservation = {
      name;
      date;
      guests;
      phone;
    };
    reservations.add(reservation);
  };

  public query ({ caller }) func getAllReservations() : async [Reservation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all reservations");
    };
    reservations.toArray();
  };

  // Orders - User can place, Admin can view all and update status
  public shared ({ caller }) func placeOrder(customerName : Text, phone : Text, address : Text, orderType : OrderType, items : [OrderItem], totalAmount : Nat) : async {
    id : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      customerName;
      phone;
      address;
      orderType;
      items;
      totalAmount;
      timestamp = Time.now();
      status = #pending;
      id = orderId;
    };

    orders.add(orderId, order);
    { id = orderId };
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderStatus) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    var found = false;
    let updatedOrders = orders.map<Nat, Order, Order>(
      func(orderId, order) {
        if (orderId == id) {
          found := true;
          { order with status };
        } else {
          order;
        };
      }
    );
    orders.clear();
    updatedOrders.forEach(
      func(orderId, order) {
        orders.add(orderId, order);
      }
    );
    found;
  };

  // PetPooja Integration - Admin only
  public shared ({ caller }) func savePetpoojaConfig(apiKey : Text, outletId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save PetPooja config");
    };
    petpoojaConfig := ?{
      apiKey;
      outletId;
    };
  };

  public query ({ caller }) func getPetpoojaConfig() : async ?PetpoojaConfig {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view PetPooja config");
    };
    petpoojaConfig;
  };

  // Transform function for HTTP outcalls
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func pushOrderToPetpooja(orderId : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can push orders to PetPooja");
    };
    let config = switch (petpoojaConfig) {
      case (null) { Runtime.trap("PetPooja config not set") };
      case (?config) { config };
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    let url = "https://api.petpooja.com/v2/order";
    let headers = [
      { name = "Authorization"; value = config.apiKey },
      { name = "Content-Type"; value = "application/json" },
    ];

    let orderJson = "{ \"customerName\": \"" # order.customerName # "\"}";
    let response = await OutCall.httpPostRequest(url, headers, orderJson, transform);

    response;
  };
};
