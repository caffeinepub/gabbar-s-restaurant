module {
  public type OrderStatus = {
    #Pending;
    #Confirmed;
    #Preparing;
    #OutForDelivery;
    #Delivered;
    #Cancelled;
  };

  public type DeliveryType = {
    #Delivery;
    #Pickup;
  };

  public type OrderItem = {
    name : Text;
    quantity : Nat;
    price : Float;
    isVeg : Bool;
  };

  public type Order = {
    id : Text;
    customerName : Text;
    phone : Text;
    deliveryType : DeliveryType;
    address : Text;
    items : [OrderItem];
    totalAmount : Float;
    couponCode : ?Text;
    discountAmount : Float;
    status : OrderStatus;
    createdAt : Int;
    updatedAt : Int;
    estimatedTime : ?Text;
  };

  public type ReservationStatus = {
    #Pending;
    #Confirmed;
    #Cancelled;
  };

  public type Reservation = {
    id : Text;
    name : Text;
    phone : Text;
    date : Text;
    time : Text;
    guests : Nat;
    notes : Text;
    status : ReservationStatus;
    createdAt : Int;
  };

  public type LoyaltyTransaction = {
    points : Int;
    description : Text;
    timestamp : Int;
  };

  public type LoyaltyAccount = {
    phone : Text;
    points : Int;
    history : [LoyaltyTransaction];
  };

  public type DiscountType = {
    #Fixed;
    #Percent;
  };

  public type Coupon = {
    code : Text;
    discountType : DiscountType;
    discountValue : Float;
    minOrder : Float;
    maxUses : Nat;
    usedCount : Nat;
    active : Bool;
  };
};
