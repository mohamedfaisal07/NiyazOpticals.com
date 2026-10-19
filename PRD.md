# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## PROJECT NAME: NIYAZ OPTICALS
### Tagline: Factory Price. Premium Vision.

---

### 1. Vision
Niyaz Opticals is a premium, luxury-grade, factory-direct optical e-commerce brand that bridges the gap between luxury eyewear and direct-to-consumer affordability. By eliminating middlemen, Niyaz Opticals offers premium, high-quality prescription eyeglasses and sunglasses at flat factory-direct prices under ₹1000. The website serves to establish trust, show a luxurious aesthetic (inspired by Apple, Stripe, and Linear), provide a simple and elegant checkout experience, and automate prescription collections post-payment.

---

### 2. User Personas
1. **The Smart Professional (Karthik, 28, Trichy)**: Wants durable, high-quality computer blue-light glasses for work. He values design, luxury aesthetics, and expects a fast checkout experience. He is happy to send his prescription over WhatsApp.
2. **The Budget-Conscious Fashionista (Anjali, 22, Chennai)**: Wants to own multiple pairs of glasses matching her outfits. Traditional opticians charge ₹3,000+ per pair. Niyaz Opticals allows her to buy premium full-frame and rimless styles for under ₹999 each.
3. **The Practical Parent (Meenakshi, 40, Trichy)**: Needs sturdy glasses for her kids. Wants direct support, clear sizes, and the option to either book an eye test locally or upload prescription details with human consultation support.

---

### 3. Information Architecture
- **Home**: Hero, Categories, How It Works, Handcrafted Collections, Lens Tech Showcase, Brand Statistics, Testimonials, Live Map & Store Info, FAQ, Footer.
- **Shop**: Collection-based layout (Full Frame, Half Frame, Rimless, Men's Sunglasses, Kids Glasses). Total 100 products (20 per collection).
- **Cart & Checkout**: Drawer-based dynamic cart, Razorpay Checkout modal, dynamic discounts, and prescription notices.
- **Order Success Page**: Multi-action landing page with WhatsApp/Call direct action triggers, order details, and consultation process breakdown.
- **Wishlist & Track Order**: Simple client-side storage for tracking favorites and order delivery status.
- **Eye Test / Appointment Booking**: Form-based local store visit and home testing reservation.
- **Contact Us**: Address details, interactive map, booking widget, support hotline triggers.
- **Admin Dashboard**: Live metrics, Order status modifier, Product manager, Appointment list, Customer accounts, Revenue charts.

---

### 4. User Flows
1. **Purchase Flow**:
   `Browse Home/Shop` ➔ `Select Style & Options (Frame Size, Lens Type)` ➔ `Add to Cart` ➔ `Dynamic Cart Review` ➔ `Checkout (Contact & Address)` ➔ `Razorpay Sandbox Payment Portal` ➔ `Payment Success` ➔ `Order Success Page with Post-Payment WhatsApp Prescriptions Instructions`.
2. **Appointment Flow**:
   `Navigate to Appointment/Contact` ➔ `Select Slot & Type (Home Eye Test vs. Store Visit)` ➔ `Submit Details` ➔ `Success Animation & Notification Banner`.
3. **Admin Verification Flow**:
   `Toggle Admin Dashboard` ➔ `View Sales & Trends` ➔ `Process Pending Orders` ➔ `Confirm Prescription Intake`.

---

### 5. Feature List
- **Collection Explorer**: 100 beautifully curated glasses products with customizable properties.
- **Product Options Configurator**: Custom frame sizing (Small, Medium, Large) and lens filters (Classic Clear, Blue-Blocker, Photochromic Transition, Tinted).
- **Responsive Navigation Mega-Menu**: Multi-device floating bar with Category, Wishlist, and Cart quick counters.
- **Razorpay Sandbox Simulator**: Immersive pop-up mimicking the real Razorpay payment interface (UPI, Cards, Netbanking) with real successful completion hooks.
- **Post-Payment Prescription Handler**: Visual steps and clickable WhatsApp API connectors that pre-fill order details.
- **Premium Interactive Filters**: Real-time searching, sorting (price, popularity), and category filtering.
- **Interactive Map & Store Locator**: Beautiful dark embedded maps with responsive quick-routing triggers.
- **Interactive Admin Dashboard**: Live revenue totals, active order lists, custom coupon creators, and appointment managers.

---

### 6. UI/UX Strategy
- **Minimalist Luxury**: High-contrast, spacious layouts with subtle border dividers and glassmorphic overlays.
- **High Interaction Value**: Hover-states that tilt, magnify, or cross-fade products; magnetic CTAs that follow the user's cursor.
- **Zero Friction**: Eliminate prescription forms *before* checkout to maximize checkout conversions.
- **Aesthetic Pairings**: Pairing warm luxurious charcoal with premium aureolin gold accents.

---

### 7. Design System
- **Spacing**: Fluid, balanced scale based on multiples of 4 (e.g., `space-y-4`, `p-8`, `gap-12`).
- **Borders**: Soft lines using `border-neutral-100` and `border-neutral-800` with subtle glass background blurs (`backdrop-blur-md`).
- **Shadows**: Premium floating effects (`shadow-[0_8px_30px_rgb(0,0,0,0.04)]`).

---

### 8. Typography
- **Primary Body Font**: Inter (Clean, neutral, and readable across all devices).
- **Large Headings**: Display typography with generous tracking-tight spacing (`tracking-tight`, `font-extrabold`).
- **Mono Details**: JetBrains Mono for prices, badges, metadata, and status trackers to give a technical, premium feel.

---

### 9. Color Usage
- **Primary Accent**: Aureolin (`#fbe311`) used sparingly for star ratings, primary badges, active cart dots, and button indicators.
- **Secondary Luxury Accent**: Bistre Brown (`#261606`) representing luxury leather, premium optics casing, and deep text highlights.
- **Canvas Base**: Pure white (`#FFFFFF`) with ultra-clean off-white (`#fafafa`/`#f5f5f7`) backdrops.
- **Dark Mode accents**: Charcoal/Black (`#111111`) for buttons, footer, and deep headers.

---

### 10. Motion Guidelines
- **Framer Motion Engines**: Using the standard `motion` exports.
- **Page Transitions**: Soft fade with slight vertical offsets (`y: 20` to `y: 0`) with smooth spring controls.
- **Hover Micro-actions**: Standard spring-loaded hover scales (`whileHover={{ scale: 1.02 }}`) on cards, buttons, and category icons.
- **Stagger Animations**: Sequential entries for lists, product grids, and step workflows.

---

### 11. Component Inventory
- `Navbar`: Global sticky mega menu, search, wishlist, cart button.
- `AnnouncementBar`: Live ticker with factory direct benefits.
- `Hero`: Parallax product card showcase, luxury spacing, trust checklist.
- `CategoryGrid`: Interactive icons for Eyeglasses, Sunglasses, Kids, Computer Glasses.
- `StepGuide`: Animated 3-step prescription flow.
- `ProductGrid`: Infinite filterable products list with quick view options.
- `ProductCard`: High-fidelity vector SVG glasses drawing, dual photo hover, rating stars, and pricing badges.
- `CartDrawer`: Interactive sidebar with order summary, coupons, and checkout buttons.
- `RazorpayModal`: High-fidelity mock popup with simulated payment completion.
- `AdminDashboard`: Fully functioning database controller with charts, orders list, and settings.
- `Footer`: Clean columns with full licensing, copyright, and direct access.

---

### 12. Database Schema
- **Users**: `id, email, name, role (admin/customer), phone, address`
- **Products**: `id, name, type, price, collection, frame_style, color, popularity, image`
- **Orders**: `id, user_email, items, total, status (pending_prescription, processing, shipped, delivered), payment_id, date`
- **Appointments**: `id, client_name, phone, date, slot, type (store/home), status`
- **Coupons**: `code, discount_percent, active`

---

### 13. API Architecture
- `/api/orders`: Create, update, and fetch user purchases.
- `/api/appointments`: Log local eye tests and consultation bookings.
- `/api/products`: Retrieve collection lists with specific pagination.
- Client-side database controller: An integrated system that seamlessly fallbacks to dynamic state + localStorage when external backend connections are configuring.

---

### 14. Folder Structure
```text
/src
  /components
    Navbar.tsx
    Hero.tsx
    ProductCard.tsx
    CartDrawer.tsx
    RazorpayModal.tsx
    AdminDashboard.tsx
    ProductDetailModal.tsx
    StepsSection.tsx
    FAQSection.tsx
    LocationSection.tsx
    Footer.tsx
  /pages
    Shop.tsx
    Contact.tsx
    WishlistPage.tsx
    OrderTracking.tsx
    Appointments.tsx
  App.tsx
  index.css
  main.tsx
  types.ts
  data.ts
```

---

### 15. Supabase Structure
- RLS Policies to allow standard reading of `products` and `categories` globally.
- Write/Read policies on `orders` and `appointments` secured by email markers or user session IDs.
- Admin role overrides on all tables to populate the interactive administration panel.

---

### 16. Razorpay Flow
1. User clicks "Proceed to Pay" in checkout drawer.
2. Order totals are validated, and a virtual order object is registered.
3. High-fidelity Razorpay payment overlay opens on top of the screen.
4. User selects payment method (UPI, Card, Netbanking).
5. A loading spinner simulates verification with Razorpay servers.
6. Successful state is triggered, writing the purchase to Database/localStorage.
7. Redirects to Success page with instant direct WhatsApp action buttons pre-configured with the transaction code.

---

### 17. Security Plan
- Row-Level Security (RLS) on Supabase.
- Strict sanitization of input variables in contact forms and bookings.
- Environment variable protection: Keeping all API hooks client-safe and client-isolated.

---

### 18. SEO Strategy
- Semantic HTML tags (`<header>`, `<main>`, `<article>`, `<footer>`).
- Rich Schema definitions for Product listings, Local Store, and Business Details.
- Fast Page Loading to prevent search engine crawler dropouts.

---

### 19. Performance Strategy
- Dynamic product listing renders using React memoization.
- Clean vector SVGs instead of heavy generic images where possible.
- Lazy-loaded sections using standard viewport intersection observers.

---

### 20. Accessibility Checklist
- **Color Contrast**: Compliant text elements against light off-white backdrops.
- **Keyboard navigation**: Support focus rings and tab orders.
- **Screen Reader Friendly**: Proper ARIA tags on interactive drawers and custom checkout overlays.

---

### 21. Mobile Strategy
- 100% responsive grid.
- Touch targets designed at `48px` minimum.
- Sticky floating bottom contact action bars (Call/WhatsApp) specifically on mobile viewports.

---

### 22. Admin Dashboard Plan
- **Analytics Overview**: Dynamic widgets displaying total earnings, number of spectacles manufactured, and appointment ratios.
- **Product Controller**: A full GUI allowing additions of new designs and frames with pricing.
- **Live Order List**: Interactive status manager to flag items as "Awaiting Prescription", "Lens Grinding", "Quality Check", or "Shipped".

---

### 23. Future Roadmap
- Virtual 3D Try-On using device camera stream.
- Advanced prescription scanner converting photos to structural data.
- Personalized AI face shape analyzer suggesting exact frame selections.
