# Requirements: Revive & Deploy – Phase 1 & 2 Audit

## Overview
Full read-only audit of the Job Referral Network System (RefNet), covering both the
`client/` (Vite + React 19) and `server/` (Express + Sequelize + TypeScript) workspaces.
Goal: surface every issue that prevents `npm run build` from passing in either workspace,
and document every environment variable required for the system to start.

---

## R1 – Language & Runtime Detection

| Item | Value |
|---|---|
| Host Node.js | v26.9.0 |
| Host npm | 11.19.1 |
| Client build toolchain | Vite 7.x, TypeScript ~5.8.3, React 19 |
| Server build toolchain | tsc (TypeScript **^6.0.3**), CommonJS output |
| Server runtime target | Node 20.x (declared in `server/vercel.json`) |
| Database | PostgreSQL via Sequelize 6 (pg ^8.20) |
| Auth session store | express-session (in-memory default; Redis optional) |
| File storage | Cloudinary (multer-storage-cloudinary) |
| Cache/queue | None required at startup; Redis optional |

### Entry points
- **Client:** `client/src/main.tsx` → `App.tsx` → `RouterView`
- **Server:** `server/app.ts` (ESM-style imports, compiled to CJS `dist/app.js`)

---

## R2 – Environment Variables

### Server (`server/.env`)

| Variable | Required | Notes |
|---|---|---|
| `PG_URI` | **YES** | Validated at startup; crashes if absent |
| `JWT_SECRET` | **YES** | Min 32 chars; validated at startup |
| `JWT_REFRESH_SECRET` | **YES** | Used in auth routes & service; **missing from root `.env.example`** |
| `SESSION_SECRET` | recommended | Falls back to JWT_SECRET; warning only |
| `GOOGLE_CLIENT_ID` | **YES** | Passport GoogleStrategy |
| `GOOGLE_CLIENT_SECRET` | **YES** | Passport GoogleStrategy |
| `GOOGLE_CALLBACK_URL` | optional | Falls back to `API_URL` + path |
| `CLOUDINARY_URL` | **YES** | Auto-read by Cloudinary SDK |
| `CLIENT_URL` | **YES** | CORS + OAuth redirect |
| `API_URL` | optional | Used only for OAuth callback URL derivation |
| `PORT` | optional | Defaults 5000→5001→5002 |
| `NODE_ENV` | optional | Defaults to implicit undefined (treated as development) |
| `REDIS_URL` | optional | Only if you switch sessions to Redis |

### Client (`client/.env.local`)

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | **YES** | Defaults to `http://localhost:5000/api` if absent, but must be set for production |
| `VITE_GOOGLE_CLIENT_ID` | optional | Documented in `.env.example` but not consumed by current source |

---

## R3 – Build-Breaking Issues

### B1 (CRITICAL) – `node_modules` absent in both workspaces
Neither `client/node_modules` nor `server/node_modules` exists.
`npm run build` cannot start without `npm install` in each workspace first.

### B2 (CRITICAL) – Server TypeScript version conflict
`server/package.json` declares `"typescript": "^6.0.3"` as a devDependency.
TypeScript 6 is an **unreleased / pre-release version** that does not exist on npm as of this audit.
The latest stable release is TypeScript 5.8.x. `npm install` will fail or resolve to an unexpected version.

### B3 (CRITICAL) – `@vercel/speed-insights` missing from client dependencies
`App.tsx` line 2 imports `@vercel/speed-insights/react` but the package is absent from
`client/package.json`. Vite build will abort with a module-not-found error.

### B4 (HIGH) – `authService` API mismatch (wrong import path + signature)
`client/src/services/authService.ts` imports `api` from `'../utils/api'` (resolves to
`src/utils/api.ts` — which does **not exist**; the actual file is `src/services/api.ts`).
This will produce a TypeScript/Vite resolution error at build time.

Additionally, the `authService.login` signature is `(email, password)` but
`useAuthStore` calls `authService.login({ email, password, role })` — an object, not
positional arguments. Same for `signup`: `authService` has no `signup` method at all,
but `useAuthStore` calls `authService.signup(...)`.

### B5 (HIGH) – `AuthUser` type not exported from `authService`
`useAuthStore.ts` imports `type AuthUser` from `'../services/authService'`, but
`authService.ts` never defines or exports an `AuthUser` type.
With `strict: true` in `tsconfig.app.json` this is a compile error.

### B6 (MEDIUM) – `main.tsx` imports `./utils/variables.js` (wrong extension)
`main.tsx` has `import './utils/variables.js'`.  The actual file is named
`variables.js.ts` (TypeScript).  Vite will attempt to resolve the bare `.js` name first;
with `moduleResolution: bundler` and no matching `.js` file this silently becomes an
extension-stripped lookup — but the double-extension filename (`variables.js.ts`) is
unusual and may confuse the resolver depending on Vite version.

### B7 (MEDIUM) – Server `typescript@^6` blocks `ts-jest@^29`
`ts-jest ^29.x` only supports TypeScript up to 5.x. If TypeScript 6 somehow resolves,
`ts-jest` and therefore `jest` will fail to configure. This is secondary to B2.

### B8 (MEDIUM) – `multer@^2.1.1` / `multer-storage-cloudinary@^4.0.0` compatibility
`multer-storage-cloudinary ^4` officially targets multer 1.x. multer 2.x changed the
internal API surface; the `CloudinaryStorage` constructor params object shape may break
at runtime even if the TypeScript build passes.

### B9 (LOW) – Root `package.json` lists duplicate / shadow dependencies
The root-level `package.json` re-declares `cloudinary`, `multer`, `cookie-parser`,
`@vercel/analytics`, and `@supabase/supabase-js` (the latter never referenced anywhere
in source). These shadow the workspace copies and can cause version mismatches when
tools hoist them. `@supabase/supabase-js` appears to be a leftover from an earlier
design that was replaced by Sequelize + direct PostgreSQL.

### B10 (LOW) – `SpeedInsights` component imported but never rendered
`App.tsx` imports `SpeedInsights` (line 2) but the JSX never renders `<SpeedInsights />`.
The dead import still causes a build failure because the package is missing (B3).
Once B3 is resolved, this becomes a harmless unused-import warning (and with
`noUnusedLocals: true` it will be a TypeScript error).

---

## R4 – Additional Observations (non-blocking at build time)

- **`validateEnv` requires `CLOUDINARY_URL`** but the root `.env.example` documents
  `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` instead.
  Only one format is valid at runtime; the two `.env.example` files are inconsistent.
- **`sequelize.sync({ force: false, alter: false })`** on every boot is safe but
  will not apply new migration files placed in `/migrations`. A proper migration runner
  (Sequelize CLI or Umzug) should be wired up before production.
- **`DEV_BYPASS_AUTH = true`** is hardcoded in `ProtectedRoute.tsx`. All protected routes
  are publicly accessible. Must be set to `false` before any deployment.
- **`password` column has `allowNull: false`** in the User model, but OAuth users are
  created with `password: null`. This will cause a Sequelize validation error for all
  Google Sign-In registrations at runtime.
- **`utils/variables.js.ts`** is a DOM-manipulation script auto-generated from Figma/Pixso.
  It uses `document.addEventListener` which is safe in a browser bundle, but the
  double-extension filename should be normalised.
