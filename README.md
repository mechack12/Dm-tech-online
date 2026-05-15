<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="DM Tech Online Banner" width="100%" />

  # DM Tech Online
  
  **A Modern, AI-Powered Tech E-Commerce and Inventory Management Platform**

  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

---

## Overview

DM Tech Online is a premium e-commerce solution designed for tech retailers. It combines a sleek, user-friendly storefront for customers with a powerful administrative dashboard for business owners. Built with performance and aesthetics in mind, it leverages the latest web technologies to provide a seamless shopping experience.

## Key Features

### Customer Experience
- **Dynamic Storefront**: Browse a curated collection of tech products with real-time filtering.
- **Product Insights**: Detailed specifications, high-quality imagery, and transparent pricing.
- **Advanced Cart System**: Seamlessly add, remove, and manage quantities in your shopping bag.
- **Order History**: Track past purchases and monitor delivery status.
- **AI Support Center**: Integration-ready for Gemini AI to assist with customer inquiries.

### Administrative Suite
- **Inventory Control**: Comprehensive Dashboard for adding, editing, and deleting products.
- **Real-time Updates**: Changes to inventory are instantly reflected across the platform.
- **Order Management**: Oversee all customer orders and fulfillment statuses.
- **Role-Based Access**: Secure environments for both Admins and Guests.

## Tech Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (using the new Vite plugin)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **AI**: [Google Gemini AI](https://ai.google.dev/) (via @google/genai)

## Getting Started

### Prerequisites
- **Node.js** (Latest LTS recommended)
- **NPM** or **Yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mechack12/Dm-tech-online.git
   cd Dm-tech-online
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a .env.local file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser.

## Default Credentials

For testing purposes, you can use the following accounts:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | Mech | 1234 |
| **Guest** | Lucky | 12345 |

## Project Structure

```text
src/
├── components/     # Reusable UI components (Buttons, Cards, Layouts)
├── screens/        # Page-level components (Shop, Inventory, Cart, etc.)
├── AppContext.tsx  # Global state management (Cart, Auth, Products)
├── constants.ts    # Initial product and order data
├── types.ts        # TypeScript interfaces and types
└── main.tsx        # Application entry point
```

---

<div align="center">
  Developed by <a href="https://github.com/mechack12">Mechack</a>
</div>
