import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface PetpoojaConfig {
    apiKey: string;
    outletId: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface OrderItem {
    name: string;
    quantity: bigint;
    price: bigint;
}
export interface Reservation {
    date: Time;
    name: string;
    phone: string;
    guests: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    orderType: OrderType;
    totalAmount: bigint;
    address: string;
    timestamp: Time;
    phone: string;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum OrderType {
    pickup = "pickup",
    delivery = "delivery"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReservation(name: string, date: Time, guests: bigint, phone: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllReservations(): Promise<Array<Reservation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrders(): Promise<Array<Order>>;
    getPetpoojaConfig(): Promise<PetpoojaConfig | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, phone: string, address: string, orderType: OrderType, items: Array<OrderItem>, totalAmount: bigint): Promise<{
        id: bigint;
    }>;
    pushOrderToPetpooja(orderId: bigint): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePetpoojaConfig(apiKey: string, outletId: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<boolean>;
}
