# ShopFlow — Full-Stack Assignment

This repository contains a Node.js / Express backend and a React / Vite frontend for a B2B inventory and ordering service.

## Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in your MongoDB and Redis connection details.
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

The backend runs on `http://localhost:5000` by default.

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:5173` by default.

## Features

- JWT access + refresh tokens with Redis-backed refresh storage
- Rate limiting on auth endpoints using Redis
- Role-based authorization for products and orders
- Product list caching in Redis with query-aware cache keys
- Product listing with pagination, filtering, sorting, and search
- Atomic order placement with inventory decrement in MongoDB transactions
- Role-aware frontend UI: admin/manager product create/edit/delete, customers can place orders
- Secure token refresh on 401 responses

## Available APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
