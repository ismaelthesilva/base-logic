# My Monorepo

This monorepo contains two applications and three shared packages, organized as follows:

## Applications

- **Web Application** (`apps/web`):

  - A React-based web application.
  - Entry point: `apps/web/src/app.tsx`
  - Configuration: `apps/web/package.json`
  - TypeScript configuration: `apps/web/tsconfig.json`

- **Admin Application** (`apps/admin`):
  - A React-based admin interface.
  - Entry point: `apps/admin/src/app.tsx`
  - Configuration: `apps/admin/package.json`
  - TypeScript configuration: `apps/admin/tsconfig.json`

## Packages

- **UI Package** (`packages/ui`):

  - Contains reusable UI components and utilities.
  - Entry point: `packages/ui/src/index.ts`
  - Configuration: `packages/ui/package.json`
  - TypeScript configuration: `packages/ui/tsconfig.json`

- **DB Package** (`packages/db`):

  - Contains database models and utilities.
  - Entry point: `packages/db/src/index.ts`
  - Configuration: `packages/db/package.json`
  - TypeScript configuration: `packages/db/tsconfig.json`

- **Shared Package** (`packages/shared`):
  - Contains shared utilities and types.
  - Entry point: `packages/shared/src/index.ts`
  - Configuration: `packages/shared/package.json`
  - TypeScript configuration: `packages/shared/tsconfig.json`

## Turbo Configuration

- **Turbo**: The monorepo is configured with Turbo for efficient builds and development. The configuration file is located at `turbo.json`.

## Root Configuration

- The root configuration file for the monorepo is located at `package.json`, which manages dependencies and scripts for the entire project.

## Getting Started

To get started with the monorepo, follow these steps:

1. Clone the repository.
2. Install dependencies for all applications and packages.
3. Run the desired application using the provided scripts in their respective `package.json` files.

For more detailed instructions, refer to the individual application and package documentation.
