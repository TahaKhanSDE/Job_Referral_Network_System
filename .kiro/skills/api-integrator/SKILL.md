---
name: api-integrator
description: Audits and configures REST routes, JWT refresh/access token lifecycles, Google OAuth flows, CORS credentials, and Cloudinary media streams.
---
# API & Auth Directives
- Strict CORS enforcement: verify origin arrays, allowed methods, headers, and `credentials: true`.
- Maintain secure cookie configurations (`httpOnly`, `sameSite`, `secure`).
- Handle Google OAuth redirection logic safely for both localhost and production domains.
- Ensure stream-based file upload pipelines (`upload_stream`) populate file paths without blocking event loop memory.
