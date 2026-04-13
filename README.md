# ShopZone — Full-Stack eCommerce App

A full-stack Amazon-like eCommerce application built with React, Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6, Bootstrap 5 |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas + Mongoose            |
| Auth       | JWT (JSON Web Tokens)               |
| Payments   | Stripe (optional)                   |
| HTTP       | Axios                               |

---

## Project Structure

```
ecommerce/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seeder.js        # Sample data seeder
│   ├── server.js        # Entry point
│   └── .env.example
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/         # Axios API calls
│       ├── components/  # Reusable components
│       ├── context/     # Auth & Cart context
│       └── pages/       # Page components
│           └── admin/   # Admin pages
│
└── README.md
```

---

## Setup & Installation

### 1. Clone and install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL
```

### 3. Seed the database

```bash
node backend/seeder.js
```

This creates:
- Admin: `admin@ecommerce.com` / `admin123`
- User: `john@example.com` / `password123`
- 8 sample products

### 4. Run the application

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm start
```

Open http://localhost:3000

---

## API Routes

### Auth
| Method | Route              | Access  | Description        |
|--------|--------------------|---------|--------------------|
| POST   | /api/auth/register | Public  | Register user      |
| POST   | /api/auth/login    | Public  | Login user         |
| GET    | /api/auth/me       | Private | Get current user   |

### Products
| Method | Route                      | Access       | Description         |
|--------|----------------------------|--------------|---------------------|
| GET    | /api/products              | Public       | Get all products    |
| GET    | /api/products/:id          | Public       | Get single product  |
| GET    | /api/products/categories   | Public       | Get categories      |
| POST   | /api/products              | Admin        | Create product      |
| PUT    | /api/products/:id          | Admin        | Update product      |
| DELETE | /api/products/:id          | Admin        | Delete product      |
| POST   | /api/products/:id/reviews  | Private      | Add review          |

### Orders
| Method | Route                  | Access  | Description          |
|--------|------------------------|---------|----------------------|
| POST   | /api/orders            | Private | Create order         |
| GET    | /api/orders/myorders   | Private | Get my orders        |
| GET    | /api/orders/:id        | Private | Get order by ID      |
| PUT    | /api/orders/:id/pay    | Private | Mark as paid         |
| GET    | /api/orders            | Admin   | Get all orders       |
| PUT    | /api/orders/:id/status | Admin   | Update order status  |

### Users
| Method | Route              | Access  | Description        |
|--------|--------------------|---------|--------------------|
| GET    | /api/users         | Admin   | Get all users      |
| PUT    | /api/users/profile | Private | Update profile     |
| DELETE | /api/users/:id     | Admin   | Delete user        |
| PUT    | /api/users/:id/role| Admin   | Update user role   |

---

## Features

- User registration & login with JWT
- Product browsing, search, and category filtering
- Product details with reviews & ratings
- Add to cart with quantity management
- Checkout with shipping address
- Order placement and history
- Admin dashboard with stats
- Admin: CRUD products, manage orders & users
- Responsive design (Bootstrap 5)
- Toast notifications
- Persistent cart (localStorage)

## Stripe Payment (Optional)

1. Add your Stripe keys to `.env` files
2. The `/api/payment/create-payment-intent` endpoint is ready
3. Integrate `@stripe/react-stripe-js` in `CheckoutPage.js`
