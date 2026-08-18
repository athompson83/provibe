# Vercel Deployment Configuration

## Required project settings

This repository is a monorepo. The deployable web application is under `apps/web`.

Configure the Vercel project as:

```text
Framework Preset: Next.js
Root Directory: apps/web
Node.js Version: 24.x
```

Allow Vercel to use the Next.js framework defaults for the application output. Do not configure `public` or `.next` as a generic static Output Directory.

## Why this is required

The Vercel project was initially created when the repository contained only a README. As a result, Vercel stored no framework preset (`framework: null`) and currently treats the repository as a generic/static project. Once the monorepo was added, the code itself built successfully, but the generic deployment step looked for a `public` directory and failed with `STATIC_BUILD_NO_OUT_DIR`.

This is a project-settings mismatch, not a request to change ProVibe into a static site.

## Repository package management

Root `package.json` declares both pnpm and standard workspace metadata so CI and generic Git installers can resolve the full monorepo. When the Vercel Root Directory is `apps/web`, the web package also declares its complete Next.js/React dependencies directly.

## Verification after configuration

A valid preview must demonstrate:
1. Next.js framework detected.
2. Dependency installation succeeds.
3. `next build` succeeds.
4. Preview deployment reaches `READY`.
5. `/`, `/projects`, and `/projects/demo` render.
6. Interactive code-line explanation and Ask demo work client-side.

Do not promote a preview to production automatically as part of foundation setup.
