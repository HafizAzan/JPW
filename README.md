# HireHub

**Find talent. Find opportunity. Build whats next.**

A full-stack recruitment platform for **job seekers**, **employers**, and **admins**.  
Ek complete hiring app: jobs browse karo, apply karo, company chalao, aur platform moderate karo.

[English](#english) � [Roman Urdu](#roman-urdu)

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
  - [Auth & OTP](#auth--otp)
  - [AI assistant](#ai-assistant)
  - [Scripts](#scripts)
- [Roman Urdu](#roman-urdu)

---

# English

## What it is

HireHub is a job marketplace with three roles:

| Role | Dashboard | What they do |
| --- | --- | --- |
| **Job seeker** | `/dashboard` | Browse jobs & companies, apply, save jobs, manage resume & profile |
| **Employer** | `/employer` | Create a company, post jobs, review applicants |
| **Admin** | `/admin` | Moderate users, jobs, companies, and applications |

Public pages include Home, Jobs, Companies, About, For employers, Login, and Register.

## Features

- Email + password auth with **JWT httpOnly cookies**
- **Email OTP** on register, unverified login, change email, change password, and delete account
- Job listings with filters, company pages, applications, saved jobs
- Resume uploads (Cloudinary), multiple resumes, active resume
- Employer job create/edit, applicant pipeline
- Admin tables with search, status, drawers, and delete
- Dark / light theme
- **HireHub assistant** (bottom-right chatbot)  answers only about this product
- **Local Ollama** URL + model in Settings (works from your machine)
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
- Optional OpenAI or **Ollama** for AI

## Project structure

```text
JPW/

