# SaaS Dashboard Kit

A modern, customizable, and responsive dashboard built with **Next.js**, **Tailwind CSS**, and **Prisma**. This project streamlines user management, data visualization, Kanban-style task tracking, and role-based access control for SaaS applications.

---

## 🌟 Features

- 🌗 **Light & Dark Theme** — Seamless theme switching with `next-themes`
- 🔐 **Secure Authentication** — OAuth and email login via `NextAuth.js`
- 🧑‍💼 **Role-Based Access Control** — Admin and user permissions
- 🧩 **Drag-and-Drop Kanban Board** — Reorder columns and cards with instant UI feedback and optimistic updates
- 📊 **Interactive Charts** — Data visualizations with `Recharts` and `CountUp.js`
- 🧠 **Global State Management** — Lightweight, fast Zustand store
- ⚙️ **Customizable Layouts** — Dashboard widget arrangement (persisted per user - WIP)
- 🗃️ **PostgreSQL + Prisma ORM** — Scalable and type-safe database integration
- 🐳 **Docker Support** — Simple local development with Docker Compose

---

## 🚀 Live Demo

[**View Live Demo**](https://nextjs-dashboard-kitocoles-projects.vercel.app)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **State Management**: Zustand
- **Data Visualization**: Recharts, CountUp.js
- **Drag & Drop**: dnd-kit
- **Authentication**: NextAuth.js
- **Backend**: Prisma + PostgreSQL
- **DevOps**: Docker Compose

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kitocole/nextjs-dashboard.git
cd nextjs-dashboard
2. Install Dependencies
bash
Copy
Edit
npm install
# or
pnpm install
3. Configure Environment Variables
Create a .env file in the root directory:

dotenv
Copy
Edit
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=dashboard
DATABASE_URL="postgresql://postgres:your_db_password@localhost:5432/dashboard?schema=public"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
4. Start Services & Seed DB
bash
Copy
Edit
docker-compose up -d
npx prisma migrate dev --name init
npx prisma db seed
5. Run the Development Server
bash
Copy
Edit
npm run dev
# or
pnpm dev
Then open http://localhost:3000 in your browser.

🗂️ Project Structure
php
Copy
Edit
├── app/               # Next.js routes & layouts
├── components/        # Reusable React components (Kanban, UI)
├── lib/               # Utilities (Prisma client, helpers)
├── prisma/            # Schema, migrations, seed scripts
├── public/            # Static assets
├── styles/            # Tailwind & global styles
├── docker-compose.yml # PostgreSQL setup
├── package.json
└── tailwind.config.js
📈 Roadmap
 Role-based access control

 Profile & settings pages

 Interactive charts

 Optimistic Kanban board with column/card drag-and-drop

 Persist user dashboard widget layout

 Add unit & integration tests

 Setup CI/CD pipeline

🤝 Contributing
Contributions welcome! Feel free to open issues or PRs to help improve the project.

📄 License
This project is licensed under the MIT License.
```
