# **SaaS Dashboard Kit**

A modern, customizable, and responsive dashboard built with **Next.js**, **Tailwind CSS**, and **Prisma**. This project is designed to streamline user management, data visualization, and role-based access control for SaaS applications.

---

## 🌟 **Features**

- 🌗 **Dark/Light Theme**: Seamless theme switching with `next-themes`.
- 📊 **Interactive Charts**: Data visualizations powered by `Recharts` and `CountUp.js`.
- 🔀 **Drag-and-Drop Layouts**: Intuitive dashboard customization using `dnd-kit`.
- 🔐 **Secure Authentication**: OAuth and email login with `NextAuth.js`.
- 🧑‍💼 **Role-Based Access Control**: Admin and user permissions for secure operations.
- 🗄️ **PostgreSQL Backend**: Scalable database integration via Prisma ORM.
- ⚙️ **Customizable Settings**: Personalize dashboard layouts and preferences.
- 🐳 **Docker Support**: Simplified local development with Docker Compose.

---

## 🚀 **Live Demo**

[**View the Live Demo**](https://nextjs-dashboard-kitocoles-projects.vercel.app)

---

## 🛠️ **Tech Stack**

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **State Management**: Zustand
- **Data Visualization**: Recharts, CountUp.js
- **Drag & Drop**: dnd-kit
- **Authentication**: NextAuth.js
- **Backend**: Prisma (PostgreSQL)
- **DevOps**: Docker Compose

---

## 📦 **Installation & Setup**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/kitocole/nextjs-dashboard.git
   cd nextjs-dashboard
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**  
   Create a `.env` file in the root directory:

   ```dotenv
   # PostgreSQL
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

4. **Start Services & Database**

   ```bash
   docker-compose up -d
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ **Project Structure**

```
├── app/               # Next.js routes & layouts
├── components/        # Reusable React components
├── lib/               # Utilities (Prisma client, helpers)
├── prisma/            # Schema, migrations, seed scripts
├── public/            # Static assets
├── styles/            # Tailwind & global styles
├── docker-compose.yml # Local Postgres config
├── package.json
└── tailwind.config.js
```

---

## 📈 **Roadmap**

- [x] Role-based access control & permissions
- [x] Profile & settings pages
- [x] Interactive charts & visualizations
- [x] Persist widget layouts per user on the server
- [ ] Add more chart types & visualizations
- [ ] Unit & integration tests
- [ ] CI/CD pipeline setup

---

## 🤝 **Contributing**

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

---

## 📄 **License**

This project is licensed under the [MIT License](LICENSE).

---
