# Next.js SaaS Dashboard Kit

A modern SaaS dashboard starter built with **Next.js**, **TypeScript**, **Tailwind CSS** and **Prisma**. It provides authentication, role‑based access control, drag‑and‑drop widgets and a Kanban board so you can focus on shipping your product.

## Features

- **🌗 Light & dark themes** powered by `next-themes`
- **🔐 Secure authentication** via NextAuth.js with OAuth and email
- **🔑 Role-based access control** for user and admin flows
- **📈 Interactive charts** with Recharts and CountUp.js
- **🖱️ Drag-and-drop widgets** and layouts using `dnd-kit`
- **🗂️ Kanban board** with real-time sorting
- **🔄 Custom layouts** persisted per user
- **🗄️ Prisma + PostgreSQL** database integration
- **🐳 Docker support** for local development
- **🚀 CI/CD pipeline** with GitHub Actions

## Tech Stack

| Layer     | Tools                            |
| --------- | -------------------------------- |
| Frontend  | Next.js App Router, Tailwind CSS |
| State     | Zustand, React Query             |
| Auth      | NextAuth.js                      |
| Backend   | Prisma ORM (PostgreSQL)          |
| Drag/Drop | dnd-kit                          |
| Charts    | Recharts, CountUp.js             |
| DevOps    | Docker Compose, GitHub Actions   |

## Folder Structure

```
├── app/              # Next.js routes and layouts
├── components/       # Reusable UI components
├── hooks/            # Zustand and custom hooks
├── lib/              # Prisma and utilities
├── prisma/           # Schema and DB seed scripts
├── public/           # Static assets
└── docker-compose.yml# Local PostgreSQL config
```

## Database & Auth

Prisma models include `User`, `KanbanBoard`, `KanbanColumn` and `KanbanCard`. Users have roles (`USER`, `EDITOR`, `ADMIN`) which drive role‑based routing and API checks. Authentication uses NextAuth with Google, GitHub and credentials providers. JWT callbacks expose extra user fields like role and name components.

## API Routes

- `/api/dashboard/layout` – saves or retrieves a user’s dashboard card/chart order.
- `/api/kanban/` – CRUD endpoints for boards, columns and cards.
- `/api/users` and `/api/users/[id]` – user management with admin checks.
- `/api/stats` – returns sample dashboard statistics.
- `/api/notifications` – serves mock notification data.

## Client Features

- Global providers wrap the app with `SessionProvider`, `ThemeProvider` and React Query.
- Navigation includes a `Navbar` with theme switcher and notifications dropdown plus a role-aware `Sidebar`.
- The dashboard page shows stats and charts that can be rearranged via drag‑and‑drop. Layouts are persisted to the dashboard API route.
- The Kanban board provides card/column management with optimistic updates and drag sorting.
- A notifications page reads from Zustand; profile and settings pages allow editing user info and customizing layout order.
- The users page displays a table with filtering and CSV export, with editing restricted to admins.

## Development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env`** (see `.env.example` for all variables)

3. **Start PostgreSQL and run migrations**

   ```bash
   docker-compose up -d
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Roadmap

- [x] Drag‑and‑drop Kanban board
- [x] Role‑based access control
- [x] OAuth with Google/GitHub
- [x] Custom widget layouts
- [ ] More chart types
- [ ] Unit/integration tests
- [x] CI/CD with GitHub Actions

## Contributing

Issues and pull requests are welcome! Please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.
