# 🚀 MEAN Stack Application (Monorepo)

This repository contains a **full-stack MEAN (MongoDB, Express, Angular, Node.js)** application structured as a **monorepo**, with a single codebase for both frontend and backend.

The project demonstrates **real-world full-stack development**, including authentication, environment-based configuration, and cloud deployment.

---

## 🔗 Live Demo

### 🌐 Frontend (GitHub Pages)
https://jibin564.github.io/mean-project-mini-post-manager-/

### 🧠 Backend (Render)
https://mean-project-mini-post-manager.onrender.com

> ⚠️ Backend is hosted on Render free tier.  
> The **first request may take ~30 seconds** due to cold start.

---

## 📁 Project Structure

meanproject/
├── src/ → Angular frontend (standalone components)
├── backend/ → Node.js + Express backend logic
├── server.js → Backend entry point
├── angular.json → Angular configuration
├── tsconfig*.json → TypeScript configuration
├── package.json → Shared dependencies
├── .env (ignored) → Environment variables
└── README.md

---

## 🧩 Tech Stack

### Frontend
- Angular (Standalone Components)
- TypeScript
- Angular Material
- RxJS
- HTTP Client

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

### Deployment
- Frontend: **GitHub Pages**
- Backend: **Render**
- Database: **MongoDB Atlas**

---

## ✨ Features

- User authentication using JWT
- Create and fetch posts
- Protected backend routes
- RESTful API architecture
- Environment separation (development vs production)
- Secure secret handling (no secrets committed)
- Fully deployed frontend and backend

---

## 🛠️ Environment Configuration

Environment variables are handled securely using `.env` (local) and cloud environment variables (production).

### Local `.env` file (root)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

> `.env` is intentionally ignored via `.gitignore`.

### Angular Environment Handling
- Development: `environment.ts`
- Production: `environment.prod.ts`
- Environment switching happens **at build time** using Angular file replacements.

---

## 🧪 Run Locally

### Install dependencies
```bash
npm install

Run backend
nodemon server.js
Backend runs on:
http://localhost:3000

Run frontend
ng serve
Frontend runs on:
http://localhost:4200
