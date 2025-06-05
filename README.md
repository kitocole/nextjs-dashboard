# Next.js SaaS Dashboard Kit

A modern, full‑featured dashboard template for SaaS products built with **Next.js**, **Tailwind CSS** and **Prisma**. It provides drag‑and‑drop widgets, interactive charts and secure authentication out of the box so you can focus on shipping your product.

## Features

- **Light & dark themes** powered by `next-themes`
- **Secure auth** with OAuth and email via NextAuth.js
- **Role‑based access control** for user and admin flows
- **Interactive charts** using Recharts and CountUp.js
- **Drag‑and‑drop widgets** with `dnd-kit`
- **Kanban board** with real‑time sorting
- **Prisma + PostgreSQL** database integration
- **Customizable layouts** persisted per user
- **Docker support** for local development

## Tech Stack

| Layer     | Tools                            |
| --------- | -------------------------------- |
| Frontend  | Next.js App Router, Tailwind CSS |
| State     | Zustand                          |
| Auth      | NextAuth.js                      |
| Backend   | Prisma ORM (PostgreSQL)          |
| Drag/Drop | dnd-kit                          |
| Charts    | Recharts, CountUp.js             |
| DevOps    | Docker Compose                   |

## Getting Started

1. **Clone the repository**
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
3. **Set environment variables** – create a `.env` file in the project root:

   ```env
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
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the database and run migrations**
   ```bash
   docker-compose up -d
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

```
├── app/              # Next.js routes and layouts
├── components/       # Reusable UI components
├── hooks/            # Zustand and logic hooks
├── lib/              # Prisma and utilities
├── prisma/           # Schema and DB seed scripts
├── public/           # Static files
├── styles/           # Tailwind setup
├── docker-compose.yml# Local PostgreSQL config
└── tailwind.config.js
```

## Roadmap

- [x] Drag‑and‑drop columns/cards
- [x] Role‑based access control
- [x] OAuth with Google/GitHub
- [x] Custom widget layouts
- [ ] More chart types
- [ ] Unit/integration tests
- [ ] CI/CD with GitHub Actions

## Contributing

Issues and pull requests are welcome! Please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.
