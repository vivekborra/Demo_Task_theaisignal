# InternHub 🚀

> A production-grade two-sided internship marketplace connecting college students with verified tech companies, startups, and high-impact internships with transparent stipends and real-time application tracking.

---

## 🌟 Overview

**InternHub** is an engineering-first web application built with **Next.js (App Router)**, **React**, **TypeScript**, **TailwindCSS**, **PostgreSQL**, and **Prisma ORM**. It bridges the gap between students seeking real software engineering, data science, AI/ML, and product roles and recruiters looking to discover, interview, and hire top emerging talent without chaotic email threads or ghost job postings.

### Key Highlights
- **PostgreSQL + Prisma Driven**: Real server-side database querying, full-text searching, multi-faceted filtering, sorting, and pagination.
- **Two-Sided Architecture**: Strict Role-Based Access Control (RBAC) separating **Students** and **Recruiters**.
- **Tamper-Proof Application Lifecycle**: Visual status progression (`Applied` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` / `Rejected`) with database-level uniqueness constraints preventing duplicate submissions.
- **Production Security**: Stateless signed HTTP-only JWT cookies, bcrypt password hashing, input sanitization via Zod, and server-side authorization guards.
- **Ready to Deploy**: 100% Vercel-compatible with zero build errors and native PostgreSQL support (Neon, Railway, Render, Supabase).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 14+ (App Router)](https://nextjs.org), [React 18](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [TailwindCSS](https://tailwindcss.com), [Lucide React Icons](https://lucide.dev) |
| **Backend** | Next.js Server Components, Server Actions & API Route Handlers |
| **Database** | [PostgreSQL](https://www.postgresql.org) (Compatible with Neon, Railway, Render, Supabase) |
| **ORM** | [Prisma ORM](https://www.prisma.io) with strict schemas, relations, and migrations |
| **Authentication** | Stateless signed JWT sessions (`jose`), HTTP-only cookies, `bcryptjs` password hashing |
| **Validation** | [Zod](https://zod.dev) schema validation across all inputs and queries |
| **Testing** | Automated business logic test suite via `tsx` |

---

## 🏛️ Architecture & System Design

```mermaid
graph TD
    Client[Next.js Client Components] -->|Fetch / HTTP| API[Next.js API Route Handlers]
    SSR[Next.js Server Components] -->|Direct ORM Access| PrismaClient[Prisma Client Singleton]
    API -->|Validation & Auth Guards| PrismaClient
    PrismaClient -->|SSL Pooled Connection| Postgres[(PostgreSQL Database)]

    subgraph Security & Middleware
        EdgeMW[Edge Middleware: /student/* & /recruiter/*]
        JWTCookie[HTTP-only Signed JWT Session]
        RBACGuard[RBAC: STUDENT / RECRUITER Checks]
        ZodValidator[Zod Schema Validation]
    end

    Client --> EdgeMW
    API -.-> Security & Middleware
```

### Core Architecture Highlights
1. **Edge Middleware Guard (`src/middleware.ts`)**:
   - Inspects cryptographically signed session cookies on the edge.
   - Redirects unauthenticated users with a dynamic `returnUrl`.
   - Blocks students from recruiter dashboards and recruiters from student applications.
2. **Server-Side Authorization**:
   - Every protected API route independently verifies identity and company/profile ownership.
   - Recruiters can *never* read or mutate candidate applications for another company's job postings.
3. **Optimized Database Queries**:
   - Marketplace search queries are executed directly on PostgreSQL indexes with `mode: 'insensitive'` and `contains` across `title`, `description`, `company.name`, and `skills`.
   - Avoids client-side array filtering or loading thousands of rows into memory.

---


## 🔐 Authentication & Authorization

- **Stateless Encrypted Sessions**: Session tokens are cryptographically signed using HS256 and stored in an `httpOnly`, `SameSite=Lax`, `Secure` (in production) cookie named `internhub_session`.
- **Bcrypt Password Hashing**: Salt rounds of 10 prevent rainbow table and dictionary attacks.
- **Zero Frontend Trust**: Role, user ID, and company ID are always resolved server-side from the verified JWT payload.
- **Granular Ownership Verification**:
  - `PATCH /api/internships/[id]` checks `internship.companyId === user.company.id`.
  - `PATCH /api/applications/[id]/status` verifies `application.internship.companyId === user.company.id`.

---

## 📡 API Specification

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new student or recruiter account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue session cookie |
| `POST` | `/api/auth/logout` | Authenticated | Invalidate session cookie |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile and company |
| `GET` | `/api/internships` | Public | Server-side search & faceted query with pagination |
| `POST` | `/api/internships` | Recruiter | Post new internship listing |
| `GET` | `/api/internships/[id]` | Public | Fetch detail, company info, and application status |
| `PATCH` | `/api/internships/[id]` | Recruiter (Owner) | Update listing metadata or close/reopen |
| `DELETE`| `/api/internships/[id]` | Recruiter (Owner) | Remove internship posting |
| `POST` | `/api/internships/[id]/apply` | Student | Submit application with duplicate prevention |
| `GET` | `/api/applications` | Authenticated | Student's submissions or Recruiter's candidates |
| `PATCH` | `/api/applications/[id]/status` | Recruiter (Owner) | Update candidate status (`APPLIED` ➔ `SELECTED`) |
| `GET` | `/api/profile` | Student | Fetch profile, skills, and education history |
| `PATCH` | `/api/profile` | Student | Update student profile, skills, and education |
| `GET` | `/api/company` | Recruiter | Fetch recruiter's company profile |
| `PATCH` | `/api/company` | Recruiter | Update recruiter's company profile |

---

## 👥 Demo Accounts

The project includes pre-configured demo credentials and instant one-click autofill buttons on the login page:

### 🎓 Student Demo Account
- **Email**: `student@demo.com`
- **Password**: `password123`
- **Profile**: Alex Chen (UC Berkeley CS Junior, Full-Stack & Systems)
- **Pre-seeded Applications**: 3 live applications in `INTERVIEW`, `SHORTLISTED`, and `APPLIED` stages.

### 🏢 Recruiter Demo Account
- **Email**: `recruiter@demo.com`
- **Password**: `password123`
- **Company**: NexusCloud Systems (Cloud Infrastructure & DevOps)
- **Pre-seeded Postings**: Active software and DevOps postings with real candidate applicants ready for status management.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js `v18.17+` or `v20+` or `v24+`
- PostgreSQL instance (e.g. Neon, Railway, Docker, or local)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd internhub

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your database URL and a 32+ character authentication secret:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
AUTH_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seed
```bash
# Push Prisma schema to PostgreSQL
npm run db:push

# Generate Prisma Client
npm run db:generate

# Seed with realistic companies, internships, and applications
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run Automated Verification Tests
```bash
npm test
```

### 7. Production Build
```bash
npm run build
npm start
```

---

## 🧪 Automated Verification & Test Coverage

Run `npm test` to execute the automated business logic test suite covering:
1. **Duplicate Application Prevention**: Asserts that `unique(studentProfileId, internshipId)` stops concurrent or subsequent applications.
2. **Expired Internship Enforcement**: Confirms that listings past their deadline reject applications.
3. **Closed Internship Enforcement**: Asserts that listings manually marked as `CLOSED` reject applications.
4. **Recruiter Cross-Company Authorization**: Asserts that recruiters cannot modify or delete postings owned by another company.
5. **Recruiter Candidate Status Pipeline**: Tests that authorized recruiters can progress applications through `SHORTLISTED`, `INTERVIEW`, and `SELECTED`.
6. **PostgreSQL Search & Filter Execution**: Verifies database filtering by work mode, stipend, and insensitive keyword search.

---

## 🚀 Deployment Instructions (Vercel + Neon)

### Deploying Database (Neon / Railway / Render)
1. Create a PostgreSQL project on [Neon](https://neon.tech), [Railway](https://railway.app), or [Render](https://render.com).
2. Copy the pooled connection string (`DATABASE_URL`).
3. Run `npx prisma db push` and `npx tsx prisma/seed.ts` to deploy schemas and initial demo data.

### Deploying Application to Vercel
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `AUTH_SECRET`: A secure random string (e.g. `openssl rand -base64 32`).
   - `NEXT_PUBLIC_APP_URL`: Your Vercel domain (e.g. `https://internhub.vercel.app`).
4. Click **Deploy**. Vercel will automatically run `prisma generate && next build`.

---

## 📽️ Recommended Loom Demo Flow

1. **Homepage Walkthrough**:
   - Showcase modern hero, trending tags, transparent stipends, and featured listings.
2. **Marketplace Discovery (`/internships`)**:
   - Search by role or tech stack (`Frontend`, `React`, `Python`).
   - Filter by Remote / Hybrid, adjust Minimum Stipend slider.
   - Demonstrate shareable URL query state (`?q=frontend&workMode=REMOTE`).
3. **Student Flow**:
   - Log in using the 1-click **Demo Student** button.
   - Review `/student/profile` (skills tagger, university education builder, resume link).
   - Open an internship, submit an application with a custom note.
   - View updated status timeline on `/student/applications`.
   - Attempt duplicate application to demonstrate graceful 409 Conflict rejection.
4. **Recruiter Flow**:
   - Log in using the 1-click **Demo Recruiter** button.
   - Review `/recruiter` dashboard metrics (Active Postings, Applicants, In Interview, Offers).
   - Post a new internship on `/recruiter/internships/new` with dynamic requirements and skills.
   - Open `/recruiter/internships/[id]/applicants`, inspect candidate portfolio/resume, and update their status to `Interview` or `Selected`.
