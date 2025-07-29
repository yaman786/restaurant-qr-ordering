# Restaurant QR Ordering System

A complete restaurant QR-based ordering system with Node.js backend and React frontend.

## 🏗️ Project Structure

```
cursor_tutorial/
├── backend/           # Node.js + Express + PostgreSQL backend
│   ├── index.js      # Main server file
│   ├── db.js         # Database connection
│   ├── routes/       # API routes
│   ├── middleware/   # JWT authentication
│   ├── database.sql  # Database schema
│   └── package.json  # Backend dependencies
├── frontend/         # React + Vite + Material-UI frontend
│   ├── src/          # React components
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up database
createdb restaurant_ordering
psql -d restaurant_ordering -f database.sql

# Configure environment
cp env.example .env
# Edit .env with your database credentials

# Create admin user
node setup-admin.js admin admin123

# Start backend server
npm start
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🍽️ Features

### Customer Features
- **QR Code Scanning**: Scan table QR codes to access menus
- **Interactive Menu**: Browse items with descriptions and prices
- **Shopping Cart**: Add/remove items with real-time updates
- **Order Placement**: Place orders with multiple items
- **Order Tracking**: Real-time status updates
- **Mobile Responsive**: Works perfectly on phones

### Admin Features
- **Secure Login**: JWT-based authentication
- **Order Management**: View and update order status
- **Menu Management**: Full CRUD operations on menu items
- **QR Code Generator**: Generate and download QR codes
- **Real-time Updates**: Auto-refresh for live tracking

## 🔧 API Endpoints

### Public Routes
- `GET /menu` - Get available menu items
- `POST /order` - Place new order
- `GET /order/:tableNumber` - Get table orders

### Admin Routes (JWT Protected)
- `POST /admin/login` - Admin authentication
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/:id/status` - Update order status
- `GET /admin/menu` - Get all menu items
- `POST /admin/menu` - Add menu item
- `PUT /admin/menu/:id` - Update menu item
- `DELETE /admin/menu/:id` - Delete menu item

## 📱 Frontend Routes

- `/` - Homepage with navigation
- `/menu/:tableNumber` - Customer menu interface
- `/status/:tableNumber` - Order status tracking
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin management panel
- `/admin/qr-generator` - QR code generation

## 🗄️ Database Schema

- **tables** - Restaurant tables
- **menu_items** - Menu with prices and availability
- **orders** - Customer orders with status
- **order_items** - Order line items
- **admin_users** - Admin accounts

## 🔐 Security Features

- **JWT Authentication** - Secure admin access
- **Password Hashing** - bcrypt for secure storage
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin security
- **Input Validation** - Comprehensive validation

## 📊 Order Status Flow

1. **pending** → Order received
2. **preparing** → Kitchen is preparing
3. **ready** → Order ready for delivery
4. **delivered** → Order delivered to table
5. **cancelled** → Order cancelled

## 🎯 Demo Credentials

- **Admin Login**: username: `admin`, password: `admin123`
- **Demo Tables**: Visit `/menu/1` or `/menu/2` for customer demo

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Use production PostgreSQL
3. Set up SSL certificates
4. Use PM2 for process management

### Frontend Deployment
1. Build: `cd frontend && npm run build`
2. Deploy `dist/` folder to hosting service
3. Update API base URL in production

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # If nodemon is installed
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Management
```bash
# Connect to database
psql -d restaurant_ordering

# View tables
\dt

# View sample data
SELECT * FROM menu_items;
SELECT * FROM orders;
```

## 📞 Support

For issues or questions:
1. Check the individual README files in `backend/` and `frontend/`
2. Verify database connection and environment variables
3. Test API endpoints with curl or Postman
4. Check browser console for frontend errors

## 📄 License

MIT License - see individual component licenses for details. 