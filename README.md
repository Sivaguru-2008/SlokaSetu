# SlokaSetu (श्लोकसेतुः)
## A Multilingual Hindu Festival Calendar and Devotional Knowledge Platform

**SlokaSetu** is an academic Database Management Systems (ADM) project and a complete production-quality web application that bridges Hindu festival dates, Amrita institutional devotional occasions, canonical slokas, their meanings, textual script variants, and downloadable PDF prayer resources.

---

## 1. Key Features

- **Interactive Festival & Institutional Calendar:** Monthly calendar with Drik Ganita and institutional observance markers, day selection, category filters (Hindu Festivals vs Amrita Institutional Occasions), and regional filters.
- **Dedicated Occasion Profiles:** Detailed view of each observance, including official liturgical parayanam lists, relationship type distinctions (*Official Programme*, *Traditional*, *Curated Recommendation*), and interactive preparation checklists.
- **Searchable Sloka Knowledge Library:** 27 canonical Sanskrit compositions with server-side pagination, live multi-faceted filters (Deity, Category, Script, PDF availability), and sorting.
- **Multilingual Text Reader:** Language and script selector separating Language (*Sanskrit*) from Script (*Latin IAST, Telugu, Tamil*), continuous vs verse-by-verse view toggle, font resizing, and 1-click clipboard copy.
- **PDF Resource Management:** Secure download endpoints with path-traversal prevention, file existence validation, and metadata display.
- **Administrative Governance Portal:** Protected with bcrypt password hashing and JWT authentication, enabling administrators to review drafts, approve content, manage occasions, and monitor audit trails.
- **Data Ingestion Pipeline:** Python PyMuPDF pipeline extracting text, detecting section boundaries, preserving page citations, and generating intermediate datasets.
- **Automated Test Coverage:** 20 automated integration and end-to-end tests validating the complete user workflow.

---

## 2. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios.
- **Backend:** Node.js, TypeScript, Express, Prisma ORM, JSON Web Tokens (JWT), bcryptjs, Multer.
- **Database:** PostgreSQL 18 with custom isolated schema (`slokasetu`), foreign keys, check constraints, indexes, and views.
- **Data Engineering:** Python 3.10+, PyMuPDF, JSON Lines, CSV intermediate validation datasets.
- **Testing:** Vitest, Supertest.

---

## 3. Data Sources & Archival Provenance

The system ingests and preserves four primary source documents in `backend/storage/pdfs/`:
1. `SRI MAHAGANAPATHI HOMAM JULY.pdf` (Amrita School of Engineering, Chennai – Department of Amrita Darshanam, 22 July 2026 Parayanam Circular)
2. `ENGLISH.pdf` (Roman Transliteration / IAST Classical Sanskrit Stotra Sangraha)
3. `TELUGU.pdf` (Complete classical Sanskrit stotras rendered in Telugu script)
4. `TAMIL.pdf` (Complete classical Sanskrit stotras rendered in Tamil script with Grantha notation)

---

## 4. Quick Start Guide (Windows Development Machine)

### Prerequisites
- **Node.js:** v18+ or v20+ (`node -v`)
- **Python:** v3.10+ with `pymupdf` (`python --version`)
- **PostgreSQL:** Running on `localhost:5432`

---

### Step 1: Clone or Navigate to the Project
```powershell
cd "d:\adm pj"
```

---

### Step 2: Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```powershell
# In backend/.env
PORT=5000
DATABASE_URL="postgresql://agents:agents@localhost:5432/agents_runtime?schema=slokasetu"
JWT_SECRET="slokasetu_dev_secret_key_jwt_2026"
JWT_EXPIRES_IN="7d"
STORAGE_DIR="d:/adm pj/backend/storage/pdfs"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

---

### Step 3: Run Data Ingestion Pipeline (Python)
Extract raw text and generate intermediate reviewed datasets:
```powershell
python scripts/ingestion_pipeline.py
```

---

### Step 4: Setup Database & Seed Data
Initialize schema and run seed script:
```powershell
cd backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "postgresql://agents:agents@localhost:5432/agents_runtime" -f "prisma/views.sql"
```

---

### Step 5: Run Automated Tests
Execute the 20 backend integration and end-to-end tests:
```powershell
npm test
```

---

### Step 6: Start Backend Server
```powershell
npm run dev
# Backend runs at http://localhost:5000
# Health check: http://localhost:5000/health
```

---

### Step 7: Start Frontend Application
In a separate terminal:
```powershell
cd "d:\adm pj\frontend"
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 5. Administrative Credentials

- **Portal URL:** `http://localhost:5173/admin`
- **Email:** `admin@slokasetu.org`
- **Password:** `SlokaSetu@2026`

---

## 6. Demonstration of ADM Database Requirements

The 12 ADM demonstration SQL queries can be executed directly using psql:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" "postgresql://agents:agents@localhost:5432/agents_runtime" -f "backend/prisma/adm_queries.sql"
```
Refer to [docs/database.md](file:///d:/adm%20pj/docs/database.md) for full descriptions of joins, aggregations, views, and normalization rationale.

---

## 7. Documentation Index

- [Architecture & Data Flow](file:///d:/adm%20pj/docs/architecture.md)
- [Database Schema & ADM Queries](file:///d:/adm%20pj/docs/database.md)
- [Data Ingestion Pipeline](file:///d:/adm%20pj/docs/data-ingestion.md)
- [Content Governance & Verification Policy](file:///d:/adm%20pj/docs/content-policy.md)
- [REST API Reference](file:///d:/adm%20pj/docs/api.md)

---
*Developed for the Department of Amrita Darshanam, Amrita School of Engineering, Chennai.*
