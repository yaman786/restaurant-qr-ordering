# Restaurant QR Ordering System - Frontend

A modern React frontend for the restaurant QR-based ordering system. Built with Vite, Material-UI, and React Router.

## Features

### 🍽️ Customer Features
- **QR Code Scanning**: Customers scan QR codes to access table-specific menus
- **Interactive Menu**: Browse menu items with descriptions and prices
- **Shopping Cart**: Add/remove items with real-time cart management
- **Order Placement**: Place orders with multiple items
- **Order Tracking**: Real-time order status updates
- **Responsive Design**: Works on mobile, tablet, and desktop

### 👨‍💼 Admin Features
- **Secure Login**: JWT-based authentication
- **Order Management**: View all orders and update status
- **Menu Management**: Full CRUD operations on menu items
- **QR Code Generator**: Generate and download QR codes for tables
- **Real-time Updates**: Auto-refresh for live order tracking

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **QRCode.react** - QR code generation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
│   ├── HomePage.jsx     # Landing page
│   ├── CustomerMenu.jsx # Customer menu interface
│   ├── CustomerOrderStatus.jsx # Order tracking
│   ├── AdminLogin.jsx   # Admin authentication
│   ├── AdminDashboard.jsx # Admin management panel
│   └── QRCodeGenerator.jsx # QR code generation
├── services/
│   └── api.js          # API service functions
├── utils/              # Utility functions
├── App.jsx            # Main app component
└── main.jsx           # App entry point
```

## Usage Guide

### For Customers

1. **Access Menu**: Scan QR code or visit `/menu/{tableNumber}`
2. **Browse Items**: View menu with prices and descriptions
3. **Add to Cart**: Click + button to add items
4. **Review Order**: Open cart drawer to review items
5. **Place Order**: Click "Place Order" to submit
6. **Track Status**: View order progress at `/status/{tableNumber}`

### For Admins

1. **Login**: Visit `/admin/login` (admin/admin123)
2. **Manage Orders**: View and update order status
3. **Manage Menu**: Add, edit, or delete menu items
4. **Generate QR Codes**: Create QR codes for tables

## API Integration

The frontend communicates with the backend API at `http://localhost:3000`:

- **Customer Endpoints**: Menu, order placement, order status
- **Admin Endpoints**: Authentication, order management, menu CRUD
- **JWT Authentication**: Secure admin access

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy Options

- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **Firebase**: Use Firebase Hosting
- **Custom Server**: Serve `dist/` files

## QR Code Implementation

### How QR Codes Work

1. **Generation**: Admin generates QR codes for each table
2. **Content**: QR codes contain URLs like `https://yourapp.com/menu/5`
3. **Scanning**: Customers scan with phone camera
4. **Access**: Automatically opens menu for that table

### QR Code Features

- **Customizable Size**: Adjust QR code dimensions
- **Download Options**: Individual or bulk download
- **High Quality**: Optimized for printing
- **Error Correction**: Built-in error correction

## Mobile Optimization

The frontend is fully responsive and optimized for mobile devices:

- **Touch-friendly**: Large buttons and touch targets
- **Mobile-first**: Designed for phone screens
- **PWA Ready**: Can be installed as app
- **Offline Support**: Basic offline functionality

## Security Features

- **JWT Tokens**: Secure admin authentication
- **Input Validation**: Client-side form validation
- **CORS Handling**: Proper cross-origin requests
- **Error Handling**: Graceful error management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
- Check the backend documentation
- Review API endpoints
- Test with the demo credentials

## License

MIT License - see LICENSE file for details. 