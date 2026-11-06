# Tasks: Revive & Deploy

## Status

All Phase 1 & 2 build-stabilization tasks are complete.

---

## Completed

- [x] **F1** Pin `server/package.json` TypeScript to `~5.8.3`
- [x] **F2** Add `@vercel/speed-insights` to `client/package.json`
- [x] **F3** Remove unused `SpeedInsights` import from `App.tsx`
- [x] **F4** Fix `authService.ts` import path (`../utils/api` → `./api`)
- [x] **F5** Export `AuthUser` type; align `login`/`signup` signatures in `authService.ts`
- [x] **F6** Rename `utils/variables.js.ts` → `variables.ts`; update `main.tsx` import
- [x] **F7** Align `.env.example` files to use `CLOUDINARY_URL` format
- [x] **F8** Add `JWT_REFRESH_SECRET` to root `.env.example`
- [x] **F9** Set `password: allowNull: true` in User model (OAuth users)
- [x] **F10** Set `DEV_BYPASS_AUTH = false` in `ProtectedRoute.tsx`
- [x] **F11** Remove `@supabase/supabase-js` and `@vercel/analytics` from root `package.json`
- [x] **F12** Replace `multer-storage-cloudinary@4` with Cloudinary v2 `upload_stream` in `middleware/upload.ts`
- [x] `npm install` — server ✅ exit 0
- [x] `npm install` — client ✅ exit 0
- [x] `npm run build` — client ✅ exit 0 (139 modules, 2.45s)
- [x] `npm run build` — server ✅ exit 0 (`dist/app.js` emitted)

### Runtime verification (Phase 3)

- [x] **db.ts** — Fixed `require('dotenv').config()` → `import 'dotenv/config'`; moved `PG_URI` guard before `new Sequelize(...)` constructor so undefined env crashes predictably with a clear message instead of an opaque Sequelize throw
- [x] **app.ts** — Moved `cors()` before `helmet()` so preflight OPTIONS requests receive CORS headers before Helmet responds; removed duplicate `cors()` call
- [x] **auth.routes.ts** — Fixed `CLIENT_URL` redirect: introduced `primaryClientUrl()` helper that takes only the first comma-separated entry, preventing a broken multi-origin URL in `failureRedirect` and the success redirect
- [x] `npm run build` — server ✅ exit 0 (post runtime-verification fixes)

---

## Remaining (pre-production)

- [ ] Create `server/.env` from `server/.env.example` with real credentials
- [ ] Create `client/.env.local` from `client/.env.example` with production `VITE_API_URL`
- [ ] Run DB migrations / verify `sequelize.sync` against a live Postgres instance
- [ ] Set up Google OAuth credentials and update `GOOGLE_CALLBACK_URL` for production domain
- [ ] Configure Cloudinary account and populate `CLOUDINARY_URL`
- [ ] Wire up a migration runner (Sequelize CLI / Umzug) for schema changes
- [ ] Deploy backend to Vercel (server) and frontend to Vercel (client)
