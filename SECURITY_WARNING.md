# 🔐 SECURITY WARNING - ACTION REQUIRED

## ⚠️ Exposed Secrets Detected

Your `.env` file with sensitive credentials was previously committed to the repository. The following secrets need to be **ROTATED IMMEDIATELY**:

### 🔑 Secrets That Need Rotation:

1. **Gemini API Key**: `AIzaSyD_ZdFsTRxV7_4ujKfxqmjgFVmpDxSXlpk`
   - Regenerate at: https://makersuite.google.com/app/apikey
   - Or: Google Cloud Console → APIs & Services → Credentials

2. **OpenWeather API Key**: `de9c78747e4c8541bdf85a851bb8af2d`
   - Regenerate at: https://home.openweathermap.org/api_keys

3. **Email Credentials**:
   - Email: `omkarsoni7277@gmail.com`
   - Password: `omkar@12345` (exposed!)
   - **CHANGE YOUR GMAIL PASSWORD IMMEDIATELY**
   - Use Google Account Security: https://myaccount.google.com/security
   - For apps, use App Passwords instead: https://myaccount.google.com/apppasswords

---

## ✅ Steps to Secure Your Deployment

### Step 1: Rotate All Exposed Credentials (NOW!)

```
□ Change Gmail password
□ Regenerate Gemini API key
□ Regenerate OpenWeather API key
□ Generate new JWT_SECRET (currently: e48287ee414c33752df93edf85ab1594)
```

### Step 2: Create Local `.env` File (DO NOT COMMIT!)

Create a new `.env` file in your project root with **NEW** credentials:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# JWT Secret (must match backend)
JWT_SECRET=[NEW 32-character random string]

# NEW API Keys (after rotation)
NEXT_PUBLIC_OPENWEATHER_API_KEY=[your new key]
NEXT_PUBLIC_GEMINI_API_KEY=[your new key]

# Email Configuration (use App Password!)
EMAIL_USER=omkarsoni7277@gmail.com
EMAIL_PASS=[your new app password]

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/agrifin
```

**Generate secrets**: https://generate-secret.vercel.app/32

### Step 3: Setup MongoDB Atlas (For Production)

1. Create free cluster: https://cloud.mongodb.com/
2. Create database user with strong password
3. Whitelist IP: `0.0.0.0/0` (all IPs)
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/agrifin?retryWrites=true&w=majority
   ```

### Step 4: Configure Vercel Environment Variables

#### For Backend Project (`backend/my-express-mongodb-app`):
```
MONGODB_URI = [MongoDB Atlas connection string]
JWT_SECRET = [32 random characters]
NODE_ENV = production
PORT = 5000
FRONTEND_URL = [Your frontend Vercel URL]
```

#### For Frontend Project (root):
```
NEXT_PUBLIC_API_URL = https://your-backend.vercel.app/api
JWT_SECRET = [32 random characters - same as backend]
NEXT_PUBLIC_OPENWEATHER_API_KEY = [new key]
NEXT_PUBLIC_GEMINI_API_KEY = [new key]
EMAIL_USER = omkarsoni7277@gmail.com
EMAIL_PASS = [your app password]
```

### Step 5: Deploy to Vercel

1. **Backend**: 
   - Root Directory: `backend/my-express-mongodb-app`
   - Add env vars
   - Deploy

2. **Frontend**:
   - Root Directory: `/` (default)
   - Add env vars
   - Deploy

3. **Update Cross-References**:
   - Add `FRONTEND_URL` to backend
   - Add `NEXTAUTH_URL` to frontend
   - Redeploy both

---

## 🔒 Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use `.env.example` as template (no real values)
3. ✅ Use strong, unique secrets (32+ characters)
4. ✅ Rotate credentials every 3-6 months
5. ✅ Use App Passwords for Gmail (not account password)
6. ✅ Enable 2FA on all accounts
7. ✅ Use environment variables in Vercel (not in code)
8. ✅ Review GitHub commits for accidental secret exposure

---

## 📞 Need Help?

See detailed guides:
- `DEPLOYMENT_GUIDE_HINDI.md` - Hindi mein complete guide
- `DEPLOYMENT_VISUAL_GUIDE.md` - Step-by-step English guide
- `DEPLOYMENT_QUICK_REFERENCE.md` - Quick reference card

---

**⚠️ IMPORTANT**: Complete Step 1 (rotate credentials) before deploying to production!

**Current Status**: `.env` file removed from repository. Safe to deploy after rotating secrets.
