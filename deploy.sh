#!/bin/bash

echo "🚀 Restaurant QR Ordering System - Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Restaurant QR Ordering System"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🌐 Please add your GitHub repository as remote origin:"
    echo "   git remote add origin https://github.com/yourusername/restaurant-qr-ordering.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
else
    echo "✅ Remote origin already configured"
    echo "📤 Pushing latest changes to GitHub..."
    git add .
    git commit -m "Update for deployment"
    git push
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🌐 Deploy Backend on Render.com:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to 'backend'"
echo "   - Configure environment variables"
echo ""
echo "2. 🗄️ Create PostgreSQL Database on Render:"
echo "   - Create new PostgreSQL service"
echo "   - Copy connection details to backend environment variables"
echo ""
echo "3. 🎨 Deploy Frontend on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Configure environment variables"
echo ""
echo "4. 🔄 Update CORS settings after getting URLs"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Good luck with your deployment!" 