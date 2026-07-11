# SHOPPER | Full-Stack Luxury Apparel E-Commerce Ecosystem

An enterprise-grade, full-stack e-commerce platform featuring a fluid, high-end customer storefront and an integrated real-time administrative intelligence dashboard. Built on the Robust MERN/MVC architectural pattern, this application delivers a premium, responsive digital retail experience with secure role-based authentication, interactive inventory management, and custom database aggregations.

---

## 💎 Project Showcases & Architecture

The application is engineered as a decoupled full-stack system optimized for performance, security, and design unity:

*   **Client Storefront:** A light, upscale, minimalist editorial layout utilizing glassmorphic navigation interfaces, micro-animated product interactions, multi-criteria category filtering, single-page logistics checkouts, and fully responsive media layouts.
*   **Administrative Management Suite:** Rebuilt into a clean Light Mode reporting workspace that mirrors the storefront design language. Features multi-step product registration steppers, live spreadsheet inventory matrix grids, targeted campaign configuration tables, and automated customer tracking manifestations.

---

## 🚀 Key Feature Ledger

### 🛍️ Client Frontend Platform
*   **Glassmorphic Navigation Hub:** Floating navigation matrix containing context-aware visibility, shopping cart responsive counters, and smooth routing layouts.
*   **Asymmetric Curated Grid Matrices:** Modern lookbook configurations allowing customers to filter inventory categories seamlessly based on dynamic profile types.
*   **Curated Promotional Displays:** Smooth-scrolling showcase structures containing programmatic view triggers alongside responsive image transformation capabilities.
*   **Persistent Shopping Cart Engine:** Stateful basket aggregation pipelines enabling synchronous addition, subtraction, and persistent database catalog matching.
*   **Single-Page Checkout Canvas:** A combined layout organizing order summary logs, shipping addresses, invoice totals, and coupon application logic in a single view.

### 🛠️ Administrative Operations Portal
*   **Enterprise Dashboard Analytics:** Direct visualization maps connected to real-time database endpoints displaying gross income calculation loops, volumetric shipping metrics, and account volumes.
*   **Multi-Step Product Ingestion Stepper:** Clean workflow organizing product specifications, category mappings, textual metadata configurations, and raw media file attachment boundaries.
*   **Live Multi-Size Stock Grid:** Advanced inventory table layout where administrators can execute precise changes on prices and sizes (S, M, L, XL) simultaneously using custom inline controllers.
*   **Promotional Campaign Coupon Matrix:** Real-time marketing configuration pipeline designed to spawn percentage or fixed currency markdown configurations with dynamic constraints.
*   **Fulfillment Log Manifest Modals:** Advanced inspect cards detailing active orders, customer contact information, delivery drop-offs, itemized line sheets, and progress tracking indicators.

### ⚡ Secure Backend API & Database Infrastructure
*   **Decoupled Model-View-Controller (MVC) Design:** Logical backend structural layering separating Mongoose collection schemas, route handlers, and middleware token checking algorithms.
*   **Dynamic MongoDB Pipeline Aggregations:** High-performance database processing tracking categories, calculating true aggregate sums, and cleaning up financial records on the fly.
*   **Role-Based Access Control (RBAC):** Tokenized routing guards intercepting administrative incoming traffic to prevent profile token blending or session leaks.
*   **Multipart Media Ingestion Handling:** Streamlined binary file handlers mapping incoming asset uploads to designated storage routes while preserving data structural formatting.

---

## 🛠️ Technology Stack Blueprint

### Frontend Architecture
*   **React 18:** Modern declarative user interface rendering component state layers.
*   **React Router DOM v6:** Declarative client-side address matching and window tracking handlers.
*   **Vanilla CSS3 Elements:** Native custom property parameters, flexible layouts, grid alignment systems, and cubic-bezier entry animations.

### Backend Infrastructure
*   **Node.js & Express.js:** Asynchronous event-driven framework hosting secure MVC API routes.
*   **JSON Web Tokens (JWT):** Cryptographically signed authentication signatures tracking session parameters.
*   **Multer Middleware Engine:** Robust disk storage processor handling multipart form-data image binary transformations.

### Cloud Persistence Layer
*   **MongoDB Atlas:** Cloud-hosted database hosting user accounts, cart logs, promo data, and order history records.
*   **Mongoose ODM:** Strongly typed schema verification layers handling validation parameters.

---

## 📊 System Database Schema Specifications

The ecosystem architecture processes interactions between four core database blueprints:

### 👤 User Document Model
*   Stores core structural attributes: Name, authenticated email addresses, and encrypted password data hashes.
*   Manages access profile validation parameters (`role: 'user' | 'admin'`).
*   Hosts persistent object documents mapping individual checkout variables (`cartData`).

### 👕 Product Document Model
*   Tracks specific asset data points: Titles, descriptive overviews, categorization parameters, and target URLs.
*   Processes complex sub-objects configuring localized size profiles (`size_stock: { S, M, L, XL }`).
*   Maintains double-precision float values handling active discount strategies (`old_price`, `new_price`).

### 📦 Order Document Model
*   Logs explicit purchase manifest variables: Chronological timestamps, internal IDs, invoice values, and arrays containing specific items bought.
*   Maintains status tracker attributes (`status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'`).
*   Binds user references to shipping drop-off endpoints.

### 🎟️ Coupon Document Model
*   Differentiates coupon rule definitions (`discountType: 'percentage' | 'fixed'`).
*   Enforces configuration constraints: Minimum order totals, deduction amounts, expiration limits, and target coupon strings.

---

## 💻 Local Installation & Setup Walkthrough

### ⚙️ Prerequisites
Ensure you have **Node.js (v18+)** and a **MongoDB Atlas Cluster Connection String** ready.

### 🏁 1. Clone the Code Repository Base
```bash
git clone [https://github.com/yourusername/shopper-ecommerce.git](https://github.com/yourusername/shopper-ecommerce.git)
cd shopper-ecommerce
