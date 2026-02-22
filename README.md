# ☕ CaffAine - Smart Coffee Experience

Welcome to **CaffAine**, a premium, AI-powered coffee shop platform designed for a seamless, state-of-the-art ordering experience. This repository contains both the **Frontend (Next.js)** and **Backend (NestJS)**.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API

### **Backend**
- **Framework**: NestJS (Node.js)
- **Database**: SQLite (via Prisma ORM)
- **Auth**: JWT-based Authentication
- **File System**: Local storage for product images

---

## 💻 System Configuration (Pre-requisites)

Before you start, ensure your laptop/PC has the following installed:

1.  **Node.js**: [Download v20 or higher](https://nodejs.org/)
2.  **Git**: [Download Git](https://git-scm.com/)
3.  **VS Code**: (Highly Recommended)
4.  **Prisma Extension**: (Optional but helpful for viewing the database)

---

## 🚀 How to Run the Project (Spoon-fed Guide)

Follow these exact steps to get the project running on your local machine:

### 1. Clone the Repository
Open your terminal (CMD, PowerShell, or Git Bash) and run:
```bash
git clone <repository-url>
cd Coffee
```

### 2. Configure the Backend
Move into the backend directory and install dependencies:
```bash
cd Backend
npm install
```

### 3. Setup the Database (Prisma)
The project uses SQLite, so no external database installation (like SQL Server or MySQL) is required. Run these commands to initialize the database:

```bash
# Generate the Prisma Client
npx prisma generate

# Create the database and push the schema
npx prisma db push

# (Optional) Seed the database with initial menu items and an admin user
npm run seed
```

### 4. Start the Backend
```bash
npm run start:dev
```
*The backend will be running at:* `http://localhost:3001`

---

### 5. Configure the Frontend
Open a **new terminal tab/window**, navigate to the frontend directory, and install dependencies:
```bash
# Make sure you are in the root 'Coffee' folder first
cd frontend
npm install
```

### 6. Start the Frontend
```bash
npm run dev
```
*The website will be running at:* `http://localhost:3000`

---

## 🔑 Admin Credentials (if seeded)
If you ran the `npm run seed` command, you can log in as an admin:
- **Email**: `admin@caffaine.com` (or as configured in `seed.ts`)
- **Password**: `admin123`

---

## 📂 Project Structure

```text
Coffee/
├── Backend/             # NestJS Server
│   ├── src/             # Application Logic
│   ├── prisma/          # Database Schema & Migrations
│   └── uploads/         # Store for product images
└── frontend/            # Next.js Application
    ├── src/
    │   ├── app/         # Pages & Routing
    │   ├── components/  # UI Components
    │   └── lib/         # API Utils
    └── public/          # Static Assets
```

## ⚠️ Common Troubleshooting

-   **Images not showing?** Make sure the Backend is running. The frontend fetches images from the `uploads` folder on the backend server.
-   **Port Conflict?** If port 3000 or 3001 is busy, you might need to change the port in `main.ts` (backend) or `.env` (frontend).
-   **Prisma Errors?** If you change the database schema, always run `npx prisma db push` to sync the changes.

---

**Happy Brewing! ☕🚀**
