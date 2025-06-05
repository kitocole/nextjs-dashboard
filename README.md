SaaS Dashboard Kit
A modern, customizable dashboard template for SaaS apps — built with Next.js, Tailwind CSS, Prisma, and Zustand. Features real-time drag-and-drop functionality, role-based access, data visualizations, and secure authentication.

🌟 Features
🌗 Light & Dark Theme — Powered by next-themes

🔐 Secure Auth — OAuth and Email login via NextAuth.js

🧑‍💼 Role-Based Access Control — User & admin permissions

📊 Interactive Charts — Built with Recharts and CountUp.js

🧩 Drag-and-Drop Widgets — Powered by dnd-kit

🧩 Kanban Board — Powered by dnd-kit

🗃️ Prisma + PostgreSQL — Scalable database integration

⚙️ Customizable Layouts — Persisted per user

🐳 Docker Support — Easy local development with Docker Compose

🚀 Live Demo
View Demo

🛠️ Tech Stack
Layer Tools
Frontend Next.js App Router, Tailwind CSS
State Zustand
Auth NextAuth.js
Backend Prisma ORM (PostgreSQL)
Drag/Drop dnd-kit
Charts Recharts, CountUp.js
DevOps Docker Compose

📦 Getting Started

1. Clone the repository
   bash
   Copy
   Edit
   git clone https://github.com/kitocole/nextjs-dashboard.git
   cd nextjs-dashboard
2. Install dependencies
   bash
   Copy
   Edit
   npm install

# or

pnpm install 3. Set environment variables
Create a .env file in the root:

env
Copy
Edit

# PostgreSQL

POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=dashboard
DATABASE_URL="postgresql://postgres:your_db_password@localhost:5432/dashboard?schema=public"

# NextAuth

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret 4. Start the database and run migrations
bash
Copy
Edit
docker-compose up -d
npx prisma migrate dev --name init
npx prisma db seed 5. Run the dev server
bash
Copy
Edit
npm run dev

# or

pnpm dev
Then open http://localhost:3000.

🗂️ Folder Structure
php
Copy
Edit
├── app/ # Next.js routes and layouts
├── components/ # Reusable UI components
├── hooks/ # Zustand and logic hooks
├── lib/ # Prisma and utilities
├── prisma/ # Schema and DB seed scripts
├── public/ # Static files
├── styles/ # Tailwind setup
├── docker-compose.yml # Local PostgreSQL config
└── tailwind.config.js
📈 Roadmap
✅ Drag-and-drop columns/cards

✅ Role-based access control

✅ OAuth with Google/GitHub

✅ Custom widget layouts

🟧 More chart types

🟧 Unit/integration tests

🟧 CI/CD with GitHub Actions

🤝 Contributing
Open issues or submit PRs to help improve this kit — all contributions welcome!

📄 License
This project is licensed under the MIT License.
