# ⚡ Quick Deployment Guide

## 🚀 Deploy Your Restaurant System in 10 Minutes!

### Step 1: Prepare Your Code (2 minutes)
```bash
# Run the deployment script
./deploy.sh

# Or manually:
git init
git add .
git commit -m "Initial commit"
# Create GitHub repo and push
```

### Step 2: Deploy Backend on Render (5 minutes)
1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click "New +"** → "Web Service"
4. **Connect** your GitHub repository
5. **Configure**:
   - Name: `restaurant-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `restaurant-db`
7. **Set Environment Variables** (copy from your PostgreSQL service):
   ```
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_NAME=restaurant_ordering
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

### Step 3: Deploy Frontend on Vercel (3 minutes)
1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Import** your GitHub repository
5. **Configure**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
6. **Set Environment Variable**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

### Step 4: Setup Database (2 minutes)
1. **Connect** to your Render PostgreSQL database
2. **Run** the SQL script from `backend/database.sql`
3. **Create admin user**:
   ```bash
   node setup-admin.js admin admin123
   ```

### Step 5: Test Your App
- **Frontend**: https://your-frontend.vercel.app
- **Customer Menu**: https://your-frontend.vercel.app/menu/1
- **Admin Login**: https://your-frontend.vercel.app/admin/login
  - Username: `admin`
  - Password: `admin123`

## 🎉 You're Live!

Your restaurant ordering system is now online and accessible worldwide!

## 🔧 Need Help?

- **CORS Issues**: Update CORS_ORIGIN in backend after getting frontend URL
- **Database Issues**: Check environment variables match your PostgreSQL service
- **Build Issues**: Ensure all dependencies are in package.json

## 📱 Share Your App

Once deployed, you can:
- Share the customer menu URL with customers
- Give admin access to restaurant staff
- Generate QR codes for tables
- Monitor orders and finances

---

**Total Time**: ~10 minutes
**Cost**: $0 (completely free!)
**Result**: Professional restaurant ordering system online! 🚀 