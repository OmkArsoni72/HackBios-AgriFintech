## 🚀 Pre-Deployment Checklist

### ✅ Before Pushing to GitHub

- [ ] **MongoDB Atlas Setup Complete**
  - [ ] Cluster created and running
  - [ ] Database user created with password saved
  - [ ] Network access: 0.0.0.0/0 added
  - [ ] Connectiontring copied and saved

- [ ] **Environment Files Ready**
  - [ ] Frontend `.env.local` created with local values
  - [ ] Backend `.env` created with local values
  - [ ] Both `.env` files added to `.gitignore`
  - [ ] `.env.example` files created for reference

- [ ] **Code Testing**
  - [ ] Frontend runs successfully (`npm run dev`)
  - [ ] Backend runs successfully (`cd backend/my-express-mongodb-app && npm start`)
  - [ ] API calls working between frontend and backend
  - [ ] Database connection working locally

- [ ] **Git Setup**
  - [ ] Git initiali szed (`git init`)
  - [ ] All changes committed (`git add .` then `git commit`)
  - [ ] GitHub repository created
  - [ ] Remote added (`git remote add origin <url>`)

---

### ✅ GitHub Push

```powershell
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Ready for deployment - AgriFinAI"

# Push to GitHub
git push -u origin main
```

---

### ✅ Vercel Backend Deployment

- [ ] **Import Backend Project**
  - [ ] Repository selected
  - [ ] Root directory: `backend/my-express-mongodb-app`
  - [ ] Framework: Other

- [ ] **Environment Variables (Backend)**
  - [ ] `MONGODB_URI` = MongoDB Atlas connection string
  - [ ] `JWT_SECRET` = Generated strong secret
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `5000`
  - [ ] `FRONTEND_URL` = (leave empty for now, update after frontend deploy)

- [ ] **Deploy & Test**
  - [ ] Deployment successful
  - [ ] Backend URL saved (e.g., `https://agrifin-backend-xxx.vercel.app`)
  - [ ] Test: Open `https://your-backend-url.vercel.app/health`
  - [ ] Should see: `{"success": true, "message": "AgriFinAI Backend is running"}`

---

### ✅ Vercel Frontend Deployment

- [ ] **Import Frontend Project**
  - [ ] Same repository selected
  - [ ] Root directory: Keep at root (/)
  - [ ] Framework: Next.js (auto-detected)

- [ ] **Environment Variables (Frontend)**
  - [ ] `NEXT_PUBLIC_API_URL` = Backend URL + `/api` (e.g., `https://agrifin-backend-xxx.vercel.app/api`)
  - [ ] `NEXTAUTH_SECRET` = Generated strong secret
  - [ ] `NEXTAUTH_URL` = (leave empty for now, update after deploy)

- [ ] **Deploy & Get URL**
  - [ ] Deployment successful
  - [ ] Frontend URL saved (e.g., `https://agrifin-ai-xxx.vercel.app`)

---

### ✅ Post-Deployment Configuration

- [ ] **Update Frontend Environment**
  - [ ] Go to Vercel Dashboard → Frontend Project
  - [ ] Settings → Environment Variables
  - [ ] Update `NEXTAUTH_URL` with frontend URL
  - [ ] Save and redeploy

- [ ] **Update Backend Environment**
  - [ ] Go to Vercel Dashboard → Backend Project
  - [ ] Settings → Environment Variables
  - [ ] Update `FRONTEND_URL` with frontend URL
  - [ ] Save and redeploy

---

### ✅ Final Testing

- [ ] **Backend Tests**
  - [ ] Health endpoint working: `/health`
  - [ ] Auth endpoints working: `/api/auth/login`, `/api/auth/register`
  - [ ] Check Vercel logs for errors

- [ ] **Frontend Tests**
  - [ ] Homepage loads correctly
  - [ ] All pages accessible
  - [ ] Login/Register working
  - [ ] API calls successful (check browser console)
  - [ ] Images loading properly
  - [ ] No CORS errors

- [ ] **Database Tests**
  - [ ] Create test account
  - [ ] Login works
  - [ ] Data saves to MongoDB Atlas
  - [ ] Check Atlas dashboard for new data

---

### ✅ Monitor & Maintain

- [ ] **Vercel Dashboard**
  - [ ] Check Analytics tab
  - [ ] Monitor function usage
  - [ ] Review deployment logs

- [ ] **MongoDB Atlas**
  - [ ] Monitor connections
  - [ ] Check database size
  - [ ] Review query performance

- [ ] **Share Your App**
  - [ ] Frontend URL: `___________________________`
  - [ ] Backend URL: `___________________________`
  - [ ] Test all features before sharing

---

## 🎉 Success!

Your AgriFinAI app is now LIVE on the internet!

**Next Steps:**
1. Share with friends and get feedback
2. Monitor performance and errors
3. Fix bugs and add new features
4. Push updates (`git push` → auto-deploys!)

---

## 🆘 Need Help?

See **DEPLOYMENT_GUIDE.md** for detailed instructions.

Common Issues:
- CORS errors → Check `FRONTEND_URL` in backend env vars
- API not working → Check `NEXT_PUBLIC_API_URL` in frontend env vars
- Database connection → Verify MongoDB Atlas connection string
- Build failing → Check Vercel deployment logs
