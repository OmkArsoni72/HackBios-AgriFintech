# 🔐 Authentication Setup - Complete Guide

## ✅ Setup Complete!

**Login/Registration data ab MongoDB me store ho raha hai!**

---

## 🎯 What's New

### Backend Changes:
1. ✅ **User Model** created with password hashing (bcrypt)
2. ✅ **Auth Controller** with register/login/profile APIs
3. ✅ **JWT Authentication** for secure sessions
4. ✅ **Auth Middleware** for protected routes
5. ✅ **Auth Routes** mounted at `/api/auth`

### Frontend Changes:
1. ✅ **authAPI** service layer added in `lib/api.js`
2. ✅ **Login page** updated to use real backend API
3. ✅ **Token storage** in localStorage
4. ✅ **Auto-redirect** after successful login

---

## 📡 API Endpoints

### **Authentication APIs**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |
| PUT | `/api/auth/change-password` | Change password | ✅ |

---

## 🧪 Test Karo

### **1. Registration**

**Frontend:**
```
http://localhost:3001/login
```
- "Sign Up" tab click karo
- Form fill karo:
  - Name: Test User
  - Email: test@example.com
  - Password: test123 (min 6 characters)
  - Confirm Password: test123
- "Create Account" click karo

**API Test (Postman/Thunder Client):**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6581234...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "user",
      "createdAt": "2024-..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **2. Login**

**Frontend:**
```
http://localhost:3001/login
```
- Email aur Password enter karo
- "Sign In" click karo
- Success hone pe automatically `/dashboard` pe redirect hoga

**API Test:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6581234...",
      "name": "Test User",
      "email": "test@example.com",
      "role": "user",
      "lastLogin": "2024-..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **3. Get Profile (Protected Route)**

**API Test:**
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "6581234...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "lastLogin": "2024-...",
    "createdAt": "2024-..."
  }
}
```

---

## 💾 MongoDB Collections

### **Users Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  role: String (enum: 'user', 'farmer', 'admin'),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**MongoDB Compass me dekho:**
- Database: `agrifinai`
- Collection: `users`

---

## 🔒 Password Security

✅ **Bcrypt hashing** - Passwords plain text me store nahi hote  
✅ **Salt rounds: 10** - Strong encryption  
✅ **Min length: 6 characters** - Validation on both sides  
✅ **Password field excluded** - Default queries me password nahi aata  

---

## 🎫 JWT Token

- **Expiry:** 7 days
- **Algorithm:** HS256
- **Stored in:** localStorage (`agrifinai_token`)
- **Usage:** All protected API calls include `Authorization: Bearer <token>`

---

## 📱 Frontend Usage

### **Register User:**
```javascript
import { authAPI } from '@/lib/api';

const response = await authAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "secure123"
});

// Store token
localStorage.setItem('agrifinai_token', response.data.token);
localStorage.setItem('agrifinai_user', JSON.stringify(response.data.user));
```

### **Login User:**
```javascript
const response = await authAPI.login({
  email: "john@example.com",
  password: "secure123"
});

// Store token
localStorage.setItem('agrifinai_token', response.data.token);
localStorage.setItem('agrifinai_user', JSON.stringify(response.data.user));
```

### **Get Profile:**
```javascript
const profile = await authAPI.getProfile();
console.log(profile.data); // User data
```

### **Logout:**
```javascript
authAPI.logout(); // Clears token and user data
router.push('/login');
```

---

## 🔐 Protected Routes (Backend)

Agar kisi route ko protect karna ho:

```javascript
const { protect } = require('../middleware/auth');

// Protected route
router.get('/protected', protect, (req, res) => {
  // req.user me current user ka data milega
  res.json({
    message: 'Protected data',
    user: req.user
  });
});
```

---

## 🛡️ Role-based Access

```javascript
const { protect, authorize } = require('../middleware/auth');

// Only admins can access
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Farmers and admins can access
router.post('/crops', protect, authorize('farmer', 'admin'), createCrop);
```

---

## ⚙️ Environment Variables

**Backend (`.env`):**
```env
JWT_SECRET=agrifinai_secret_key_change_in_production_2024
```

⚠️ **IMPORTANT:** Production me strong secret key use karo!

---

## 🐛 Common Issues

### **"Invalid or expired token"**
- Token expire ho gaya (7 days ke baad)
- User logout karo aur phir se login karo

### **"User with this email already exists"**
- Email already registered hai
- Login try karo ya different email use karo

### **"Invalid email or password"**
- Credentials galat hain
- Check karo email/password correct hai

### **CORS error**
- Backend me CORS already enabled hai
- Check karo backend running hai: http://localhost:5000/health

---

## ✨ Features

✅ **Secure password storage** with bcrypt  
✅ **JWT authentication** with 7-day expiry  
✅ **Protected routes** with middleware  
✅ **Role-based access control**  
✅ **Email uniqueness** validation  
✅ **Password strength** validation  
✅ **Last login tracking**  
✅ **User profile management**  
✅ **Password change** functionality  

---

## 🎯 Testing Flow

1. ✅ **Register** new user: http://localhost:3001/login
2. ✅ **Check MongoDB**: Database → `agrifinai` → Collection → `users`
3. ✅ **Login** with same credentials
4. ✅ **Check localStorage**: `agrifinai_token` aur `agrifinai_user` hona chahiye
5. ✅ **Navigate to dashboard**: Automatically redirect hoga
6. ✅ **Test protected API**: Profile endpoint call karo

---

## 📞 Support

**Backend running?**
```
http://localhost:5000/health
```

**Frontend running?**
```
http://localhost:3001/login
```

**MongoDB running?**
```powershell
net start MongoDB
```

---

**🎉 Login/Registration successfully MongoDB me store ho raha hai!**
