# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
npm run dev          # Next.js dev server
npm run dev:full     # Dev + Prisma Studio + Vitest concurrently
```

### Build & Lint

```bash
npm run build        # Prisma generate + Next.js build
npm run lint:check   # Prettier check (CI uses this)
npm run lint:fix     # Auto-format with Prettier
```

### Testing

```bash
npm test             # Run Vitest once
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report (80% line/function threshold)
```

Run a single test file:

```bash
npx vitest run src/lib/investments.test.ts
```

### Database

```bash
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:studio    # Open Prisma Studio UI
npm run db:seed      # Seed database from prisma/seed.js
npm run db:push      # Push schema without migration (dev only)
```

### Commits

```bash
npm run commit       # Commitizen interactive prompt (conventional commits enforced)
```

## Architecture

This is a **full-stack Next.js 16 App Router application** with investment/finance tracking features, multi-language support, and dark mode.

### Directory Structure

```
src/
├── app/             # Next.js App Router pages + API routes
│   ├── api/         # REST endpoints: auth/, finance/, investments/
│   ├── dashboard/   # Protected pages: finance/, investments/
│   └── ...          # Marketing pages: about, contact, services, etc.
├── components/
│   └── ui/          # shadcn/ui components (Radix UI + CVA)
├── contexts/        # LanguageContext (i18n), ThemeContext (dark/light)
├── lib/             # auth.ts (JWT), prisma.ts (client), investments.ts, format.ts
└── locales/         # en.json, pt.json translations
```

### Authentication

Custom JWT auth using `jose` + `bcryptjs` — **not NextAuth**. Tokens are signed via `lib/auth.ts` (`signUserToken`, `verifyUserToken`). Despite `NEXTAUTH_URL` in `.env`, this codebase uses its own auth layer.

### Internationalization

Context-based i18n (no i18next). `LanguageContext` in `src/contexts/` reads/writes to `localStorage`, with SSR-safe defaults. Translations live in `src/locales/en.json` and `src/locales/pt.json`.

### Database

Prisma 6 with Neon (serverless PostgreSQL). Key models: `User`, `Asset`, `Fundamentals`, `AssetPrice`, `Share`, `FinanceTransaction`. Schema at `prisma/schema.prisma`.

### UI Components

Radix UI headless primitives wrapped in shadcn-style components under `src/components/ui/`. Use `class-variance-authority` for variants and `tailwind-merge`/`clsx` for conditional classes.

### Theme

`ThemeContext` manages dark/light mode via `localStorage` + system preference. Avoid inline styles for theme-sensitive values; use Tailwind `dark:` variants.

### Testing

Vitest with Happy DOM. Tests live at `src/**/*.test.ts`. Coverage excludes: `prisma.ts`, `auth.ts`, `csv-utils.ts`, `utils.ts`.

## Environment Variables

```env
DATABASE_URL=       # Neon PostgreSQL pooled connection string
JWT_SECRET=         # Generate with: openssl rand -base64 64
NEXTAUTH_URL=       # http://localhost:3000 (used for URL building, not NextAuth)
```

## Key Dependencies

| Purpose    | Library                   |
| ---------- | ------------------------- |
| Forms      | react-hook-form + yup     |
| HTTP       | axios                     |
| PDF export | jsPDF + jspdf-autotable   |
| CSV        | Papa Parse                |
| Email      | EmailJS                   |
| CAPTCHA    | @marsidev/react-turnstile |
| AI         | openai                    |
