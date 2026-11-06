/**
 * Environment Variable Validation
 *
 * In production  → crashes immediately on any missing required variable.
 * In development → crashes on DB / JWT vars (nothing works without them),
 *                  warns on OAuth / Cloudinary vars so the server can still
 *                  start for local testing before those are configured.
 */

const isDev = process.env.NODE_ENV !== 'production';

/** Always required — the server cannot function without these. */
const ALWAYS_REQUIRED = [
  'PG_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CLIENT_URL',
];

/** Required in production; dev will warn and continue. */
const PROD_REQUIRED = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'CLOUDINARY_URL',
];

export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const v of ALWAYS_REQUIRED) {
    if (!process.env[v]) missing.push(v);
  }

  for (const v of PROD_REQUIRED) {
    if (!process.env[v]) {
      if (isDev) {
        warnings.push(v);
      } else {
        missing.push(v);
      }
    }
  }

  if (missing.length > 0) {
    const lines = missing.map((v) => `  - ${v}`).join('\n');
    console.error(
      `❌ Missing required environment variables:\n${lines}\n\n` +
        `Please set these in server/.env or your deployment platform.`
    );
    process.exit(1);
  }

  if (warnings.length > 0) {
    const lines = warnings.map((v) => `  - ${v}`).join('\n');
    console.warn(
      `⚠️  [DEV] The following variables are not set — related features will fail:\n${lines}`
    );
  }

  // JWT_SECRET strength check
  if ((process.env.JWT_SECRET ?? '').length < 32) {
    const msg = '⚠️  JWT_SECRET is too short (min 32 characters recommended)';
    if (isDev) {
      console.warn(msg);
    } else {
      console.error(`❌ ${msg}`);
      process.exit(1);
    }
  }

  // PORT range check
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      console.error(`❌ Invalid PORT: ${process.env.PORT}. Must be 1–65535`);
      process.exit(1);
    }
  }

  console.log('✓ Environment validation passed');
}
