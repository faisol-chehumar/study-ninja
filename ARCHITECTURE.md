# 🏗️ Architecture & Tech Stack

## Overview

Study Ninja is built as a modern, scalable monorepo architecture optimized for clarity, maintainability, and CI/CD automation.

---

## 🔧 Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Testing**:
  - React Testing Library (user-oriented tests)
  - Jest (unit testing framework)

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Testing**:
  - Jest (unit/service layer)
  - Supertest (API and E2E tests)
- **Database (by use case)**:
  - **PostgreSQL**: Structured and relational data
  - **MongoDB**: Flexible or document-heavy models
  - **Redis**: In-memory cache and session management

### Deployment

- **Platform**: [DigitalOcean](https://www.digitalocean.com/)
- **Containers**: All apps and services run in Docker
- **Configuration**: Managed via `.env` and GitHub Secrets

### CI/CD

- **Provider**: [GitHub Actions](https://docs.github.com/en/actions)
- **Workflow**:
  - Run tests, lint, and build Docker images
  - Push to DigitalOcean Container Registry
  - Deploy via webhook or DigitalOcean API

---

## 🧱 Architecture Principles

- **Monorepo Structure**:

  - Single repo contains frontend, backend, and shared libraries.
  - Promotes consistency, reusability, and version alignment.

- **Dockerized Everything**:

  - Local development and production run through Docker.
  - Enables isolated environments and simple onboarding.

- **CI/CD Integration**:

  - Every commit is validated through automated tests.
  - Pull requests are linked to tasks and deployed after merge.

- **Database Providers**:
  - Managed DB instances to offload ops overhead.
  - Environment-specific credentials managed securely.

---

## ✅ Development Guidelines

- **Simple over complex**: Avoid premature abstraction and unneeded cleverness.
- **Readable over over-engineered**: Code should be easily understood by any team member.
- **Explicit over implicit**: Prefer clear, verbose logic to magic behavior.
- **Stable dependencies**: Use mature packages with strong ecosystem support.
- **Security-first**: Inputs are validated and all services follow least-privilege principles.

---

## 🔄 Deployment Flow (High-level)

1. Claude generates tasks and test scaffolds.
2. Genmini CLI generates code and runs tests.
3. GitHub CLI creates issues and branches (thunk-based naming).
4. Feature branches go through CI checks.
5. On completion, PRs are squash-merged into `main` and old branches are deleted.
6. Docker image is built and deployed to DigitalOcean.
