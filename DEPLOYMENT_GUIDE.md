# 🚀 Complete Deployment Guide - AgriFinAI

## 📋 Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas account (for production database)
- Git installed locally

---

## 🔧 Part 1: MongoDB Atlas Setup (Production Database)

### 1. Create MongoDB Atlas Account
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Create a free M0 cluster

### 2. Setup Database
1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select region closest to you
4. Cluster name: `AgriFinAI-Cluster`
5. Click **"Create"**

### 3. Database Access
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `agrifinai-user` (ya apna naam)
4. Password: Generate strong password (save it securely!)
5. Select **"Read and write to any database"**
6. Click **"Add User"**

### 4. Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 5. Get Connection String
1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` aur `<password>` with your credentials
5. Add database name: `/agrifin` before the `?`
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/agrifin?retryWrites=true&w=majority
   ```

---

## 📦 Part 2: Code Ko GitHub Pe Push Karna

### 1. Git Initialize (agar already nahi hai)
```powershell
cd "C:\Users\omkar\Desktop\New folder\AgriFinAI"

# Check if git is initialized
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit - AgriFinAI project"
```

### 2. GitHub Repository Banana
1. Go to: https://github.com/new
2. Repository name: `AgriFinAI` (ya koi bhi naam)
3. Keep it **Public** or **Private** (your choice)
4. **DO NOT** add README, .gitignore, or license (already hai)
5. Click **"Create repository"**

### 3. Push Code to GitHub
```powershell
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/AgriFinAI.git

# Check current branch
git branch

# Rename to main if needed
git branch -M main

# Push code
git push -u origin main
```

**Note**: Agar authentication error aaye:
1. GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select "repo" permissions
4. Use token as password when pushing

---

## 🌐 Part 3: Backend Deploy on Vercel

### 1. Import Backend Project
1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your **AgriFinAI** repository
4. **Root Directory**: Browse → Select `backend/my-express-mongodb-app`
5. **Framework Preset**: Other
6. Click **"Continue"**

### 2. Environment Variables Setup
Click **"Environment Variables"** aur add karo:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate strong secret (e.g., use: https://generate-secret.vercel.app/) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

### 3. Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Backend URL milega (e.g., `https://agrifin-backend.vercel.app`)
4. **Save this URL!**

---

## 🎨 Part 4: Frontend Deploy on Vercel

### 1. Import Frontend Project
1. Go to: https://vercel.com/new again
2. Click **"Import Git Repository"**
3. Select **same repository** (AgriFinAI)
4. **Root Directory**: Keep it at root (default)
5. **Framework Preset**: Next.js (auto-detected)
6. Click **"Continue"**

### 2. Environment Variables Setup
Click **"Environment Variables"** aur add karo:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | Your backend URL + `/api` (e.g., `https://agrifin-backend.vercel.app/api`) |
| `JWT_SECRET` | Same secret as backend JWT_SECRET (for authentication) |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | Your OpenWeather API key |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Gemini API key |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail App Password |

### 3. Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Frontend URL milega (e.g., `https://agrifin-ai.vercel.app`)

### 4. Update NEXTAUTH_URL
1. Go to Vercel Dashboard
2. Select your frontend project
3. Settings → Environment Variables
4. Edit `NEXTAUTH_URL` → Add your frontend URL
5. **Redeploy**: Deployments → Click three dots → Redeploy

---

## 🔒 Part 5: Security & Configuration

### 1. CORS Setup (Backend)
Backend code mein CORS configure karna hai:

File: `backend/my-express-mongodb-app/src/app.js`

```javascript
const cors = require('cors');

// Add your frontend URL
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://agrifin-ai.vercel.app',  // Your frontend URL
    'https://your-custom-domain.com'  // If you have custom domain
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### 2. API URL Update (Frontend)
Verify karo ki frontend correct backend URL use kar raha hai:

File: `lib/api.js` or wherever API calls are

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

### 3. Git Push Changes
```powershell
git add .
git commit -m "Add production configuration"
git push
```

Vercel automatically redeploy karega!

---

## ✅ Part 6: Testing & Verification

### 1. Test Backend
```powershell
# Test health endpoint
curl https://your-backend-url.vercel.app/api/health

# Or open in browser
```

### 2. Test Frontend
1. Open: `https://your-frontend-url.vercel.app`
2. Check all pages load correctly
3. Test authentication
4. Test API calls (products, farmers, loans)

### 3. Check Logs
**Backend Logs**:
- Vercel Dashboard → Backend Project → Deployments → Click latest → "Functions" tab

**Frontend Logs**:
- Vercel Dashboard → Frontend Project → Deployments → Click latest → "Functions" tab

---

## 🐛 Common Issues & Solutions

### Issue 1: API Calls Failing (CORS Error)
**Solution**: 
- Backend mein CORS configuration check karo
- Frontend URL ko backend ke CORS allowlist mein add karo

### Issue 2: MongoDB Connection Error
**Solution**:
- Connection string double-check karo
- IP whitelist mein `0.0.0.0/0` hai ya nahi
- Username/password correct hai

### Issue 3: Environment Variables Not Working
**Solution**:
- Vercel Dashboard → Settings → Environment Variables check karo
- Redeploy after changing variables
- Frontend variables mein `NEXT_PUBLIC_` prefix hai

### Issue 4: 404 on Backend Routes
**Solution**:
- `vercel.json` file check karo
- Routes properly configured hain

### Issue 5: Build Failing
**Solution**:
- Check Vercel build logs
- Dependencies sahi se install ho rahe hain
- Node version compatibility check karo

---

## 🎯 Part 7: Custom Domain (Optional)

### 1. Buy Domain (Namecheap, GoDaddy, etc.)

### 2. Add to Vercel
1. Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Follow Vercel's DNS configuration steps

### 3. Update Environment Variables
Update `NEXTAUTH_URL` and CORS origins with new domain

---

## 📊 Part 8: Monitoring & Analytics

### 1. Vercel Analytics
- Automatic monitoring
- Visit: Dashboard → Analytics tab

### 2. MongoDB Monitoring
- Atlas Dashboard → Metrics tab
- Check connection count, queries, performance

---

## 🔄 Future Updates

### Update Code:
```powershell
# Make changes
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically deploy! ✨

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## ✨ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string saved
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Vercel
- [ ] Backend environment variables set
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variables set
- [ ] CORS configured
- [ ] Both apps tested
- [ ] Custom domain added (optional)

---

**Congratulations! 🎉 Your AgriFinAI is now LIVE!**

Share your app: `https://your-app.vercel.app`
