# 🚀 Quick Deployment Reference

## ⚠️ IMPORTANT: Get Your Railway Public URL First!

Railway gives you TWO URLs:
- ❌ `htf25-team-038.railway.internal` - **Internal only, DON'T use!**
- ✅ `htf25-team-038-production.up.railway.app` - **Public URL, use this!**

**How to get it:**
Railway Dashboard → Your Service → Settings → Domains → Generate Domain

---

## 📝 Places to Update URLs

### 1. Frontend Environment Variables (Vercel)

**Vercel Dashboard → Settings → Environment Variables**

Add for **Production, Preview, and Development**:

```
VITE_API_URL = https://YOUR-RAILWAY-PUBLIC-URL.up.railway.app
```

Replace `YOUR-RAILWAY-PUBLIC-URL` with your actual Railway public domain!

---

### 2. Backend Environment Variables (Railway)

**Railway Dashboard → Variables**

```
CLIENT_URL = https://htf-25-team-038.vercel.app
```

---

### 3. Files Already Updated

✅ `client/.env` - Local development
✅ `client/.env.production` - Production builds  
✅ `server/index.js` - CORS configuration
✅ `server/railway.json` - Railway config

---

## 🎯 Quick Deploy Steps

### Deploy Backend (Railway)
1. Get Railway public URL from dashboard
2. Set environment variables in Railway
3. Push to GitHub → Auto-deploys!
4. Test: `https://your-railway-url/health`

### Deploy Frontend (Vercel)  
1. Update Vercel environment variables with Railway URL
2. Push to GitHub → Auto-deploys!
3. Test: `https://htf-25-team-038.vercel.app`

---

## ✅ Quick Test

Open browser console at your Vercel URL and run:

```javascript
// Test API connection
fetch('https://YOUR-RAILWAY-URL/api/problems')
  .then(r => r.json())
  .then(data => console.log('✅ API works:', data.length, 'problems'))
  .catch(err => console.error('❌ API failed:', err));
```

Look for:
- ✅ `Socket connected: abc123`
- ✅ `API works: 40 problems`

---

## 🐛 Common Issues

### "CORS error"
→ Check `server/index.js` has Vercel URL in CORS origins  
→ Redeploy backend

### "Socket.IO not connecting"  
→ Check VITE_API_URL in Vercel env vars
→ Make sure using Railway **public** URL (not `.railway.internal`)

### "Can't reach database"
→ Check DATABASE_URL in Railway env vars

---

## 📞 Need Help?

See full guide: `DEPLOYMENT_GUIDE.md`
