# NestJS Blog API (Portfolio Backend)

> Production-ready, dockerized CMS backend built with NestJS, PostgreSQL, Redis, and BullMQ.

This repository is the backend API for the portfolio website and provides authentication, blog content management, and background processing for newsletter subscriptions.

## 🛠 Stack
- Language: TypeScript (NestJS)
- Database: PostgreSQL
- ORM: TypeORM
- Cache/Queues: Redis + BullMQ
- Validation: class-validator & class-transformer
- Logging: Winston (structured JSON)

## Quick start

Prerequisites:
- Node.js v18+
- Docker & Docker Compose (for local databases)

Install:
```bash
git clone https://github.com/psyberpath/portfolio-blog-api.git
cd portfolio-blog-api
npm install
```

Create a `.env` from `.env.example` (do not commit your `.env` file).

Run local infra (optional):
```bash
docker-compose up -d
```

Run DB migrations:
```bash
npm run migration:run
```

Start the app:
```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

Default app URL: http://localhost:3000

## Environment / Secrets
Do NOT put real credentials or secrets in README or committed files. Use `.env` for local development and your host/platform secret manager (Render, Heroku, Vercel, etc.) in production.

A `.env.example` is included with placeholder variable names; copy it to `.env` and fill in actual values locally. Immediately rotate any credentials that were previously published in this repository.

## API (high level)
- Authentication: /auth/register, /auth/login (passwords hashed with bcrypt)
- Posts: /posts (GET public; POST/PATCH/DELETE require Authorization: Bearer <token>)
- Newsletter: /newsletter/subscribe (enqueued to worker)
- Health: /health

## Tests
Unit and integration tests are available:
```bash
# unit tests
npm test

# integration tests (requires local infra)
npm run test:int
```

## Security & secrets guidance
- Never include DB passwords, API keys, or JWT secrets in README or committed files.
- Add `.env` to `.gitignore`.
- Use 12+ bcrypt salt rounds or configure via SALT_ROUNDS env var.
- Rotate any exposed secrets immediately.

For more details see SECURITY.md (new file added).
