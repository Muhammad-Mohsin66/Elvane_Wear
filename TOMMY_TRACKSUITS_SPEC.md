# MASTER BUILD SPECIFICATION: "TOMMY TRACKSUITS" — LUXURY 3D E-COMMERCE PLATFORM (MERN STACK)

## 1. PROJECT OVERVIEW & BRAND IDENTITY
You are a Senior Full-Stack MERN Architect and Creative Frontend Developer. Build a complete, production-ready, high-fashion luxury e-commerce web application for **"Tommy Tracksuits"**.
- **Product Focus:** Complete luxury minimalist tracksuit sets ONLY (no separate hoodies or trousers sold individually; every product is a complete 1-piece tracksuit set).
- **Brand Promise:** *"Engineered for movement. Designed for stillness."*
- **Design Goal:** White Canvas Luxury meets Interactive 3D Spatial Web. It must feel like walking into a high-end fashion atelier (think Celine, Aesop, COS, Dior Men)—NOT a generic store. 85%+ of the viewport must remain pristine warm-white breathing room, elevated by subtle **Glacier Sky-Blue frosted glass** and **Champagne Gold** accents, paired with rich **3D perspective tilt, depth layers, and magnetic physics**.
- **Currency:** Pakistani Rupee (`PKR` / `Rs.`).

---

## 2. TECH STACK & ARCHITECTURE
### Frontend (`/client`)
- **Framework:** React 18 + Vite (TypeScript or clean ES6+ JSX)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Custom CSS Variables (`src/styles/tokens.css`)
- **3D & Motion Engine:** `framer-motion` (3D perspective tilt, spring physics, page transitions, layout animations) + `lenis` (smooth inertial scrolling) + CSS 3D Transforms (`perspective: 1200px`, `transform-style: preserve-3d`).
- **Icons:** `lucide-react` (stroke-width: 1.25 for delicate luxury feel)
- **State & Fetching:** `@tanstack/react-query` + Context API / Zustand (for Cart, Wishlist, Auth)
- **Forms & Validation:** `react-hook-form` + `zod`
- **Charts (Admin/Super Admin):** `recharts`

### Backend (`/server`)
- **Runtime & Framework:** Node.js + Express.js
- **Database:** MongoDB Atlas via `mongoose`
- **Authentication:** JWT (JSON Web Tokens) + `bcryptjs` + Role-Based Access Control (`customer`, `admin`, `superadmin`)
- **Email Service:** Nodemailer / Resend (for mandatory Email Verification OTP/Link on signup & order updates)
- **File Uploads:** Multer + Cloudinary (or local `/uploads` fallback) for Product Images and Customer JazzCash Payment Screenshots.

---

## 3. COLOR SYSTEM: "GLACIER & CHAMPAGNE ON WHITE CANVAS"
**Strict Luxury Rule:** Never violate the white luxury aesthetic. `--snow` and `--cloud` must dominate 85–90% of the screen. Pure `#FFFFFF` or `#000000` are forbidden. Sky Blue (`--glacier`) is NEVER used as a loud solid block—only as translucent frosted glass, subtle 3D ambient glow, and delicate specular highlights alongside `--champagne`.

Define in `src/styles/tokens.css`:
```css
:root {
  /* Base White Canvas (Dominant 85-90%) */
  --snow: #FAFAFA;               /* Primary background */
  --cloud: #F5F3F0;              /* Alternate sections, input fills, soft cards */
  --silk: #EDE9E3;               /* Subtle dividers, hover fills */

  /* Typography & Ink */
  --graphite: #1A1A1A;           /* Primary headings & dark text */
  --charcoal: #2D2D2D;           /* Body copy */
  --ash: #6E6E6E;                /* Muted text, eyebrows, captions */
  --mist: #B5B0A8;               /* Placeholders, disabled states */

  /* Luxury Accents: Glacier Sky Blue & Warm Champagne */
  --glacier-sky: #B8DCF0;        /* Soft luxury sky blue accent */
  --glacier-glass: rgba(216, 236, 248, 0.55); /* Frosted sky-blue tint for Navbar & 3D glass layers */
  --blush: #E8C4B8;              /* Warm peach-blush */
  --champagne: #D4A76A;          /* Signature warm gold */

  /* Gradients & 3D Lighting */
  --accent-gradient: linear-gradient(135deg, #B8DCF0 0%, #E8C4B8 50%, #D4A76A 100%);
  --cta-gradient: linear-gradient(135deg, #E8C4B8, #D4A76A);
  --sky-ambient-glow: radial-gradient(circle at 50% 50%, rgba(184, 220, 240, 0.38), rgba(212, 167, 106, 0.12), transparent 70%);
  --card-3d-shadow: 0 28px 65px -15px rgba(26, 26, 26, 0.10), 0 12px 30px -10px rgba(184, 220, 240, 0.35);

  /* Borders & Status */
  --hairline: rgba(26, 26, 26, 0.08);
  --hairline-sky: rgba(184, 220, 240, 0.55);
  --hairline-accent: rgba(212, 167, 106, 0.4);
  --danger: #A34040;
  --success: #5A8A6A;
}
```

---

## 4. TYPOGRAPHY & SPACING
- Headlines / Display / Prices: Cormorant Garamond (weights 400, 500, 600, italic 400). Use italic for one emphasized word per headline (e.g., "Engineered for movement.").
- Hero H1: 96px desktop / 48px mobile (line-height: 1.0, letter-spacing: -0.02em)
- H2: 56px desktop / 36px mobile
- H3: 32px desktop / 24px mobile
- Price: 28px Cormorant 500 (PKR 14,500)
- UI / Body / Eyebrows: Inter (weights 400, 500, 600).
- Eyebrow: 11px, uppercase, letter-spacing: 0.25em, --ash.
- Body: 16px, line-height: 1.7.
- Buttons: 12px, uppercase, letter-spacing: 0.16em, pill-shaped (border-radius: 999px).

---

## 5. 3D EFFECTS & HIGH-END INTERACTIVE MOTION SPECIFICATION
The website must feel alive with tactile, smooth 3D depth while maintaining slow, confident luxury motion (cubic-bezier(0.22, 1, 0.36, 1)):

- **3D Perspective Tracksuit Cards (`<ProductCard3D>`):**
  - Wrap cards in a `perspective: 1200px` container.
  - Track cursor `clientX` and `clientY` using Framer Motion (`useMotionValue`, `useSpring`, `useTransform`) to smoothly tilt the card in 3D space (`rotateX` between -8deg and 8deg, `rotateY` between -8deg and 8deg).
  - Multi-Plane Depth (`translateZ`): Inside the card, the product image floats at `translateZ(30px)`, the "New/Bestseller" badge floats at `translateZ(45px)`, and the quick-add/wishlist buttons float at `translateZ(35px)`.
  - Dynamic Glare & Sky-Champagne Shadow: As the card tilts, render a subtle moving specular light sheen across the surface and elevate the card with `--card-3d-shadow`.

- **3D Interactive Magnetic Buttons (`<Button3D>`):**
  - Pill-shaped buttons with subtle 3D bottom-edge depth, magnetic cursor pull (±10px spring physics), scale(1.03) on hover, scale(0.97) on press, and a 700ms diagonal light-sweep reflection.

- **Top Frosted Sky-Luxury Navbar & Scroll Shift:**
  - At top of page: Translucent Glacier Sky-Blue glass (`background: var(--glacier-glass)`, `backdrop-filter: blur(16px)`) with a 1px bottom border fading from Sky Blue to Champagne.
  - On scroll down: Transitions smoothly into crisp `--snow` white glass with a subtle 3D floating elevation shadow.
  - Includes a top Dynamic Announcement Bar above the navbar where Admin-configured storewide discount news is displayed.

- **3D Hero Showcase:**
  - Center editorial typography with two asymmetric floating 3D tracksuit lookbook frames on left and right that respond to mouse parallax in 3D space and scroll parallax (0.85x).

---

## 6. CORE BUSINESS LOGIC & FUNCTIONAL REQUIREMENTS
### 6.1 Initial Product Catalog & Tracksuit Rules
- **Seed Database with 10 Luxury Tracksuit Sets:** Seeded with realistic PKR prices (Rs. 12,500 to Rs. 24,000), fabrics, colors, sizes, and stock counts.
- **Single Complete Set Rule:** Tracksuits are sold strictly as complete sets (Top + Bottom together).
- **Dynamic Active Variants (Colors & Sizes):** Customers on the Product Detail page can ONLY see and select the Sizes and Colors that the Admin has marked as Active/Enabled for that product.
- Backend tracks exact `inventoryCount` (stock quantity), which is strictly hidden from customers on the frontend.

### 6.2 Wishlist & Reviews
- Animated Heart / Favorite button to add/remove items from Wishlist.
- Verified customer reviews & star ratings.

### 6.3 Authentication & Mandatory Email Verification Flow
- Guest browsing allowed. Checkout requires authenticated and email-verified user (`isEmailVerified === true`).
- 6-digit OTP verification screen.

### 6.4 Checkout & Payment Methods (PKR)
- Cash on Delivery (COD).
- JazzCash Manual Transfer + Screenshot Upload & Transaction ID.

---

## 7. TWO-TIER ADMIN ARCHITECTURE
### 7.1 Role Security & Password Governance
- **Super Admin (`role: 'superadmin'`):** Pre-seeded, full system authority.
- **Admin (`role: 'admin'`):** Cannot change or reset their own password. Only Super Admin can rotate Admin's credentials.

### 7.2 Admin Panel (`/admin`) — Left Sidebar Layout
- Orders: Status updates, JazzCash verification modal with zoomable screenshot, manual bill discount adjustments.
- Products: Catalog table with inline stock editor and active color/size toggles.
- New Product (+ New Product): Form with interactive color/size activator.
- Promo Banner: Storewide announcement text and discount privilege.
- Revenue: Store revenue totals and sales metrics.

### 7.3 Super Admin Dashboard (`/super-admin`) — Executive Control & Audit Logs
- Advanced Analytics & Financial Reports (Recharts: Daily, Weekly, Monthly filters).
- Admin Activity Audit Logs ("Change Packets"): Real-time structured notification cards recording every admin write action with before/after diffs.
- Admin Credentials Manager.
