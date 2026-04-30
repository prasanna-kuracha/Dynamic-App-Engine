# 🚀 Dynamic App Generator (Meta-Engine)

This project is a high-performance **Meta-Application Generator** that translates structured JSON configurations into a fully functional, premium web application (React + Express + SQLite/Prisma).

## 🛠 Architecture & Stack

- **Frontend**: Next.js 14, Tailwind CSS, TanStack Query, Lucide Icons, React Datepicker.
- **Backend**: Node.js + TypeScript + Express.
- **ORM/DB**: Prisma v6.2.1 + SQLite (Dynamic JSONB Storage).
- **Core Engine**: A generic runtime that interprets `todo.json` to render UI and handle API requests.

---

## 🏃 Getting Started

To run this project on your local machine, you will need to open **two separate terminal windows**.

### **1. Backend Setup (API & Database)**
Go to the backend directory and initialize the database:
```bash
cd backend
npm install
npx prisma db push
npm run dev
```
> **Note**: The backend will start on **http://localhost:5002** (or 5000) and will automatically sync with the Prisma schema.

### **2. Frontend Setup (Modern UI)**
In a new terminal window, start the React development server:
```bash
cd frontend
npm install
npm run dev
```
> **Note**: The frontend will start on **http://localhost:3002** (or 3000). Access the dashboard through this URL.

---

## ✨ Key Features

- **Dynamic Core**: Renders complex Tables and Forms based on JSON definitions.
- **Eye-Feast UI**: Premium pastel-themed design with Glassmorphism and smooth animations.
- **Modern Date Picker**: Integrated `react-datepicker` for a polished calendar experience.
- **Data Import System**: Supports both **CSV and JSON** formats with a dynamic column mapping interface.
- **Authentication**: JWT-based Auth system with custom Login/Register views.
- **Responsive Layout**: Optimized for all screen sizes with a professional sidebar and header system.

---

## ⚙️ Configuration

The entire application logic is driven by the configuration files in `/configs`.
- **Modify `configs/todo.json`**: Change fields, models, or UI types and the app will update instantly.

---

## 📂 Project Structure

- `frontend/`: React-based dynamic UI renderer.
- `backend/`: TypeScript-based dynamic API engine.
- `configs/`: Sample JSON configurations for app generation.
- `shared/`: Common Zod schemas and TypeScript types.
