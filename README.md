# ✨ Histia Fleets - Web App

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

A modern, highly interactive web application for managing "Fleets" built as a 1:1 replica of a professional Figma design. The application features a stunning glassmorphism UI, real-time 3D preview cards, internationalization, and seamless data persistence.

## 🚀 Features

- **1:1 Figma Match**: Pixel-perfect implementation of the provided UI/UX designs.
- **Dynamic 3D Preview Cards**: Interactive tilt cards with mouse-tracking specular glare and dynamic color accents (adapted from 21st.dev).
- **Internationalization (i18n)**: Fully translated into English and French using **Intlayer**. Seamlessly toggle between `/fr/fleets` and `/en/fleets`.
- **Infinite Scrolling**: Cursor-based pagination using **TanStack Query v5** to efficiently load large lists of fleets.
- **Optimistic UI Updates**: Instant feedback when creating a fleet, before the server responds.
- **Advanced Animations**: Smooth page transitions, modal overlays with background progressive blurring, and slide-in help panels powered by **Framer Motion**.
- **Form Validation**: Robust form handling with **React Hook Form** and **Zod**.
- **Responsive Design**: Carefully optimized for `1920x1080` and `1400x900` displays.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/) (v7.9 with `@prisma/adapter-pg`)
- **Styling**: Vanilla CSS & Tailwind CSS v4
- **State Management / Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **i18n**: [Intlayer](https://intlayer.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL server running locally or remotely.

### 1. Clone the repository

```bash
git clone https://github.com/bahaayadi02/Cas-pratique-Histia.git
cd Cas-pratique-Histia/app
```

### 2. Install dependencies

This project uses `bun` (but you can use `npm` or `pnpm`):

```bash
npm install
# or
bun install
```

### 3. Setup Environment Variables

Create a `.env` file in the `app` directory and configure your database connection string:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/fleets_db"
```

### 4. Database Setup (Prisma)

Push the database schema and seed the database with initial mock data:

```bash
npx prisma db push
npx prisma db seed
```
*(The seed script generates 42 initial fleets to test infinite scrolling).*

### 5. Run the Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000/en/fleets](http://localhost:3000/en/fleets) (English) or [http://localhost:3000/fr/fleets](http://localhost:3000/fr/fleets) (French) in your browser.

## 🎨 Design Highlights

- **Live Preview Sync**: When creating a fleet, the 3D card on the left instantly updates its title, description, and color border gradient.
- **Glassmorphism Modal**: The creation modal features a stunning dark glass overlay with custom backdrop blurring that dims and softly blurs the background without altering the page scale.
- **Help Panel**: Interactive sliding help panels providing contextual guidance to the user.

## 📜 Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code issues.

## 📄 License

This project is licensed under the MIT License.
