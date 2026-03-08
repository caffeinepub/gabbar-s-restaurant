# Gabbar's Restaurant

## Current State
- Full restaurant website with Hero, Menu (tabs with dish cards + menu card images), About, Testimonials, Reservations, Contact, Footer sections.
- Backend supports: addReservation, getAllReservations.
- No ordering or gallery features yet.

## Requested Changes (Diff)

### Add
- **Online Ordering Section**: Customers can browse menu items by category, add to cart, specify order type (Delivery or Pickup), fill in contact + address (for delivery), and submit the order. Backend stores orders with items, quantities, type, contact info, and timestamp.
- **Photo Gallery Section**: A visually rich gallery showcasing restaurant ambience, dishes, and events. Displayed as a masonry or grid layout with lightbox on click.
- **Order Management (backend)**: New backend methods: placeOrder (stores order with items array, order type, customer name, phone, address, total), getOrders (admin view of all orders).
- **Navbar update**: Add "Order Online" and "Gallery" nav links.

### Modify
- App.tsx: Add OrderingSection and GallerySection components.
- Navbar: Add links to #order and #gallery sections.
- MenuSection: Dish cards get an "Add to Order" button that scrolls to / opens the order section with the item pre-added.

### Remove
- Nothing removed.

## Implementation Plan
1. Extend backend with placeOrder and getOrders methods (new Order type with items, type, name, phone, address, total, timestamp).
2. Generate gallery images (restaurant ambience + food shots) using image generation tool.
3. Create GallerySection component with grid layout and lightbox modal.
4. Create OrderingSection component: menu item picker by category, cart state, delivery/pickup toggle, checkout form, order submission to backend.
5. Update App.tsx to include OrderingSection and GallerySection.
6. Update Navbar to include Order and Gallery links.
