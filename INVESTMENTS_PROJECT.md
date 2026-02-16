# Investments Feature — Step-by-step Project Blueprint

Date: 2026-02-06

This document is the implementation plan for an **Investments** feature inside this Next.js app.

## 1) Scope (what we are building)

### Markets

- **Brazil** and **USA** only.

### Asset types

- **Stocks**
- **ETFs**
- **REITs** (US REITs + Brazil FIIs mapped as REIT)

### Data sources

- Source CSVs live in **public/data/**.
- After import, **Neon Postgres** becomes the **source of truth** for the UI.

### Dashboard goals

- List & filter assets by **country** and **type**.
- Show key fundamentals over time and “latest year” snapshot:
  - Receita Líquida
  - Lucro Líquido
  - ROE
  - Margem Líquida
  - Dívida Líquida / EBITDA
  - Dividendos (yield and/or payout %)
- Provide a “learn” area that teaches:
  - How dividends work
  - How to calculate dividend yield
  - How to interpret the metrics to decide if an asset is attractive

---

## 2) High-level architecture

- **Frontend**: Next.js App Router pages and components
- **Backend**: Next.js Route Handlers (`/api/*`)
- **Database**: Neon Postgres
- **ORM**: Prisma
- **Auth**: Email+password + JWT (or later replace with Supabase)

Data flow:

1. CSV → seed/import script → Neon Postgres
2. API routes query Neon via Prisma
3. Dashboard pages render lists/details + computed analytics

---

## 3) Step-by-step milestones

### Milestone A — Database foundation (Prisma)

**Goal:** define a schema that supports assets + yearly prices + yearly fundamentals.

Steps:

1. Create enums for `Country` and `AssetType`.
2. Create `Asset` model:
   - `symbol`, `name`, `description`
   - `country`, `type`
   - optional `expenseRatio`, `dividendYield`, `currentPrice`, `riskLevel`
   - unique `(symbol, country)`
3. Create yearly tables:
   - `AssetPrice (assetId, year, price)`
   - `Fundamentals (assetId, year, receitaLiquida, lucroLiquido, roe, margemLiquida, dividaLiquida, ebitda, dividendPercentage)`
4. Add indexes for quick filtering by country/type/symbol.

Acceptance criteria:

- Prisma generates successfully.
- DB push/migration works with Neon.

---

### Milestone B — CSV import into Neon (seed)

**Goal:** import all relevant CSVs into Postgres and keep the import idempotent.

Steps:

1. Create `prisma/seed.js`.
2. For each CSV file:
   - parse rows (PapaParse)
   - upsert Asset by `(symbol, country)`
   - upsert AssetPrice for years 2019–2023
   - upsert Fundamentals for years 2019–2023
3. Wire seed script into `package.json` under `prisma.seed`.
4. Run:
   - `npm run db:generate`
   - `npm run db:push` (or `npm run db:migrate`)
   - `npm run db:seed`

Acceptance criteria:

- Rerunning the seed does not create duplicates.
- Assets can be queried by country/type.

Notes:

- Only ingest: `usa_stocks.csv`, `usa_etfs.csv`, `usa_reits.csv`, `brazil_acoes.csv`, `brazil_etfs.csv`, `brazil_fiis.csv`.
- Bonds/BDRs/etc are out of scope for this phase.

---

### Milestone C — Investments API

**Goal:** provide stable API endpoints for the dashboard.

Endpoints (recommended):

1. `GET /api/investments/assets`
   - Query params: `country`, `type`, `q` (search), `limit`, `cursor`
   - Returns: list of assets with latest price/fundamentals summary.
2. `GET /api/investments/assets/[symbol]`
   - Query params: `country`
   - Returns: asset + yearly fundamentals + yearly prices.
3. (Optional) `GET /api/investments/stats`
   - Returns computed aggregates for dashboard cards.

Implementation notes:

- Server-side query with Prisma.
- Compute “latest year” = max fundamentals year available.

Acceptance criteria:

- APIs return data quickly and with predictable shape.

---

### Milestone D — Auth: signup/login + protected dashboard

**Goal:** users must sign up / log in to access `/dashboard`.

Approach:

- `User` table in Postgres.
- Passwords hashed with `bcryptjs`.
- JWT issued with `jose`.

Pages:

- `/signup`
- `/login`

Routes:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout` (optional)
- `GET /api/auth/me` (optional)

Storage:

- Start simple: store token in `localStorage` to satisfy existing client-side `ProtectedRoute`.
- Upgrade later to secure cookies + middleware protection.

Acceptance criteria:

- Unauthenticated users are redirected to `/login`.
- Authenticated users can access `/dashboard`.

---

### Milestone E — Dashboard UI (Investments)

**Goal:** a real dashboard that shows assets, filters, and a detail view.

Suggested routes:

- `/dashboard` → overview cards and quick navigation
- `/dashboard/investments` → list/table + filters
- `/dashboard/investments/[symbol]?country=USA|BRAZIL` → detail page

List page UI:

- Filters: country, type, risk level, search
- Table columns:
  - Symbol, Name, Price, Dividend Yield
  - Latest ROE, Latest Margem Líquida
  - Dívida Líquida / EBITDA (computed)

Detail page UI:

- Year-by-year chart/table for:
  - Receita Líquida
  - Lucro Líquido
  - ROE
  - Margem Líquida
  - Dívida Líquida
  - EBITDA
  - Dividendos

Acceptance criteria:

- List is fast and filterable.
- Details show last 5 years and computed metrics.

---

### Milestone F — Analytics + “Is it good to buy?” scoring (educational)

**Goal:** teach users and provide a transparent evaluation.

Recommended computed metrics:

- **Debt to EBITDA** (latest year)
  - Formula: $\text{Dívida/EBITDA} = \frac{\text{Dívida Líquida}}{\text{EBITDA}}$
- **Profit margin** (already in CSV as `margem_liquida_*`)
- **Revenue growth** over 5y
  - Formula: $\frac{R_{2023} - R_{2019}}{R_{2019}}$
- **Dividend yield**
  - If dividend per share is known: $\text{Yield} = \frac{\text{Dividendo anual por ação}}{\text{Preço atual}}$
  - If CSV provides `dividend_yield`, treat as given.

“Good to buy” guidance (keep it educational, not financial advice):

- Show a rubric (green/yellow/red) with explanations:
  - ROE consistency
  - Margins stable or improving
  - Debt/EBITDA not excessive
  - Dividends sustainable

Acceptance criteria:

- Every score/label is explainable with formulas + the underlying numbers.

---

## 4) Data conventions

### Normalization

- Store numbers as `Float` in DB.
- Convert empty strings to `null`.
- Treat percent fields consistently:
  - Decide whether `roe` and margins are stored as “percent points” (e.g., 25.3) vs fractions (0.253).
  - Keep consistent and document it in the API response.

### Uniqueness

- An asset is uniquely identified by `(symbol, country)`.

### Years

- Import years: 2019–2023 from CSV.
- Display in the UI as a 5-year series.

---

## 5) Environment variables (expected)

- `DATABASE_URL` (Neon Postgres connection string)
- `JWT_SECRET` (when auth is implemented)

---

## 6) Developer commands (local)

- Install deps: `npm install`
- Prisma generate: `npm run db:generate`
- Create tables (dev): `npm run db:push`
- Seed from CSV: `npm run db:seed`
- Run app: `npm run dev`

---

## 7) Deliverables checklist

- [ ] Prisma schema (assets + fundamentals + prices)
- [ ] Seed/import script from `public/data`
- [ ] Investments API routes
- [ ] Auth pages + API
- [ ] Dashboard investments list + detail
- [ ] Educational calculation pages/panels

---

## 8) Next implementation order (recommended)

1. Finish DB + seed until the dataset is reliable
2. Build read-only Investments API
3. Build dashboard list/detail pages using the API
4. Add auth gating for dashboard
5. Add scoring + educational content
