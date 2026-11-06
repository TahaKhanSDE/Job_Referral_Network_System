# Design: Prioritized Fix Plan to Pass `npm run build`

> **Scope:** Non-destructive fixes only. No architectural changes. No feature additions.
> All edits are the minimum needed to let `npm run build` pass in both workspaces.
> Awaiting approval before any file is touched.

---

## Fix Priority Legend

| Priority | Label | Effect |
|---|---|---|
| P0 | Build-fatal | `npm install` or `npm run build` cannot complete without this fix |
| P1 | Build-error | Build completes `npm install` but TypeScript/Vite aborts with an error |
| P2 | Runtime-fatal | Build passes but the app crashes immediately at startup |
| P3 | Runtime-bug | App starts but a feature is broken |

---

## Phase 1 – Get `npm install` to succeed (P0)

### Fix 1 — Pin server TypeScript to 5.8.x *(P0, server)*
**File:** `server/package.json`
**Change:** `"typescript": "^6.0.3"` → `"typescript": "~5.8.3"`
**Why:** TypeScript 6 does not exist on npm. `npm install` either errors or resolves
nothing. Pinning to the same minor as the client (5.8.x) is safe and consistent.
Side-effect: also unblocks `ts-jest@^29` which only supports TS ≤ 5.

---

## Phase 2 – Get `npm run build` to pass (P1)

### Fix 2 — Add `@vercel/speed-insights` to client dependencies *(P1, client)*
**File:** `client/package.json`
**Change:** Add `"@vercel/speed-insights": "^1.0.0"` (or latest stable) to `dependencies`.
**Why:** `App.tsx` imports `@vercel/speed-insights/react`; Vite hard-fails on missing
modules. This is a one-line `package.json` addition.

### Fix 3 — Remove dead `SpeedInsights` import from `App.tsx` *(P1, client)*
**File:** `client/src/App.tsx`
**Change:** Remove the unused `import { SpeedInsights }` line.
**Why:** After Fix 2 the package exists, but the component is never rendered.
With `noUnusedLocals: true` in `tsconfig.app.json` this is a TypeScript compile error.
Alternatively, render `<SpeedInsights />` inside the JSX — but since there is no intent
to use it, removal is cleaner.

### Fix 4 — Fix `authService` import path *(P1, client)*
**File:** `client/src/services/authService.ts`
**Change:** `import { api } from '../utils/api'` → `import { api } from './api'`
(or equivalently `'../services/api'` from a sibling file — both resolve to
`client/src/services/api.ts`).
**Why:** `src/utils/api.ts` does not exist. The axios instance lives in `src/services/api.ts`.

### Fix 5 — Align `authService` signatures with `useAuthStore` calls *(P1, client)*
**File:** `client/src/services/authService.ts`
**Changes:**
1. Add `AuthUser` type export (currently imported by `useAuthStore` but never defined).
2. Change `login(email, password)` → `login({ email, password, role })` to match the
   object-argument call in `useAuthStore`.
3. Add `signup({ name, email, password, role })` method that does not currently exist.
**Why:** TypeScript strict mode (`strict: true`) will error on the type import and on
the argument-shape mismatch.

### Fix 6 — Rename `variables.js.ts` → `variables.ts` *(P1, client)*
**File:** `client/src/utils/variables.js.ts` → `client/src/utils/variables.ts`
**Change:** Also update the import in `main.tsx`: `'./utils/variables.js'` → `'./utils/variables'`
**Why:** The double-extension name is non-standard. With `noUncheckedSideEffectImports: true`
and `moduleResolution: bundler`, Vite may fail to resolve `./utils/variables.js` when
no file with that exact name exists.

---

## Phase 3 – Prevent startup crashes (P2)

These are not required for `npm run build` but will crash the app immediately on first run.

### Fix 7 — Align `.env.example` for `CLOUDINARY_URL` vs split keys *(P2, server)*
**Files:** root `.env.example`, `server/.env.example`
**Change:** The root file documents `CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET`
while `env.validation.ts` requires `CLOUDINARY_URL`.
Standardise on `CLOUDINARY_URL` format in both example files, add a note that the
SDK auto-reads it.

### Fix 8 — Add `JWT_REFRESH_SECRET` to root `.env.example` *(P2, server)*
**File:** `.env.example` (root)
**Change:** Add `JWT_REFRESH_SECRET=` entry.
**Why:** `env.validation.ts` requires it and crashes if absent, but the root example
file omits it entirely.

### Fix 9 — Allow `password: null` in User model for OAuth users *(P2, server)*
**File:** `server/models/pg/user.ts`
**Change:** Set `allowNull: true` on the `password` column (and remove the `len`
validator, or guard it with `allowNull`).
**Why:** Google OAuth registration passes `password: null`. Sequelize's `allowNull: false`
throws a ValidationError before any row is inserted.

---

## Phase 4 – Pre-deployment hardening (P3)

These are not build blockers but must be done before any deployment.

### Fix 10 — Disable `DEV_BYPASS_AUTH` *(P3, client)*
**File:** `client/src/components/ProtectedRoute.tsx`
**Change:** `const DEV_BYPASS_AUTH = false`
**Why:** All protected routes are world-accessible. Must be off in production.

### Fix 11 — Clean up root `package.json` *(P3, root)*
**File:** `package.json` (root)
**Change:** Remove `@supabase/supabase-js`, `@vercel/analytics`, and any package that
is already declared in the correct workspace (`server/package.json` or
`client/package.json`). Supabase is unused anywhere in source.

### Fix 12 — Verify `multer-storage-cloudinary` compatibility with multer 2 *(P3, server)*
**Research/Change:** Test whether the `CloudinaryStorage` constructor works with
`multer ^2.1.1`. If it fails, either pin `multer` back to `^1.4.5` or switch to the
official `cloudinary` SDK's upload stream in the controller directly.

---

## Execution Order

```
Fix 1 (TS version pin)
  └─ npm install (server + client)
        ├─ Fix 2 (add speed-insights dep)  ──► npm install client
        ├─ Fix 3 (remove dead import)
        ├─ Fix 4 (fix authService path)
        ├─ Fix 5 (align authService sigs)
        ├─ Fix 6 (rename variables file)
        └─ npm run build client   ← should pass
Fix 7–9 (env + model)
        └─ npm run build server   ← should pass
Fix 10–12 (pre-deploy hardening)
```

---

## Files to be modified (summary)

| File | Fix(es) |
|---|---|
| `server/package.json` | F1 |
| `client/package.json` | F2 |
| `client/src/App.tsx` | F3 |
| `client/src/services/authService.ts` | F4, F5 |
| `client/src/utils/variables.js.ts` (rename) | F6 |
| `client/src/main.tsx` | F6 (update import) |
| `.env.example` (root) | F7, F8 |
| `server/.env.example` | F7 |
| `server/models/pg/user.ts` | F9 |
| `client/src/components/ProtectedRoute.tsx` | F10 |
| `package.json` (root) | F11 |
| `server/middleware/upload.ts` | F12 (TBD after testing) |
