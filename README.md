<div align="center">
  <h1 align="center">Histia Fleets</h1>
  <p align="center">
    A robust, modern web application for managing organization fleets, engineered with a 1:1 fidelity to professional Figma specifications.
  </p>
  <p align="center">
    <a href="#overview">Overview</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#technical-architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## Overview

**Histia Fleets** is a full-stack Next.js application designed to provide a seamless and highly interactive user experience for fleet management. The project demonstrates advanced frontend techniques, including glassmorphism UI, real-time 3D interactions, and progressive blurring, backed by a robust PostgreSQL and Prisma database layer.

## Key Features

- **Pixel-Perfect Implementation**  
  A strict 1:1 translation of the provided UI/UX Figma designs, ensuring complete visual fidelity across 1920x1080 and 1400x900 viewports.
  
- **Interactive 3D Preview Engine**  
  Features dynamic tilt cards equipped with mouse-tracking specular glare and reactive color accents that update in real-time as users modify fleet configurations.
  
- **Seamless Internationalization (i18n)**  
  Fully localized in English and French using Intlayer. Content routes automatically adapt via `/en/fleets` and `/fr/fleets`.
  
- **Optimized Data Fetching & Infinite Scroll**  
  Utilizes TanStack Query v5 for cursor-based pagination, ensuring efficient rendering and loading of extensive fleet lists without performance degradation.
  
- **Advanced Micro-Interactions & Animations**  
  Powered by Framer Motion, the application features smooth page transitions, sliding contextual help panels, and complex modal overlays with progressive background blurring.

## Technical Architecture

### Core Stack
| Technology | Description |
| :--- | :--- |
| **Next.js 16 (React 19)** | App Router, Server Components, and optimized rendering |
| **PostgreSQL & Prisma** | Relational database management with strongly-typed ORM access |
| **TanStack Query v5** | Server state management, caching, and optimistic UI updates |
| **Tailwind CSS v4** | Utility-first styling with custom CSS for complex glassmorphism |

### Ecosystem & Tooling
- **Validation:** Zod & React Hook Form
- **Animations:** Framer Motion
- **Internationalization:** Intlayer
- **Language:** TypeScript (Strict Mode)

## Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v20 or higher)
- **PostgreSQL** database instance (local or remote)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bahaayadi02/Cas-pratique-Histia.git
   cd Cas-pratique-Histia/app
   ```

2. **Install dependencies**  
   The project is configured for `bun`, but standard package managers are fully supported.
   ```bash
   npm install
   ```

3. **Environment Configuration**  
   Create a `.env` file in the `app` directory and define your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/fleets_db"
   ```

4. **Database Initialization**  
   Synchronize the Prisma schema with your database and seed initial data:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Scripts Reference

- `npm run dev` - Initializes the local development server.
- `npm run build` - Compiles the application for production deployment.
- `npm run start` - Boots the production server.
- `npm run lint` - Executes ESLint for static code analysis.

---
<div align="center">
  <sub>Developed for the Histia technical assessment.</sub>
</div>
