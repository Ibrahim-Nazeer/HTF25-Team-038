# 🚀 Deployment Guide - Vercel + Railway

## 📋 Prerequisites

- ✅ Vercel Account (connected to GitHub)
- ✅ Railway Account (connected to GitHub)
- ✅ GitHub Repository: `HTF25-Team-038`

---

## 🎯 Deployment URLs

- **Frontend (Vercel)**: https://htf-25-team-038.vercel.app
- **Backend (Railway)**: https://htf25-team-038-production.up.railway.app
  - ⚠️ **Note**: `htf25-team-038.railway.internal` is the internal URL
  - You need the **public domain** from Railway dashboard

---

## 📁 Files Updated for Deployment

### ✅ Frontend Files
1. `client/.env` - Updated VITE_API_URL
2. `client/.env.production` - Created for production builds
3. `client/vercel.json` - Already configured

### ✅ Backend Files
1. `server/index.js` - Updated CORS to allow Vercel domain
2. `server/railway.json` - Created Railway configuration
3. `server/.env` - Need to configure in Railway dashboard

---

## 🔧 Step-by-Step Deployment

### Part 1: Deploy Backend to Railway

#### 1. **Get Your Public Railway URL**

Go to Railway dashboard → Your project → Settings → Domains

You should see something like:
- `htf25-team-038-production.up.railway.app` (Public URL)
- `htf25-team-038.railway.internal` (Internal only - DON'T use this!)

If you don't see a public domain:
1. Click "Generate Domain" button
2. Copy the generated URL (e.g., `yourapp-production.up.railway.app`)

#### 2. **Set Environment Variables in Railway**

Go to Railway dashboard → Your service → Variables

Add these variables:

```env
NODE_ENV=production
PORT=3001

DATABASE_URL=postgresql://postgres:qwerty@db.eqolzmwmvmvuuzjvvlld.supabase.co:5432/postgres

CLIENT_URL=https://htf-25-team-038.vercel.app

DAILY_API_KEY=27c24776e4f53ec600f923c202199f52d3aeb91ccc6bacb5ece460e51714d2e8
```

#### 3. **Deploy Backend**

```bash
cd server
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

Railway will automatically deploy when you push to GitHub!

#### 4. **Verify Backend is Running**

Visit: `https://your-railway-url.up.railway.app/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T..."
}
```

---

### Part 2: Deploy Frontend to Vercel

#### 1. **Update Environment Variables**

⚠️ **IMPORTANT**: Replace `https://htf25-team-038-production.up.railway.app` with YOUR actual Railway public URL!

In `client/.env.production`:
```env
VITE_API_URL=https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app
```

#### 2. **Configure Vercel Environment Variables**

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables (for **Production**, **Preview**, and **Development**):

```
VITE_API_URL=https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app
VITE_FIREBASE_API_KEY=AIzaSyA-Dt4nJQfLbF3RwGi8uThrzBRNSDKNDAA
VITE_FIREBASE_AUTH_DOMAIN=codesync-ea189.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=codesync-ea189
VITE_FIREBASE_STORAGE_BUCKET=codesync-ea189.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=979843848091
VITE_FIREBASE_APP_ID=1:979843848091:web:1fea4534a44a8c0bd7733e
```

#### 3. **Deploy Frontend**

```bash
cd client
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

Vercel will automatically deploy when you push!

#### 4. **Trigger Redeploy (if needed)**

If Vercel doesn't auto-deploy:
- Go to Vercel Dashboard → Your Project → Deployments
- Click "Redeploy" on the latest deployment

---

## ✅ Post-Deployment Checklist

### 1. **Test Backend Health**
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"..."}
```

### 2. **Test Frontend**

Visit: https://htf-25-team-038.vercel.app

Check browser console (F12):
- ✅ Should see: `Socket connected: abc123`
- ❌ If you see CORS errors → Backend CORS not configured correctly
- ❌ If you see connection errors → Check Railway URL in .env

### 3. **Test API Connection**

Open browser console and run:
```javascript
fetch('https://YOUR-RAILWAY-URL.up.railway.app/api/problems')
  .then(r => r.json())
  .then(console.log)
```

Should return array of problems.

### 4. **Test Socket.IO Connection**

In browser console, check for:
```
✅ Socket connected: abc123
📡 Socket.IO ready for connections
```

### 5. **Test Full Flow**

1. ✅ Login/Signup works
2. ✅ Create interview session
3. ✅ Join session in another tab/browser
4. ✅ Code editor syncs in real-time
5. ✅ Whiteboard syncs in real-time
6. ✅ Problem library loads
7. ✅ Code execution works
8. ✅ Test cases run

---

## 🐛 Troubleshooting

### Issue 1: CORS Errors

**Error in console:**
```
Access to fetch at 'https://...' from origin 'https://htf-25-team-038.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Check `server/index.js` includes your Vercel URL in CORS origins
2. Verify environment variable `CLIENT_URL` in Railway is set correctly
3. Redeploy backend after changes

### Issue 2: Socket.IO Not Connecting

**Error in console:**
```
WebSocket connection failed
```

**Solution:**
1. Verify Railway public URL is correct (not `.railway.internal`)
2. Check VITE_API_URL in Vercel environment variables
3. Ensure Railway service is running (not sleeping)

### Issue 3: Database Connection Issues

**Error:**
```
Can't reach database server
```

**Solution:**
1. Check DATABASE_URL in Railway environment variables
2. Verify Supabase database is running
3. Check Prisma schema is generated: `npx prisma generate`

### Issue 4: Railway App Sleeping

Railway apps sleep after inactivity on free tier.

**Solution:**
1. Upgrade to Hobby plan ($5/month)
2. OR use a service like UptimeRobot to ping every 5 minutes
3. Visit `/health` endpoint periodically

### Issue 5: Environment Variables Not Loaded

**Symptom:** App uses localhost URLs in production

**Solution:**
1. Vercel: Check Environment Variables are set for "Production"
2. Railway: Check variables are in the correct service
3. Trigger a full redeploy (not just restart)

---

## 🔄 Making Updates After Deployment

### Update Frontend
```bash
cd client
# Make your changes
git add .
git commit -m "Update: your changes"
git push origin main
# Vercel auto-deploys
```

### Update Backend
```bash
cd server
# Make your changes
git add .
git commit -m "Update: your changes"
git push origin main
# Railway auto-deploys
```

### Update Environment Variables

**Vercel:**
1. Dashboard → Project → Settings → Environment Variables
2. Edit variable
3. Redeploy required

**Railway:**
1. Dashboard → Service → Variables
2. Edit variable
3. Auto-restarts service

---

## 📊 Monitoring & Logs

### Railway Logs
```
Dashboard → Service → Deployments → View Logs
```

Look for:
- ✅ `Server running on port 3001`
- ✅ `Socket.IO ready for connections`
- ❌ Any error messages

### Vercel Logs
```
Dashboard → Project → Deployments → View Function Logs
```

### Browser Console
Press F12 → Console tab

Look for:
- ✅ `Socket connected: ...`
- ✅ Successful API requests
- ❌ CORS errors
- ❌ 404 errors

---

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode URLs in code
2. **Test Locally First**: Use `npm run dev` before deploying
3. **Check Logs**: Always check deployment logs for errors
4. **Database Migrations**: Run `npx prisma migrate deploy` after schema changes
5. **HTTPS Only**: Always use HTTPS in production
6. **Monitor Uptime**: Use UptimeRobot or similar for free tier Railway

---

## 🎯 Quick Reference

### URLs to Update

| Location | Variable | Value |
|----------|----------|-------|
| Vercel Env Vars | `VITE_API_URL` | Railway public URL |
| Railway Env Vars | `CLIENT_URL` | Vercel URL |
| `server/index.js` | CORS origins | Add Vercel URL |

### Commands

```bash
# Check Railway URL is correct
curl https://your-railway-url/health

# Test from browser
fetch('https://your-railway-url/api/problems').then(r=>r.json()).then(console.log)

# View logs
railway logs  # If using Railway CLI
```

---

## ✅ Final Checklist Before Going Live

- [ ] Railway public URL obtained (not `.railway.internal`)
- [ ] Updated `client/.env.production` with Railway URL
- [ ] Set all Vercel environment variables
- [ ] Set all Railway environment variables
- [ ] Updated CORS in `server/index.js` with Vercel URL
- [ ] Pushed all changes to GitHub
- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Socket.IO connects successfully
- [ ] Can create and join sessions
- [ ] Real-time sync works
- [ ] Code execution works
- [ ] Test full user flow

---

**Your app is ready to deploy! 🚀**

If you encounter issues, check the Troubleshooting section or open the browser console for detailed error messages.
