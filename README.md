# HireHub

**Find talent. Find opportunity. Build what’s next.**

A full-stack recruitment platform for **job seekers**, **employers**, and **admins**.  
Ek complete hiring app: jobs browse karo, apply karo, company chalao, aur platform moderate karo.

[English](#english) · [Roman Urdu](#roman-urdu)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)

---

## Table of contents

- [English](#english)
  - [What it is](#what-it-is)
  - [Features](#features)
  - [Tech stack](#tech-stack)
  - [Project structure](#project-structure)
  - [Setup](#setup)
  - [Environment](#environment)
  - [Seed accounts](#seed-accounts)
  - [Auth and OTP](#auth-and-otp)
  - [AI assistant](#ai-assistant)
  - [Scripts](#scripts)
- [Roman Urdu](#roman-urdu)

---

# English

## What it is

HireHub is a job marketplace with three roles:

| Role | Dashboard | What they do |
| --- | --- | --- |
| **Job seeker** | `/dashboard` | Browse jobs and companies, apply, save jobs, manage resume and profile |
| **Employer** | `/employer` | Create a company, post jobs, review applicants |
| **Admin** | `/admin` | Moderate users, jobs, companies, and applications |

Public pages: Home, Jobs, Companies, About, For employers, Login, Register.

## Features

- Email + password auth with JWT httpOnly cookies
- Email OTP on register, unverified login, change email, change password, and delete account
- Job listings with filters, company pages, applications, saved jobs
- Resume uploads (Cloudinary), multiple resumes, active resume
- Employer job create/edit and applicant pipeline
- Admin tables with search, status, drawers, and delete
- Dark / light theme
- HireHub assistant (bottom-right chatbot) — answers only about this product
- Local Ollama URL + model in Settings
- AI job-description draft and cover-letter draft

## Tech stack

**Frontend** (`frontend/`)

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4, Motion, Lucide
- React Hook Form + Zod

**Backend** (`backend/`)

- Express 5, MongoDB / Mongoose 9
- JWT cookies, Zod validation, rate limits
- Cloudinary uploads, Nodemailer (OTP / reset mail)
- Optional OpenAI or Ollama for AI

## Project structure

```text
JPW/
├── backend/          # Express API  →  http://localhost:5000
├── frontend/         # Next.js app  →  http://localhost:3000
├── README.md
└── .gitignore
```

## Setup

You need Node.js 20+, MongoDB (local or Atlas), and two terminals.

### 1. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

- API: http://localhost:5000
- Health: http://localhost:5000/api/health

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App: http://localhost:3000

Copy `.env.example` only. Never commit `backend/.env` or `frontend/.env.local`.

## Environment

Important keys in `backend/.env`:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` or `MONGODB_URI` | Database |
| `JWT_SECRET` | Auth cookies |
| `CLIENT_URL` | Frontend origin for CORS (`http://localhost:3000`) |
| `CLOUDINARY_*` | Avatar, resume, and logo uploads |
| `SMTP_*` | Email (OTP + password reset). If SMTP is missing, mail is logged in the terminal |
| `OLLAMA_BASE_URL` / `OLLAMA_MODEL` | Server-side Ollama (optional) |
| `OPENAI_API_KEY` | Server-side OpenAI (optional) |

## Seed accounts

After `npm run seed` in `backend/`:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hirehub.dev` | `Admin1234!` |
| Employer | `employer@hirehub.dev` | `Employer1234!` |
| Job seeker | `seeker@hirehub.dev` | `Seeker1234!` |

These accounts are already email-verified. New signups must enter a 6-digit OTP.

## Auth and OTP

- **Register** → OTP to email → verify at `/verify-otp` → then you are logged in
- **Login** with an unverified email → OTP screen again (no session until verified)
- **Change email** → OTP goes to the **new** address; email updates only after verify
- **Change password** → OTP to current email
- **Delete account** → password + OTP, then the account and related data are removed
- Codes expire in **10 minutes**. Resend wait is **60 seconds**
- **Forgot password** still uses a 15-minute **link**, not OTP

## AI assistant

A chat icon sits at the **bottom right** on every page. It only answers HireHub questions (apply, post a job, OTP, dashboards).

If AI is not connected and you send a message, it replies:

> AI is not connected. Please connect AI?

**Local Ollama (recommended on your PC)**

1. Install and start [Ollama](https://ollama.com)
2. Pull a model, e.g. `ollama pull qwen3:4b`
3. Keep it running (`ollama serve`)
4. In **Settings → Local Ollama**, save:
   - URL: `http://127.0.0.1:11434` (use `127.0.0.1`, not `localhost`, on Windows)
   - Model: `qwen3:4b`
5. Click **Test connection**, then **Save**

You can also set `OPENAI_API_KEY` or server `OLLAMA_*` in `backend/.env`.

Employers can **Draft with AI** on the job form. Job seekers can draft a cover letter on a job page.

## Scripts

**Backend**

| Command | What it does |
| --- | --- |
| `npm run dev` | API with file watch |
| `npm start` | Production API |
| `npm run seed` | Reset demo users, jobs, company, application |

**Frontend**

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the build |

---

# Roman Urdu

## Ye project kya hai

HireHub ek **recruitment platform** hai. Teen roles hain:

| Role | Dashboard | Kaam |
| --- | --- | --- |
| **Job seeker** | `/dashboard` | Jobs / companies dekho, apply karo, jobs save karo, resume aur profile sambhalo |
| **Employer** | `/employer` | Company banao, job post karo, applicants dekho |
| **Admin** | `/admin` | Users, jobs, companies, applications moderate karo |

Public pages: Home, Jobs, Companies, About, For employers, Login, Register.

## Features

- Login cookies se (JWT), password hash ke sath
- **OTP** register, unverified login, email change, password change, account delete par
- Jobs, companies, applications, saved jobs
- Resume Cloudinary par upload; kai resumes, ek active
- Employer job form + applicants
- Admin tables, search, drawers, delete
- Dark / light theme
- **Chatbot** bottom-right — sirf HireHub ke sawal
- Settings mein **Ollama URL + model**
- AI se job description aur cover letter draft

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind v4 — folder `frontend/`
- **Backend:** Express 5, MongoDB — folder `backend/`
- **Uploads:** Cloudinary
- **Email:** SMTP (warna OTP terminal mein log hota hai)
- **AI:** Ollama local ya OpenAI

## Setup kaise karein

Node 20+ aur MongoDB chahiye. Do terminals kholo.

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
```

`frontend/.env.local` banao:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App: `http://localhost:3000`

**Zaroori:** `backend/.env` aur `frontend/.env.local` GitHub par mat bhejna. Secrets wahan hote hain.

## Seed accounts (demo login)

`backend` mein `npm run seed` ke baad:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hirehub.dev` | `Admin1234!` |
| Employer | `employer@hirehub.dev` | `Employer1234!` |
| Job seeker | `seeker@hirehub.dev` | `Seeker1234!` |

Ye teen accounts **verified** hain. Naya register OTP maangta hai.

## OTP samajh lo

- Register ke baad email par 6-digit code aata hai — verify ke baghair login nahi
- Email change: OTP **nayi email** par; verify ke baad hi email badalti hai
- Password change: OTP current email par
- Delete account: password + OTP, phir pura account khatam
- Code **10 minute** valid, resend **60 second** baad
- Forgot password **link** hai (15 minute), OTP nahi

## AI / chatbot

Har page ke **bottom-right** pe bot icon hai. Sirf is project ke baare mein jawab dega (apply, job post, OTP, dashboard).

AI connected na ho aur message bhejo to reply:

> AI is not connected. Please connect AI?

**Apne PC par Ollama**

1. [Ollama](https://ollama.com) install + chalu karo
2. Model lao: `ollama pull qwen3:4b`
3. `ollama serve` chalta rahe
4. Settings → **Local Ollama**:
   - URL: `http://127.0.0.1:11434` (Windows par `localhost` ki jagah `127.0.0.1`)
   - Model: `qwen3:4b`
5. **Test connection**, phir **Save**

Agar Ollama band ho to error aayega — pehle Ollama on karo, phir test.

## Commands

| Jagah | Command | Matlab |
| --- | --- | --- |
| backend | `npm run dev` | API chalu |
| backend | `npm run seed` | Demo data dubara daalna |
| frontend | `npm run dev` | Website chalu |
| frontend | `npm run build` | Production build |

---

Single GitHub repo: **backend + frontend** together.
