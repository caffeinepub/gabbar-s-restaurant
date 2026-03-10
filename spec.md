# Gabbar's Restaurant

## Current State
- Backend has `Order` and `Reservation` types, `placeOrder`, `getOrders`, `addReservation`, `getAllReservations`.
- Orders have no status field. No ability to update order status.
- Admin panel shows orders and reservations in a table view. No status column or controls.
- No PetPooja integration exists anywhere.

## Requested Changes (Diff)

### Add
- `OrderStatus` variant type: `#pending | #confirmed | #preparing | #delivered | #cancelled`
- `status` field on `Order` type (defaults to `#pending` on creation)
- `updateOrderStatus(orderId: Nat, status: OrderStatus)` backend function
- `getOrderById(orderId: Nat)` or orders returned with their index ID
- Orders now returned as `OrderWithId` (includes `id: Nat`)
- PetPooja integration tab in admin panel:
  - Settings card to save PetPooja API key and outlet ID (stored in backend)
  - Per-order "Push to PetPooja" button (uses HTTP outcalls to POST order to PetPooja API)
  - Connection test button
- `savePetpoojaConfig(apiKey: Text, outletId: Text)` and `getPetpoojaConfig()` backend functions
- `pushOrderToPetpooja(orderId: Nat)` backend function (HTTP outcall)
- Status badge column and status change dropdown in the admin Orders table

### Modify
- `placeOrder` sets `status = #pending` on new orders
- `getOrders` returns `[OrderWithId]` (includes `id` field)
- Admin Orders table: add Status column with colored badge and a select dropdown to change status
- Admin panel: add a third tab "PetPooja" for integration settings

### Remove
- Nothing removed

## Implementation Plan
1. Update backend: add OrderStatus, id tracking, updateOrderStatus, PetPooja config storage and HTTP outcall push function
2. Select http-outcalls component for backend HTTP capability
3. Regenerate Motoko backend with new types and functions
4. Update frontend AdminPanel: add status badge + select in orders table, add PetPooja settings tab
5. Validate and deploy
