# 🌌 Aura Engine: Premium Meta-Application Engine

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://aura-engine-frontend.vercel.app/)
[![Backend](https://img.shields.io/badge/backend-Render-blue)](https://my-backend-jlcm.onrender.com/health)

Aura Engine is a high-performance, enterprise-grade **Meta-Application Generator**. It translates structured JSON configurations into a fully functional, premium web application with real-time analytics, dynamic data management, and secure authentication.

---

## 🔗 Live Deployment
*   **Frontend**: [aura-engine-frontend.vercel.app](https://aura-engine-frontend.vercel.app/)
*   **Backend API**: [my-backend-jlcm.onrender.com](https://my-backend-jlcm.onrender.com/api/config)

---

## ✨ Premium Features

-   **⚡ Dynamic Core**: Interprets JSON schemas to instantly generate complex Forms, Tables, and Dashboard Analytics.
-   **🎨 Aesthetic Excellence**: Modern, high-end UI featuring:
    *   **Glassmorphism** and smooth **Framer Motion** transitions.
    *   **Dark & Light Mode** support with smooth color transitions.
    *   Professional Isometric Iconography.
-   **📊 Data Intelligence**:
    *   **Dashboard View**: Real-time KPI cards and data distribution analysis.
    *   **Advanced Export**: Robust PDF and Excel generation with professional table formatting.
    *   **Import System**: Dynamic CSV/JSON importer with intelligent column mapping.
-   **🔐 Secure User Management**:
    *   JWT-based authentication with high-security bcrypt password hashing.
    *   Modern **Profile Management** with secure logout and user context.
-   **🚀 Production Ready**: Pre-configured for **Vercel** (Frontend) and **Render** (Backend) with **PostgreSQL** persistence.

---

## 🛠 Tech Stack

### **Frontend**
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS 4 (Vanilla CSS utility-first)
-   **State Management**: TanStack Query (React Query)
-   **Animations**: Framer Motion
-   **Icons**: Lucide React

### **Backend**
-   **Runtime**: Node.js & TypeScript
-   **Framework**: Express.js
-   **ORM**: Prisma ORM
-   **Database**: 
    *   **Development**: SQLite
    *   **Production**: PostgreSQL
-   **Auth**: JSON Web Tokens (JWT) & bcryptjs

---

## 🏃 Local Setup

### **1. Clone & Install**
```bash
git clone https://github.com/prasanna-kuracha/Dynamic-App-Engine.git
cd Dynamic-App-Engine
```

### **2. Backend Configuration**
Create a `.env` file in `backend/`:
```env
PORT=5002
JWT_SECRET=your_jwt_secret
DATABASE_URL="file:./prod.db"
```
Run the setup:
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### **3. Frontend Configuration**
Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5002/api"
```
Start the application:
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

-   `frontend/`: React/Next.js dynamic UI renderer and state management.
-   `backend/`: TypeScript API engine with Prisma database layer.
-   `backend/configs/`: JSON configuration files that drive the entire application logic.
-   `shared/`: Shared Zod schemas and TypeScript interfaces for full-stack type safety.

---

## ⚙️ How it Works
The entire application is driven by the **`todo.json`** file inside `backend/configs/`. By modifying this single JSON file, you can change:
1.  **Data Models**: Add or remove fields from your database.
2.  **Navigation**: Modify the sidebar menu items.
3.  **Views**: Create new Tables, Forms, or Dashboard analytics widgets instantly.

---
*Created with ❤️ by Antigravity*
