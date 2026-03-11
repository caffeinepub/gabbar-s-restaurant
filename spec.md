# Gabbar's Restaurant

## Current State
Workspace is empty — full rebuild required. Based on conversation history, the site is a rich restaurant website for Gabbar's in Saifai, Etawah, UP with menu, ordering, gallery, admin panel, PetPooja integration, and Google Reviews.

## Requested Changes (Diff)

### Add
- **Logo**: Use generated Gabbar's logo in navbar and hero section
- **WhatsApp Order Button**: Floating sticky button + CTA button linking to `https://wa.me/917983711781` with pre-filled message "Hi, I'd like to place an order at Gabbar's!"
- **Live Order Tracking Page**: Public page `/track-order` where customers enter their Order ID to see real-time status (Pending → Confirmed → Preparing → Out for Delivery → Delivered). Shows order items, total, estimated time.
- **Customer Loyalty / Coupon System**:
  - Customers earn 1 point per ₹10 spent
  - Points redeemable as discount coupons (100 points = ₹10 off)
  - Admin can create coupon codes with fixed or % discount
  - Customers can apply coupon at checkout
  - Loyalty card page showing points balance and transaction history

### Modify
- Rebuild entire site with all existing features intact (menu, ordering, reservations, gallery, admin panel, PetPooja integration, Google Reviews, FSSAI/GST details, tap-to-call)
- Use new generated logo in navbar

### Remove
- Nothing from existing feature set

## Implementation Plan
1. Backend: Orders (place, get by ID for tracking, update status), Reservations, Loyalty points (earn/redeem), Coupon codes (create/validate), Admin management
2. Frontend pages: Home (hero, menu, gallery, reviews, contact), Order page, Track Order page, Loyalty page, Admin panel
3. WhatsApp floating button on all pages
4. Order tracking: public lookup by order ID, polling for status updates
5. Loyalty: phone/email-based account, points earned on order completion, coupon redemption at checkout
