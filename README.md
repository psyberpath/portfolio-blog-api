# NestJS Blog API (Portfolio Backend)

> A production-grade, dockerized CMS backend built with NestJS, PostgreSQL, Redis, and BullMQ.

This is the backend API for the **Didara Portfolio**. It provides secure authentication, content management for blog posts, and an asynchronous job queue for newsletter subscriptions.

## 🛠 Tech Stack

* **Framework:** NestJS (TypeScript)
* **Database:** PostgreSQL (v15)
* **ORM:** TypeORM (with Migrations)
* **Caching:** Redis (via `@nestjs/cache-manager`)
* **Queues:** BullMQ (Redis-backed background jobs)
* **Validation:** `class-validator` & `class-transformer`
* **Logging:** Winston (Structured JSON logging)
* **Deployment:** Docker & Render

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* Docker & Docker Compose

### 2. Installation

```bash
# Clone the repo
git clone [https://github.com/yourusername/nest-blog-api.git](https://github.com/yourusername/nest-blog-api.git)

# Install dependencies
npm install
````

### 3\. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=blog_user
DB_PASSWORD=blog_password
DB_NAME=blog_db

# Test Database (for Integration Tests)
TEST_DB_HOST=localhost
TEST_DB_PORT=5433
TEST_DB_USERNAME=blog_user_test
TEST_DB_PASSWORD=blog_password_test
TEST_DB_NAME=blog_db_test

# Redis Configuration (Cache & Queues)
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=redis_password (Optional locally, required for prod)

# Authentication
JWT_SECRET=super_secret_random_string_here

# Environment
NODE_ENV=development
PORT=3000
```

### 4\. Running Infrastructure (Docker)

Start the Postgres and Redis containers:

```bash
docker-compose up -d
```

### 5\. Database Migrations

Initialize the database schema:

```bash
# Run migrations
npm run migration:run
```

### 6\. Start the Server

```bash
# Development mode (Watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

API will run on `http://localhost:3000`.

-----

## 🔌 API Documentation

### Base URL

  * **Local:** `http://localhost:3000`
  * **Production:** `https://nest-blog-api-5t4u.onrender.com`

### 1\. Authentication

> **Note:** Passwords are hashed using bcrypt.

  * **Register (Admin)**
      * `POST /auth/register`
      * **Body:** `{ "email": "admin@example.com", "password": "securePassword123" }`
  * **Login**
      * `POST /auth/login`
      * **Body:** `{ "email": "admin@example.com", "password": "securePassword123" }`
      * **Response:** `{ "accessToken": "eyJhbGci..." }`

### 2\. Blog Posts

> **Public Access:** Anyone can read.
> **Admin Access:** Create/Update/Delete requires `Authorization: Bearer <token>`.

  * **Get All Posts (Public)**
      * `GET /posts`
      * **Note:** Responses are cached via Redis for 10 minutes.
  * **Get Single Post (Public)**
      * `GET /posts/:slug`
  * **Create Post (Protected)**
      * `POST /posts`
      * **Header:** `Authorization: Bearer <token>`
      * **Body:** `{ "title": "My New Post", "content": "HTML or Markdown content here" }`
  * **Update Post (Protected)**
      * `PATCH /posts/:id`
      * **Body:** `{ "title": "Updated Title" }` (Partial update)
  * **Delete Post (Protected)**
      * `DELETE /posts/:id`

### 3\. Newsletter (Background Jobs)

> Uses BullMQ to process subscriptions asynchronously.

  * **Subscribe**
      * `POST /newsletter/subscribe`
      * **Body:** `{ "email": "reader@gmail.com" }`
      * **Behavior:** Returns immediate success. Worker processes the email after a 5-second simulated delay.

### 4\. System Health

  * **Health Check:** `GET /health` (Checks DB connection status).

-----

## 🧪 Testing

The project includes both Unit and Integration tests.

```bash
# Run Unit Tests (Isolated Service logic)
npm test

# Run Integration Tests (Real DB connection via Docker)
# Note: Requires docker-compose up -d to be running
npm run test:int
```

-----

## 📦 Deployment (Render)

This project is configured for deployment on **Render**.

1.  **Build Command:** `npm install && npm run build`
2.  **Start Command:** `npm run start:prod`
3.  **Environment Variables:** Set `NODE_ENV=production` to enable SSL for database connections.