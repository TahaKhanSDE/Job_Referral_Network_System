# Project Stabilization & Deployment Directive

## Agent Operating Constraints
- Mode: Spec-Driven / Audit First.
- DO NOT modify any application code, install packages, or delete files until the Phase 1 & 2 gap analysis report is delivered and explicitly approved.

## Objectives
1. Architecture & Dependency Audit:
   - Identify language runtimes, lockfile state, and framework versions.
   - Scan for all environment variables (`process.env` / `os.environ`).
   - Identify required backing infrastructure (PostgreSQL, Redis, RabbitMQ, external APIs).
2. Gap Analysis & Spec Plan:
   - Assess build blockers, missing secrets, and runtime version deprecations.
   - Formulate a sequenced, minimal-churn execution plan to achieve a passing build.
3. Execution (Post-Approval):
   - Generate `.env.example`.
   - Resolve dependency installation and syntax/build errors.
   - Run verification builds and specify production deployment configuration.
