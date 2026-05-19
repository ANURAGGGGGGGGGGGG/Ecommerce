# Modern E-Commerce Platform

A full-stack, modern e-commerce application built with Next.js (App Router), React 19, Tailwind CSS v4, and MongoDB. The platform provides a seamless shopping experience for buyers and a comprehensive dashboard for sellers to manage their products.

## 🚀 Features

- **User Authentication**: Secure user login and registration with database-driven validation.
- **Role-Based Access**: 
  - **Buyers**: Browse products, add to cart, and checkout.
  - **Sellers**: Dedicated seller dashboard, add and manage products.
- **Product Management**: Full CRUD operations for products backed by a persistent MongoDB database.
- **Shopping Cart**: Dynamic shopping cart with real-time total calculations, quantity adjustments, and animated UI interactions.
- **Checkout Process**: Streamlined checkout flow with conditional free delivery logic for orders over $500.
- **Modern UI/UX**: Highly responsive and engaging design utilizing Tailwind CSS, featuring CSS-based hover effects, glassmorphism, and smooth micro-animations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ORM/ODM**: [Mongoose](https://mongoosejs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

```
ecommerce/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── api/              # Backend API endpoints (Auth, Products, etc.)
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout flow
│   ├── login/            # User authentication (Login)
│   ├── products/         # Product listing page
│   ├── register/         # User registration
│   └── seller/           # Seller dashboard & product management
├── components/           # Reusable React components (Navbar, ProductCard, etc.)
├── data/                 # Static data or initial database seeds
├── lib/                  # Utility functions and configuration (e.g., MongoDB connection)
├── models/               # Mongoose database schemas (User, Product)
├── public/               # Static assets (images, icons)
└── types/                # TypeScript type definitions
```

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ecommerce
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory and add your environment variables. You will need your MongoDB connection string and any other required secrets.

```env
MONGODB_URI=your_mongodb_connection_string
# Add other variables like JWT_SECRET, NextAuth URLs, etc., as needed
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 🎨 UI & Performance Optimizations

- Replaced inline JavaScript `onMouseEnter`/`onMouseLeave` with performant CSS-based hover styles via `globals.css`.
- Utilized CSS animations for cart interactions (scale effects, smooth transitions) for better user engagement.
- Optimized `useEffect` hooks across components (like `Navbar`) to prevent unnecessary re-renders on route changes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
