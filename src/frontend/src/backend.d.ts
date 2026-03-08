import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reservation {
    date: Time;
    name: string;
    phone: string;
    guests: bigint;
}
export type Time = bigint;
export interface Order {
    customerName: string;
    orderType: OrderType;
    totalAmount: bigint;
    address: string;
    timestamp: Time;
    phone: string;
    items: Array<OrderItem>;
}
export interface OrderItem {
    name: string;
    quantity: bigint;
    price: bigint;
}
export enum OrderType {
    pickup = "pickup",
    delivery = "delivery"
}
export interface backendInterface {
    addReservation(name: string, date: Time, guests: bigint, phone: string): Promise<void>;
    getAllReservations(): Promise<Array<Reservation>>;
    getOrders(): Promise<Array<Order>>;
    placeOrder(customerName: string, phone: string, address: string, orderType: OrderType, items: Array<OrderItem>, totalAmount: bigint): Promise<void>;
}
