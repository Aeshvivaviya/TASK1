# 🚀 Smart Career Portal

A full-stack AI-powered career portal that accepts candidate applications, analyzes profiles using OpenAI, generates personalized technical tasks, and delivers them via email.

## ✨ Features

- **Smart Application Form** — Responsive form with real-time validation
- **AI Task Generation** — OpenAI GPT analyzes skills and generates personalized tasks
- **Automated Email** — Beautiful HTML emails sent via Nodemailer
- **Admin Dashboard** — View all candidates, tasks, and update statuses
- **Modern UI** — Dark theme with Tailwind CSS, animations, and responsive design

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-3.5-turbo |
| Email | Nodemailer (SMTP) |

## 📁 Project Structure

```
career-portal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CareerForm.jsx
│   │   │   ├── SkillsInput.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ApplyPage.jsx
│   │   │   ├── SuccessPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── applicationController.js
│   │   └── adminController.js
│   ├── models/
│   │   └── Candidate.js
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── emailService.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Gmail account (for email sending)

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

```bash
# In the backend folder, create .env from the example
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career_portal

# Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-key-here

# Gmail SMTP settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password   # See note below
EMAIL_FROM=Career Portal <your_gmail@gmail.com>

FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate a password for "Mail". Use that 16-character password as `EMAIL_PASS`.

---

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/apply` | Submit application |
| `GET` | `/api/admin/candidates` | List all candidates |
| `GET` | `/api/admin/candidates/:id` | Get single candidate |
| `PATCH` | `/api/admin/candidates/:id/status` | Update status |
| `GET` | `/api/admin/stats` | Dashboard statistics |
| `GET` | `/api/health` | Health check |

---

## 🔄 Application Flow

```
User fills form
     ↓
POST /api/apply
     ↓
Validate data
     ↓
Save to MongoDB
     ↓
OpenAI generates task
     ↓
Update candidate with task
     ↓
Send HTML email via Nodemailer
     ↓
Return success response
     ↓
Frontend shows success page
```

---

## 🚀 Deployment

### Backend (Railway / Render)
1. Push backend to GitHub
2. Connect to Railway or Render
3. Add environment variables in dashboard
4. Deploy

### Frontend (Vercel / Netlify)
1. Push frontend to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy

---

## 🔧 Troubleshooting

**MongoDB connection fails:**
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas connection string

**Email not sending:**
- Verify Gmail App Password (not your regular password)
- Enable 2FA on your Google account first
- Check spam folder

**OpenAI errors:**
- Verify your API key is valid and has credits
- The app has a fallback task generator if AI fails

**CORS errors:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
