# SHOPPER | Premium Ethnic E-Commerce Platform

A highly optimized, production-ready frontend e-commerce web application specialized in premium stitched and unstitched traditional attire. Built using **React 18**, **Vite**, and styled with **Tailwind CSS / Custom CSS variables**, this platform transforms a standard digital storefront concept into an interactive, high-fidelity user experience featuring multi-tier data pipelines and advanced global state configurations.

---

## 🚀 Core Features & Architectural Milestones

* 🌓 **Dual-Context Theme Management Matrix:** Integrated a global `ThemeContext` tracking state shifts between Light and Dark interface configurations. Managed persistently through local browser runtime environments (`localStorage`).
* 🔍 **Interactive Product Lens & Visual Carousel:** Upgraded the product detail page view with an automated thumbnail preview selector and a cursor-tracking coordinate magnifying zoom lens natively driven via CSS transformations.
* 📊 **Multi-Tier Search & Content Pipelines:** Implemented granular Client-side data filters on catalog panels combining instant input search fields, structural category matches, and categorical collection tags (Stitched, Kurta, Lawn).
* 📐 **Dynamic Price Sorting Engine:** Built a numerical list array sorting processor handling real-time budget adjustments (`Price: Low to High` / `Price: High to Low`) seamlessly in parallel with active filters.
* 🔐 **Client-Side Form Field Validation Layer:** Integrated live validation tracking inside authentication views to intercept inaccurate formatting parameters (e.g., email syntax formatting and password length requirements) with dedicated error states.
* 💳 **Structured Transaction Flow:** Replaced static alerts with a fully operational, responsive multi-column Checkout page linked to derived global totals (automated subtotal parsing, 5% estimated GST calculation, and multi-tier shipping structures).
* 🔄 **Transactional Cache Clearing Workflow:** Programmed a automated `clearCart` memory wipe that clears out global dictionary state indices and resets cached browser data handles upon successful checkout submission.

---

## 🛠️ Tech Stack & Technical Tools

* **Frontend Engine:** React 18 (Functional Components, Hooks)
* **Compilation & Bundling Framework:** Vite (Fast Refresh HMR, Optimized Production Tree Shaking)
* **Routing Architecture:** React Router DOM v6 (Declarative URL Parameter Mappings)
* **State Management Middleware:** React Context API (Shared Shopping Bag Context & Global Theme Context Providers)
* **Interface Foundations:** Custom Responsive CSS Layout Matrices, Semantic HTML5 Elements, Unicode Glyphs

---

## 📁 System Component & Directory Architecture

```text
src/
├── components/
│   ├── Assets/              # Brand logos, core collection icons, image databases
│   ├── CartItems/          # Dynamic shopping basket overview panel
│   ├── Footer/             # Reusable global site footer with interactive handles
│   ├── Navbar/             # Responsive dual-context navbar header with cart badging
│   └── ProductDisplay/     # High-fidelity image carousel and hover magnifying lens
├── context/
│   ├── ShopContext.jsx     # Global transactional computation data core provider
│   └── ThemeContext.jsx    # UI configuration theme context manager layer
├── pages/
│   ├── CSS/                # View-specific responsive layout stylesheets
│   ├── About.jsx           # Corporate platform description placeholder
│   ├── Checkout.jsx        # Validation-driven billing form page layout
│   ├── LoginSignup.jsx     # Dual-state validation-backed auth gateway
│   ├── OrderSuccess.jsx    # Real-time transaction invoice receipt page
│   ├── Product.jsx         # Product routing contextual snapshot container
│   └── ShopCategory.jsx    # Search, tag filter, and numerical sorting grid canvas
├── App.jsx                 # Route manager engine and layout system orchestrator
└── main.jsx                # Render target entry root binding multi-context trees
