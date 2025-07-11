# ☕ setengahLima 

A modern full-stack web application that enables customers to browse menus, customize orders, and make seamless transactions at a coffee shop — all in real time.

---

## 📚 Table of Contents

- [Overview](#overview)
  - [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

---

## 📖 Overview

This application is built to streamline and modernize the coffee shop ordering experience. Users can place orders online, track their order status, and pay directly through the platform. The app also supports admin functionalities for product and order management.

### ✨ Features

- **Interactive Menu & Custom Orders**  
  Customers can browse the full coffee menu, choose drink sizes, customize preferences (e.g., sweetness, toppings), and add to cart.

- **Admin Dashboard**  
  Admin users can add/edit menu items, manage stock, handle orders, and track transactions.

- **Online Payment Integration**  
  Integrated with Midtrans for secure online payments via bank transfers, e-wallets, and credit cards.

- **Authentication & Authorization**  
  Secure login, registration, and role-based access control using Supabase Auth.

- **Responsive UI**  
  Optimized for all devices using Tailwind CSS with a clean and intuitive interface.

---

## 🛠 Tech Stack

**Frontend**
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend**
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Supabase](https://supabase.com/) (Auth & Storage)
- [Midtrans](https://midtrans.com/) (Payment Gateway)
- [UltraMsg](https://ultramsg.com/) (Whatsapp API)

**Database**
- PostgreSQL (managed by Supabase)

---

## 🚀 Getting Started

To run this app locally, follow the steps below:

### 📦 1. Clone the Repository

```bash
git clone https://github.com/mickooos/setengahLima.git
cd setengahLima
```

### 📁 2. Install Dependencies
```bash
# Client
cd client
npm install && npm run dev

# Admin
cd client
npm install && npm run dev

# Backend
cd ../server
npm install
```

### 🔐 3. Setup Environment Variables
Create .env files in both client/, admin/ and server/ directories.

server/.env
```.env
DATABASE_URL=your_postgres_database_url
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
ULTRAMSG_API_URL=your-ultramsg-api-url
ULTRAMSG_INSTANCE_ID=your-ultramsg-instance
ULTRAMSG_API_TOKEN=your-ultramsg-api-token
```

client/.env
```.env
VITE_API_URL=your-api-url
VITE_MIDTRANS_API_URL=your-midtrans-api-url
VITE_MIDTRANS_CLIENT_KEY=your-midtrans-client-key
```

admin/.env
```.env
VITE_API_URL=your-api-url
VITE_REACT_ADMIN_ACCESS_KEY=your-admin-access-key
```

### 🧱 4. Database Setup
Use Prisma to push the schema and generate the client:
```bash
cd server
npm run migrate
npm run seed
```
### 🏃 5. Run the App
```bash
# Start server
cd server
npm run serve

# Start client && admin (in another terminal)
cd ../client or admin
npm run dev
```
📚 Resources

- [Midtrans Documentation](https://docs.midtrans.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/learn/installation)
- [Tailwind CSS Documentation](https://v2.tailwindcss.com/docs)
- [Vite Documentation](https://vite.dev/guide/)
- [Express.js Documentation](https://expressjs.com/en/starter/installing.html)
- [UltraMsg](https://docs.ultramsg.com/)
