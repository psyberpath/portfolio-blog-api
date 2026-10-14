# portfolio-blog-api

A backend API for a personal portfolio blog built with NestJS, PostgreSQL, Redis, and BullMQ. This project powers blog content management, user authentication, and background processing for newsletter subscriptions.

## Stack
- Language: TypeScript (NestJS)
- Database: PostgreSQL
- ORM: TypeORM
- Cache / Queues: Redis + BullMQ
- Validation: class-validator & class-transformer
- Logging: Winston

## Quick start (local)
1. Clone and install

```bash
git clone https://github.com/psyberpath/portfolio-blog-api.git
cd portfolio-blog-api
npm install
```

2. Create a local environment file

```bash
cp .env.example .env
# Edit .env to add your local DB/Redis values
```

3. (Optional) Start local infra

```bash
docker-compose up -d
```

4. Run migrations and start

```bash
npm run migration:run
npm run start:dev
```

The API will be available at http://localhost:3000

## Build / Production
Build with:

```bash
npm run build
```

The production entrypoint is `node dist/main`.

If deploying to Render or another platform, add the necessary environment variables in the platform's dashboard before deploying. The project expects environment variables for database and Redis connection, JWT secret, and bcrypt salt rounds (see `.env.example`).

## Contributing & Forking
- Feel free to fork this repository. When contributing, open a PR against the main branch.
- Keep sensitive credentials out of commits. Use `.env` locally and your platform's secret store for production.

## Tests
- Unit tests: `npm test`
- Integration tests (requires test DB): `npm run test:int`

## Files of interest
- src/ — application source
- data-source.ts — TypeORM datasource configuration
- docker-compose.yml — local Postgres / Redis for development
- Dockerfile — multi-stage Dockerfile for building and running

