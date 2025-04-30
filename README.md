# SaaS Dashboard (Next.js + Tailwind + Zustand + Prisma)

A customizable, responsive dashboard interface built with modern tools:

- 🌗 **Dark/Light Theme** with persistence via `next-themes`
- 📊 **Charts & Stats** animated with `Recharts` and `CountUp.js`
- 🔀 **Drag-and-Drop Layout** using `dnd-kit`
- 🧠 **Global State** managed by `Zustand` (persisted to `localStorage`)
- 🔐 **Authentication** with `NextAuth.js` (GitHub & Google)
- ⚙️ **Dashboard Settings** and customization panel
- 🗄️ **PostgreSQL Backend** via Prisma ORM
- 🐳 **Docker Compose** for local database setup

Inspired by tools like Linear and Vercel Admin.

## 🚀 Live Demo

[https://nextjs-dashboard-kitocoles-projects.vercel.app](https://nextjs-dashboard-kitocoles-projects.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **State**: Zustand
- **Data Visualization**: Recharts, CountUp.js
- **Drag & Drop**: dnd-kit
- **Auth**: NextAuth.js
- **Backend**: Prisma (PostgreSQL)
- **DevOps**: Docker Compose

## 📦 Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/kitocole/nextjs-dashboard.git
   cd nextjs-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment**

   Create a `.env` file in the project root:

   ```dotenv
   # PostgreSQL (Docker Compose + Prisma)
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_db_password
   POSTGRES_DB=dashboard
   DATABASE_URL="postgresql://postgres:your_db_password@localhost:5432/dashboard?schema=public"

   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generate-a-secret>
   GITHUB_ID=<your-github-client-id>
   GITHUB_SECRET=<your-github-client-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   ```

4. **Start services & database**

   ```bash
   # Launch PostgreSQL
   docker-compose up -d

   # Run Prisma migrations & seed
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view your dashboard.

## 🗂️ Project Structure

```
├── app/               # Next.js routes & layouts
├── components/        # Reusable React components
├── lib/               # Utils (Prisma client, helpers)
├── prisma/            # Schema, migrations, seed scripts
├── public/            # Static assets
├── styles/            # Tailwind & global styles
├── docker-compose.yml # Local Postgres config
├── package.json
└── tailwind.config.js
```

## 📈 Roadmap

- [ ] Persist widget layouts per user on the server
- [ ] Role-based access control & permissions
- [ ] Profile & settings pages
- [ ] Add more chart types & visualizations
- [ ] Unit & integration tests
- [ ] CI/CD pipeline setup

## 📄 License

MIT © 2025 Kaeny Ito-Cole
