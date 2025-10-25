# 🚀 CodeSync Interview

Real-time collaborative coding interview platform built for hackathons.

## ⚡ Quick Start (24-Hour Hackathon Build)

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- Firebase Project (for GitHub OAuth)
- Daily.co Account (for video)

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd codesync-interview

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

**Server (.env):**
```env
PORT=3001
DATABASE_URL="your_supabase_connection_string"
CLIENT_URL=http://localhost:5173
DAILY_API_KEY=your_daily_api_key
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Database Setup

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed  # Seed sample problems
```

### 4. Run Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

Visit: `http://localhost:5173`

---

## 🏗️ Project Structure

```
/codesync-interview
├── /client                 # React Frontend
│   ├── /src
│   │   ├── /components    # React components
│   │   ├── /pages         # Page components
│   │   ├── /context       # React Context providers
│   │   └── /lib           # Utilities & configs
│   └── package.json
│
├── /server                 # Node.js Backend
│   ├── /routes            # API routes
│   ├── /prisma            # Database schema
│   ├── index.js           # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🎯 Core Features

✅ **Real-time Code Editor** - Monaco with live sync  
✅ **Collaborative Whiteboard** - TLDraw integration  
✅ **Video Chat** - Daily.co HD video/audio  
✅ **Live Chat** - Socket.IO messaging  
✅ **Smart Timer** - Interviewer-controlled countdown  
✅ **GitHub OAuth** - Firebase authentication  
✅ **Problem Library** - Pre-seeded coding challenges  

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd client
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Render/Railway)

1. Connect GitHub repo
2. Set build command: `cd server && npm install && npx prisma generate`
3. Set start command: `node index.js`
4. Add environment variables

### Environment Variables for Production

Update `CLIENT_URL` and `VITE_API_URL` with deployed URLs.

---

## 📚 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Socket.IO
- **Database:** PostgreSQL (Supabase)
- **Auth:** Firebase (GitHub OAuth)
- **Video:** Daily.co
- **Editor:** Monaco Editor
- **Whiteboard:** TLDraw

---

## 🔧 Development Commands

### Server
```bash
npm run dev          # Start dev server with nodemon
npm run prisma:studio # Open Prisma Studio
npm run seed         # Seed database
```

### Client
```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

---

## 🐛 Troubleshooting

**Socket.IO not connecting:**
- Check `VITE_API_URL` matches server URL
- Verify CORS settings in server

**Firebase auth failing:**
- Ensure GitHub OAuth is configured in Firebase Console
- Add authorized domains in Firebase

**Daily.co video not working:**
- Verify Daily.co API key
- Check browser permissions for camera/mic
- Ensure room URL is generated correctly

**Database connection errors:**
- Verify Supabase connection string
- Run `npx prisma generate` after schema changes
- Check network access in Supabase settings

---

## 🎨 Customization

### Adding New Problems

```javascript
// POST /api/problems
{
  "title": "Problem Title",
  "description": "Problem description",
  "difficulty": "EASY|MEDIUM|HARD",
  "starterCode": "// Starter code template"
}
```

### Modifying Timer Defaults

Edit `Timer.jsx`:
```javascript
const [timeLeft, setTimeLeft] = useState(45 * 60); // Change 45 to desired minutes
```

### Styling

Tailwind CSS is configured. Edit `tailwind.config.js` for theme changes.

---

## 🏆 Demo Script (3 Minutes)

**Setup (30 seconds):**
1. Sign in with GitHub
2. Create new session "Senior Developer Interview"
3. Select problem: "Reverse Linked List"
4. Copy invite link

**Demo Flow (2 minutes):**
1. **Code Editor Tab**
   - Show real-time typing sync
   - Run code with output panel
   - Switch languages

2. **Whiteboard Tab**
   - Draw solution approach
   - Show collaborative drawing

3. **Video Tab**
   - Enable camera/mic
   - Toggle audio/video controls

4. **Chat & Timer**
   - Send messages
   - Start/pause/reset timer
   - Show 5-minute warning color change

**Closing (30 seconds):**
- Highlight key features
- Mention future improvements (code execution, session replay)

---

## 🔮 Future Enhancements

- [ ] Code execution via Piston API
- [ ] Session recording & playback
- [ ] Interview analytics dashboard
- [ ] AI-powered feedback
- [ ] Multi-language support
- [ ] Screen sharing
- [ ] Collaborative notes
- [ ] Calendar integration

---

## 📄 License

MIT License - Built for hackathons and learning

---

## 👥 Team

Built by CodePilot Team for 24-hour hackathon challenge

---

## 🆘 Support

For issues or questions:
- Open GitHub issue
- Check existing documentation
- Review environment variable setup

---

**Happy Hacking! 🚀**