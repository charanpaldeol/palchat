# 🚀 Deployment Information

## Domain & Hosting Configuration

### **Domain**
- **Primary Domain**: `palchat.org`
- **Alternative**: `www.palchat.org`

### **Frontend Deployment**
- **Platform**: Vercel
- **Framework**: Astro (SSR/Static)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Environment**: Production

### **Backend Deployment**
- **Platform**: Render
- **Framework**: FastAPI
- **Runtime**: Python 3.10+
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment**: Production

## Environment Variables

### **Frontend (Vercel)**
```env
# Backend API URL
BACKEND_API_URL=https://your-render-app.onrender.com

# Other frontend-specific variables
PUBLIC_SITE_URL=https://palchat.org
```

### **Backend (Render)**
```env
# Database
DATABASE_URL=sqlite:///./humane_stack.db

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://palchat.org,https://www.palchat.org

# App Configuration
APP_NAME=HumaneStack
APP_VERSION=1.0.0
```

## Deployment URLs

### **Production**
- **Frontend**: https://palchat.org
- **Backend API**: https://your-render-app.onrender.com
- **API Documentation**: https://your-render-app.onrender.com/docs

### **Development**
- **Frontend**: http://localhost:4321 (Astro dev server)
- **Backend**: http://localhost:8000 (FastAPI dev server)

## Important Notes

### **Domain Configuration**
- Domain is registered and managed through a domain registrar
- DNS is configured to point to Vercel for frontend
- Backend API is accessed via Render's provided URL

### **CORS Configuration**
- Backend CORS is configured to allow requests from `palchat.org`
- Frontend makes API calls to the Render backend URL

### **Database**
- Currently using SQLite for development
- For production, consider migrating to PostgreSQL on Render
- Database file: `humane_stack.db`

### **SSL/HTTPS**
- Vercel provides automatic SSL certificates
- Render provides automatic SSL certificates
- All production traffic is HTTPS

## Deployment Commands

### **Frontend (Vercel)**
```bash
# Deploy to Vercel
git push origin main  # Triggers automatic deployment

# Local development
npm run dev
npm run build
npm run preview
```

### **Backend (Render)**
```bash
# Deploy to Render
git push origin main  # Triggers automatic deployment

# Local development
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Monitoring & Logs

### **Vercel**
- Dashboard: https://vercel.com/dashboard
- Function logs available in Vercel dashboard
- Analytics and performance monitoring included

### **Render**
- Dashboard: https://dashboard.render.com
- Application logs available in Render dashboard
- Health checks and monitoring included

## Backup & Recovery

### **Database**
- SQLite database should be backed up regularly
- Consider automated backups for production data

### **Code**
- All code is version controlled in GitHub
- Automatic deployments from main branch
- Rollback capability through Git history

---

**Last Updated**: January 2024  
**Maintained By**: Development Team  
**Status**: Production Ready ✅ 