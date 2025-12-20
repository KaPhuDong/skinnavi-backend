<div align="center">

# 🚀 SkinNavi Backend

**Onboarding Guide** – Easy setup for new team members

</div>

---

## 🧱 Tech Stack

| Technology         | Usage                          |
| ------------------ | ------------------------------ |
| **NestJS**         | Backend framework (TypeScript) |
| **PostgreSQL**     | Relational database            |
| **Prisma ORM**     | Database ORM & migrations      |
| **Docker**         | Database container             |
| **Docker Compose** | Infrastructure orchestration   |

---

## ✅ Prerequisites

Make sure you have installed:

- **Node.js** `v18+` (recommended)
- **Docker** & **Docker Compose**
- **Git**

Check versions (optional):

```bash
node -v
docker -v
docker compose version
```

---

## 📥 Clone the Repository

```bash
git clone https://github.com/KaPhuDong/skinnavi-backend.git
cd skinnavi-backend
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Setup

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update values if needed.

> ⚠️ **Do NOT commit `.env` files**

---

## 🐘 Start PostgreSQL with Docker

Start only the database service:

```bash
docker compose up -d db
```

---

## 🗄️ Run Prisma Migration

```bash
npx prisma migrate dev
```

This command will:

- Apply database migrations
- Generate Prisma Client

Optional – open Prisma Studio:

```bash
npx prisma studio
```

---

## ▶️ Start the Backend Server

```bash
npm run start:dev
```

The API will be available at:

👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Common Commands

```bash
npm run start:dev        # Start server in development mode
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Apply migrations
```

---

## 📝 Notes

- ❌ Do NOT commit `.env` files
- 🔄 Always run `npx prisma migrate dev` after pulling new changes
- 🐳 Docker is used **only for infrastructure** (PostgreSQL)
- 💻 Backend runs **locally**, not inside Docker

---

<div align="center">

✨ Happy Coding with **SkinNavi** ✨

</div>
