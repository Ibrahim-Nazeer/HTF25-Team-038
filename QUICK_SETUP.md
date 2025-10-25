# ⚡ QUICK SETUP GUIDE - CodeSync Interview

**Time to first demo: ~30 minutes**

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Supabase account (free tier works)
- [ ] Firebase project created
- [ ] Daily.co account (free tier: 10 rooms)

---

## 🚀 PART 1: Backend Setup (15 minutes)

### Step 1: Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Wait for database to provision (~2 minutes)
3. Go to **Settings** → **Database** → Copy connection string
4. Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]/postgres`

### Step 2: Firebase Setup (GitHub OAuth)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project → Enable Authentication
3. Enable **GitHub** provider:
   - Go to GitHub → Settings → Developer Settings → OAuth Apps
   - Create new OAuth App
   - Copy Client ID & Secret to Firebase
4. Copy Firebase config (Project Settings → General)

### Step 3: Daily.co Setup

1. Sign up at [daily.co](https://daily.co)
2. Get API key from Dashboard
3. Keep it handy for `.env` file

### Step 4: Install Server Dependencies

```bash
cd server
npm install
```

### Step 5: Configure Environment Variables

Create `/server/.env`:

```env
PORT=3001
DATABASE_URL="your_supabase_connection_string"
CLIENT_URL=http://localhost:5173
DAILY_API_KEY=your_daily_api_key
```

### Step 6: Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample problems
node scripts/seed.js
```

### Step 7: Start Server

```bash
npm run dev
```

✅ Server should be running on `http://localhost:3001`

---

## 🎨 PART 2: Frontend Setup (10 minutes)

### Step 1: Install Client Dependencies

```bash
cd ../client
npm install
```

### Step 2: Configure Environment Variables

Create `/client/.env`:

```env
VITE_API_URL=http://localhost:3001

# Firebase Config (from Step 2 above)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 3: Start Development Server

```bash
npm run dev
```

✅ Client should open automatically at `http://localhost:5173`

---

## ✨ PART 3: First Demo (5 minutes)

### Test the Application:

1. **Login**
   - Click "Continue with GitHub"
   - Authorize the app

2. **Create Session**
   - Click "Create New Session"
   - Title: "Test Interview"
   - Select a problem (e.g., "Two Sum")
   - Set timer: 30 minutes
   - Click "Create Session"

3. **Test Features**
   - **Code Editor**: Type some code → Should sync in real-time
   - **Timer**: Start/pause/reset (interviewer only)
   - **Chat**: Open chat panel → Send a message
   - **Whiteboard**: Switch to whiteboard tab → Draw something
   - **Video**: Switch to video tab → Enable camera/mic

4. **Invite Link**
   - Copy invite link from dashboard
   - Open in incognito/different browser
   - Join as candidate

---

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

### Database connection failed

- Verify Supabase connection string is correct
- Check if database is active in Supabase dashboard
- Ensure `?schema=public` is at the end of connection string

### Firebase auth not working

- Check if GitHub OAuth is enabled in Firebase
- Verify all Firebase config variables are set
- Add `localhost:5173` to authorized domains in Firebase Console

### Socket.IO not connecting

- Ensure server is running on port 3001
- Check CORS settings in `/server/index.js`
- Verify `VITE_API_URL` matches server URL

### Daily.co video issues

- Check browser permissions for camera/mic
- Verify Daily.co API key is valid
- Try different browser (Chrome recommended)

---

## 📦 Production Deployment

### Frontend (Vercel)

```bash
cd client
vercel --prod
```

Update environment variables in Vercel dashboard.

### Backend (Render)

1. Connect GitHub repository
2. Select `/server` as root directory
3. Build command: `npm install && npx prisma generate`
4. Start command: `node index.js`
5. Add all environment variables
6. Deploy!

### Update Environment Variables

After deployment:

**Client `.env`:**
```env
VITE_API_URL=https://your-api.onrender.com
```

**Server `.env`:**
```env
CLIENT_URL=https://your-app.vercel.app
```

---

## 🎯 Next Steps

Once everything is working:

1. **Customize**: Edit colors, timer defaults, starter code
2. **Add Problems**: POST to `/api/problems` endpoint
3. **Test Thoroughly**: Try all features end-to-end
4. **Deploy**: Follow production deployment steps
5. **Demo Prep**: Practice your 3-minute pitch!

---

## 💡 Pro Tips

- Use `npx prisma studio` to view/edit database
- Check browser console for Socket.IO connection logs
- Test with 2 different browsers for full experience
- Keep Firebase and Supabase dashboards open for debugging
- Use React DevTools for component inspection

---

## 📞 Need Help?

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` in correct directory |
| Port already in use | Change PORT in `.env` or kill process |
| Prisma errors | Run `npx prisma generate` again |
| Build fails | Clear `node_modules` and reinstall |
| Socket disconnects | Check network/firewall settings |

---

**You're all set! Happy coding! 🚀**