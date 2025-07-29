# 🚀 Free Deployment Guide - Restaurant QR Ordering System

This guide will help you deploy your restaurant ordering system online for free using Render.com and Vercel.

## 📋 Prerequisites

1. **GitHub Account** - To store your code
2. **Render.com Account** - For backend hosting
3. **Vercel Account** - For frontend hosting
4. **Git** - Installed on your computer

## 🔧 Step 1: Prepare Your Code

### 1.1 Create GitHub Repository

```bash
# Initialize git in your project folder
git init
git add .
git commit -m "Initial commit - Restaurant QR Ordering System"

# Create a new repository on GitHub and push your code
git remote add origin https://github.com/yourusername/restaurant-qr-ordering.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy Backend on Render.com

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" and select "Web Service"

### 2.2 Connect Your Repository
1. Connect your GitHub repository
2. Select the repository: `restaurant-qr-ordering`

### 2.3 Configure Backend Service
- **Name**: `restaurant-backend`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### 2.4 Set Environment Variables
Add these environment variables in Render:

```
DB_HOST=your-render-postgres-host
DB_PORT=5432
DB_NAME=restaurant_ordering
DB_USER=your-db-user
DB_PASSWORD=your-db-password
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 2.5 Create PostgreSQL Database
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name: `restaurant-db`
3. Plan: `Free`
4. Copy the connection details to your environment variables

### 2.6 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://restaurant-backend.onrender.com`)

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"

### 3.2 Import Repository
1. Import your GitHub repository
2. Select the repository: `restaurant-qr-ordering`

### 3.3 Configure Frontend
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Set Environment Variables
Add this environment variable in Vercel:

```
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
```

### 3.5 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL (e.g., `https://restaurant-qr-ordering.vercel.app`)

## 🔄 Step 4: Update Backend CORS

After getting your frontend URL, update the backend CORS environment variable:

1. Go to Render dashboard → Your backend service
2. Go to "Environment" tab
3. Update `CORS_ORIGIN` with your Vercel frontend URL
4. Redeploy the backend service

## 🗄️ Step 5: Setup Database

### 5.1 Connect to Database
1. In Render dashboard, go to your PostgreSQL database
2. Click "Connect" → "External Database"
3. Use a PostgreSQL client (like pgAdmin or DBeaver) to connect

### 5.2 Run Database Script
1. Connect to your database
2. Run the SQL script from `backend/database.sql`
3. Run the admin setup: `node setup-admin.js admin admin123`

## 🧪 Step 6: Test Your Deployment

### 6.1 Test Frontend
- Visit your Vercel URL
- Test customer menu: `https://your-frontend.vercel.app/menu/1`
- Test admin login: `https://your-frontend.vercel.app/admin/login`

### 6.2 Test Backend
- Test API health: `https://your-backend.onrender.com/health`
- Test menu endpoint: `https://your-backend.onrender.com/menu`

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure CORS_ORIGIN is set correctly
   - Check that frontend URL is exact match

2. **Database Connection**
   - Verify all database environment variables
   - Check if database is accessible

3. **Build Failures**
   - Check package.json dependencies
   - Verify Node.js version compatibility

4. **Environment Variables**
   - Ensure all variables are set correctly
   - Check for typos in variable names

## 📱 Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel project settings
2. Add custom domain
3. Configure DNS records

### Render Custom Domain
1. Go to Render service settings
2. Add custom domain
3. Configure DNS records

## 🔒 Security Notes

1. **JWT Secret**: Use a strong, random secret
2. **Database Password**: Use a strong password
3. **Environment Variables**: Never commit secrets to git
4. **HTTPS**: Both services provide HTTPS by default

## 📊 Monitoring

### Render Monitoring
- View logs in Render dashboard
- Monitor database usage
- Check service health

### Vercel Monitoring
- View deployment logs
- Monitor performance
- Check analytics

## 🎉 Success!

Your restaurant ordering system is now live online for free!

- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: Managed by Render PostgreSQL

## 🔄 Updates

To update your application:

1. **Make changes** to your code
2. **Commit and push** to GitHub
3. **Automatic deployment** will trigger
4. **Test** the new version

---

**Need Help?** Check the troubleshooting section or contact support for your hosting platform. 