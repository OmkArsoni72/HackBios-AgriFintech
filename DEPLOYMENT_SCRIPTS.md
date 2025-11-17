# Scripts for Environment Variables Setup

## Generate Strong Secrets
Visit: https://generate-secret.vercel.app/32

Or use PowerShell:
```powershell
# Generate random secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## Quick Commands for Vercel CLI (Optional)

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Login to Vercel
```powershell
vercel login
```

### Deploy Backend
```powershell
cd backend/my-express-mongodb-app
vercel --prod
```

### Deploy Frontend
```powershell
cd ../..
vercel --prod
```

### Add Environment Variable via CLI
```powershell
vercel env add MONGODB_URI production
# Then paste your MongoDB URI when prompted
```

---

## MongoDB Atlas Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority
```

**Replace:**
- `USERNAME`: Your MongoDB Atlas username
- `PASSWORD`: Your MongoDB Atlas password (URL encode special characters)
- `CLUSTER`: Your cluster name
- `DATABASE`: Your database name (e.g., `agrifin`)

**Example:**
```
mongodb+srv://agriuser:MyP@ss123@cluster0.abc123.mongodb.net/agrifin?retryWrites=true&w=majority
```

**Special Characters in Password:** URL encode them
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

---

## Environment Variables Summary

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
NEXTAUTH_SECRET=generate-random-32-char-secret
NEXTAUTH_URL=https://your-frontend-url.vercel.app
```

### Backend (Vercel)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agrifin?retryWrites=true&w=majority
JWT_SECRET=generate-another-random-32-char-secret
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## Testing Endpoints After Deployment

### Test Backend Health
```powershell
# PowerShell
Invoke-WebRequest -Uri "https://your-backend-url.vercel.app/health"

# Or open in browser
start https://your-backend-url.vercel.app/health
```

### Test API Endpoints
```powershell
# Test auth endpoint
Invoke-WebRequest -Uri "https://your-backend-url.vercel.app/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"test123"}'
```

---

## Git Commands Reference

### Initial Setup
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/AgriFinAI.git
git push -u origin main
```

### Regular Updates
```powershell
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Updated feature XYZ"

# Push to GitHub (triggers auto-deploy on Vercel)
git push
```

### View Remote URL
```powershell
git remote -v
```

### Change Remote URL
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/NEW_REPO.git
```

---

## Vercel Dashboard URLs

- **Main Dashboard**: https://vercel.com/dashboard
- **New Project**: https://vercel.com/new
- **Analytics**: https://vercel.com/dashboard/analytics
- **Settings**: https://vercel.com/dashboard/settings

---

## Useful Online Tools

1. **Secret Generator**: https://generate-secret.vercel.app/
2. **MongoDB Atlas**: https://cloud.mongodb.com/
3. **GitHub**: https://github.com/
4. **Vercel**: https://vercel.com/
5. **URL Encoder**: https://www.urlencoder.org/
6. **JWT Debugger**: https://jwt.io/
7. **JSON Formatter**: https://jsonformatter.org/

---

## Domain Setup (Optional)

### Buy Domain
- Namecheap: https://www.namecheap.com/
- GoDaddy: https://www.godaddy.com/
- Google Domains: https://domains.google/

### Add to Vercel
1. Vercel Dashboard → Your Project
2. Settings → Domains
3. Add Domain
4. Follow DNS configuration steps
5. Wait for DNS propagation (5-48 hours)

### Update Environment Variables
After domain is active:
- Update `NEXTAUTH_URL` to your custom domain
- Update `FRONTEND_URL` in backend
- Redeploy both projects

---

## Monitoring & Debugging

### View Logs
```powershell
# Using Vercel CLI
vercel logs YOUR_PROJECT_URL --follow
```

### Check Build Output
- Vercel Dashboard → Deployments → Click deployment → "Building" tab

### Check Function Logs
- Vercel Dashboard → Deployments → Click deployment → "Functions" tab

### MongoDB Atlas Logs
- Atlas Dashboard → Your Cluster → "Metrics" tab
- Check connection count, query execution time

---

## Cost Optimization

### Vercel Free Tier Limits
- 100 GB bandwidth/month
- Unlimited deployments
- 100 GB-hours serverless function execution

### MongoDB Atlas Free Tier
- 512 MB storage
- Shared RAM
- No backups
- Good for development/small projects

### Upgrade When Needed
- More traffic → Vercel Pro ($20/month)
- More data → MongoDB M10+ ($57/month)

---

## Security Best Practices

1. **Never commit `.env` files to Git**
2. **Use strong secrets** (32+ random characters)
3. **Enable 2FA** on GitHub, Vercel, MongoDB Atlas
4. **Rotate secrets** periodically (every 3-6 months)
5. **Monitor logs** for suspicious activity
6. **Restrict CORS** to specific domains in production
7. **Use HTTPS only** (Vercel provides free SSL)
8. **Validate inputs** on backend
9. **Rate limit** API endpoints
10. **Keep dependencies updated** (`npm audit fix`)

---

## Backup Strategy

### Code Backup
- GitHub (already backed up with each push)
- Keep local copy

### Database Backup
- MongoDB Atlas: Backup → Configure Cloud Backup (paid feature)
- Manual export: Atlas → Collections → Export Collection

### Manual Database Dump (Using mongodump)
```powershell
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/agrifin"
```

---

## Support & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Express.js Docs**: https://expressjs.com/
- **GitHub Docs**: https://docs.github.com/

---

**Save this file for future reference!** 📌
