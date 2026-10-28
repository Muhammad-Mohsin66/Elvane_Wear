# ELVANE WEAR — LUXURY 3D E-COMMERCE PLATFORM (MERN)

> *"Engineered for movement. Designed for stillness."*

A full-stack, production-grade luxury e-commerce web platform for **"Elvane Wear"**, crafted with high-fashion white-canvas aesthetics, Glacier Sky-Blue frosted glass, Champagne Gold accents, and tactile 3D perspective physics.

---

## 🏛️ Default Credentials

| Portal | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin Dashboard** (`/super-admin`) | `superadmin` | `superadmin@elvanewear.com` | `SuperAdmin@123` |
| **Admin Panel** (`/admin`) | `admin` | `admin@elvanewear.com` | `Admin@123` |
| **Storefront Customer** | `customer` | Sign up via `/register` (OTP logged to console) | Self-selected |

---

## ⚡ Tech Stack

- **Frontend (`/client`):**
  - React 18 + Vite (ES6+)
  - Tailwind CSS + Luxury CSS Design Tokens (`src/styles/tokens.css`)
  - Framer Motion (3D Perspective tilt, multi-plane translateZ depth, glare, and spring physics)
  - Lenis (Smooth inertial scrolling)
  - Lucide React (Delicate stroke width: 1.25–1.5)
  - Zustand (Cart & Auth persistence)
  - Recharts (Analytics and financial reporting)
  - Cormorant Garamond & Inter Typography

- **Backend (`/server`):**
  - Node.js + Express.js
  - MongoDB via Mongoose
  - JWT Authentication + bcryptjs
  - Role-Based Access Control (`customer`, `admin`, `superadmin`)
  - Nodemailer (OTP Verification with console fallback for testing)
  - Multer (Product images & JazzCash payment screenshots)
  - Real-time Admin Activity Audit Logs (`AuditLog` model)

---

## 💎 Core Brand & Architectural Highlights

1. **Single Complete 1-Piece Set Rule:**
   - Tracksuits are sold strictly as complete 2-piece sets (Top + Bottom). Separates are forbidden.
2. **Pakistani Rupee (`PKR` / `Rs.`):**
   - All catalog pricing, totals, and invoice bills use PKR throughout.
3. **Dynamic Active Variants:**
   - Admin toggles active colors and sizes in the Admin panel. Customers only see and select enabled variants.
   - Internal `inventoryCount` (stock quantity) is hidden from customers on the frontend.
4. **Email Verification Flow:**
   - Sign up issues a 6-digit OTP (logged in server console and sent via email).
   - Checkout is gated until `isEmailVerified === true`.
5. **Two Payment Methods:**
   - **Cash on Delivery (COD)**: Standard courier dispatch.
   - **JazzCash Manual Transfer & Screenshot Upload**: Requires customer to upload transfer receipt and transaction ID for Admin approval.
6. **Two-Tier Administrative Control:**
   - **Admin Panel (`/admin`)**: Fixed left sidebar for Orders, Products, + New Product, Promo Banner, and Revenue. Admin cannot change their own password.
   - **Super Admin Executive Dashboard (`/super-admin`)**: Recharts financial analytics, real-time Admin Activity Audit Log packets with before/after diffs, and Admin credential rotation.

---

## 🚀 Running the Application

### 1. Database Seeding
```bash
cd server
npm run seed
```

### 2. Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Application
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```
