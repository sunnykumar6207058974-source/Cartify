# Cartify Backend API

Express.js RESTful API server for the Cartify E-Commerce platform.

## Features
- **Products API**: GET `/api/products` (supports filter by `category` and `search`)
- **Product Details API**: GET `/api/products/:id`
- **Orders API**: POST `/api/orders` to place orders and GET `/api/orders`
- **CORS Enabled**: Configured for local React Vite frontend communication.

## Quick Start
```bash
cd backend
npm install
npm start
```

Runs at `http://localhost:5000`.
