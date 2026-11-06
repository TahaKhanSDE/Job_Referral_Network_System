---
name: performance-optimizer
description: Optimizes Vite client bundle size, tree-shaking, lazy-loading routes, and server memory footprint.
---
# Performance Directives
- Identify large dependencies or un-treeshaken libraries in client bundles.
- Check React component split points (`React.lazy`, dynamic `import()`) for major routes.
- Eliminate unused imports and dead code flags (`noUnusedLocals`, `noUnusedParameters`).
- Ensure static assets and public assets are cleanly handled without bloat.
