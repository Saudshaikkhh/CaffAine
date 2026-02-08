# ☕ CaffAIne Barista

A modern, AI-powered coffee shop experience. **CaffAIne Barista** isn't just an ordering platform; it's a personalized experience that matches your brew to your mood.

---

## ✨ Features

- **🧠 CaffAIne Barista (AI Mood Detection):** Share how your day is going, and our AI will listen, empathize, and recommend the perfect beverage based on your emotional state.
- **📱 Seamless Ordering:** A beautiful, responsive menu for hot drinks, cold brews, and desserts.
- **🍫 Smart Upselling:** Intelligent suggestions for pairings (like our signature cookies) to enhance your coffee experience.
- **🛡️ Admin Dashboard:** Management interface for products, inventory, and order tracking.
- **🎨 Premium UI:** Built with dark-mode glassmorphism, smooth animations, and a focus on visual excellence.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** SQLite (Better-SQLite3)
- **AI Logic:** Custom NLP-based mood analysis and recommendation engine.

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Coffee
```

### 2. Backend Setup
```bash
cd Backend
npm install
npx prisma db seed # Seeds the initial product database
npm run start:dev
```
*The backend will run at `http://localhost:3001`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend will run at `http://localhost:3000`.*

---

## 📂 Project Structure

- `/frontend`: Next.js application, including the AI chat interface and product menu.
- `/Backend`: NestJS API, Prisma schema, and AI service logic.
- `/Backend/prisma`: Database schema and seeding scripts.

---

## 📄 License
This project is unlicensed (Private).
