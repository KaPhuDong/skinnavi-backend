🚀 SkinNavi Backend – Onboarding Guide

1. Tech Stack

NestJS (TypeScript)

PostgreSQL

Prisma ORM

Docker & Docker Compose

2. Prerequisites

Make sure you have installed:

Node.js (v18+ recommended)

Docker & Docker Compose

Git

3. Clone the Repository
   git clone https://github.com/your-org/skinnavi-backend.git
   cd skinnavi-backend

4. Install Dependencies
   npm install

5. Environment Setup

Create a .env file based on the example:

cp .env.example .env

Update values if needed.

6. Start PostgreSQL with Docker
   docker compose up -d db

7. Run Prisma Migration
   npx prisma migrate dev

This will:

Apply database migrations

Generate Prisma Client

8. Start the Backend Server
   npm run start:dev

The API will be available at:

http://localhost:3000

9. Common Commands
   npm run start:dev # Start server in development mode
   npx prisma studio # Open Prisma Studio
   npx prisma migrate dev # Apply migrations

10. Notes

Do NOT commit .env files

Always run prisma migrate dev after pulling new changes

Use Docker only for infrastructure (database)
