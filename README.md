# Example Project

## Overview

This project demonstrates a modern, modular architecture with autonomous user activity tracking, personal productivity tools (Habits and Todos), and full financial transaction support.  
It is built with Next.js, Drizzle ORM, tRPC, and Postgres (Dockerized for local development).

## Features

   **User Management** (roles, permissions, CRUD)
   **Habits** (tracking, analytics, recommendations)
   **Todos** (task management, analytics)
   **Financial Transactions** (income/expense, analytics, categories)
   **Autonomous User Activity Tracker** (sessions, events, module/API usage, aggregation)
   **Modern stack**: Next.js, Drizzle ORM, tRPC, Zod, Postgres, Docker

## Getting Started

### 1. Start the database (PostgreSQL via Docker):

```bash
./start-database.sh
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Apply database migrations:

```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

### 4. Run the development server:

```bash
npm run dev
```

### 5. Open the application

Visit [http://localhost:3000](http://localhost:3000)  
You can test API endpoints and tracker features via the main page (or `/dashboard` if implemented).

## API Overview

### All business logic is implemented as modular tRPC routers:
  1 `user`: User management (CRUD, roles, permissions)
  2 `habit`: Habit management and analytics
  3 `todo`: Task management and analytics
  4 `transaction`: Financial operations and reporting
  5 `tracker`: Autonomous user session and event tracking

See `src/server/api/routers/` for details.

## Data Model

   **User**: id, email, name, role, createdAt
   **Habit**: id, userId, title, description, isPublic, createdAt
   **HabitCheck**: id, habitId, checkedAt
   **Todo**: id, userId, title, completed, completedAt, createdAt, category
   **Transaction**: id, userId, type, amount, currency, category, description, relatedTo, createdAt, meta
   **UserTracker**: id, userId, sessionId, startedAt, endedAt
   **UserTrackerEvent**: id, trackerId, eventType, module, route, apiRoute, usedAt, meta

All models are defined in [`src/server/db/schema.ts`](src/server/db/schema.ts).

## User Activity Tracker

   Tracks sessions and all interactions (pages, modules, API calls).
   Events are stored in the database and can be aggregated per user/session/module.
   Example aggregations: total time spent, modules used, most frequent API calls.
   See `trackerRouter` in [`src/server/api/routers/tracker.ts`](src/server/api/routers/tracker.ts).

## Financial Transactions

   Track and categorize income, expenses, and transfers.
   Analytics: total by type/category, dynamic reports, relation to habits or todos.
   See `transactionRouter` in [`src/server/api/routers/transaction.ts`](src/server/api/routers/transaction.ts).

## Analytics and Aggregation

   All entities support analytics endpoints (via tRPC queries).
   Easily extendable for dashboards, BI integrations, or exports.

## Security

   Role-based access for user/admin actions.
   Input validation and error handling via Zod schemas.

## Project Structure

```
├── src/server/db/schema.ts          # Data models (Drizzle ORM, Postgres)
├── src/server/api/routers/          # All tRPC routers (API logic)
├── src/server/api/root.ts           # Root tRPC router
├── src/server/db/index.ts           # Drizzle DB init
├── src/app/                         # Next.js app, page components
├── start-database.sh                # Postgres launch script (Docker)
├── ... (configs, styles, etc.)
```

## All Tree Map

```
├── README.md                  # Instructions for launch and testing, tracker and transactions description
├── drizzle
│   ├── 0000_gray_hardball.sql
│   ├── 0001_fat_martin_li.sql
│   └── meta
│       ├── 0000_snapshot.json
│       ├── 0001_snapshot.json
│       └── _journal.json
├── drizzle.config.ts          # Drizzle ORM configuration
├── eslint.config.ts
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.ts
├── prettier.config.ts
├── public
│   └── favicon.ico
├── src
│   ├── app
│   │   ├── UI
│   │   │   └── card.tsx
│   │   ├── _components         # UI components
│   │   │   ├── HabitList.tsx
│   │   │   ├── SeedDashboard.tsx
│   │   │   ├── TodoList.tsx
│   │   │   ├── UserCard.tsx
│   │   │   └── post.tsx
│   │   ├── api
│   │   │   └── trpc
│   │   │       └── [trpc]
│   │   │           └── route.ts # tRPC entry point for Next.js API
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── habit
│   │   │   └── page.tsx
│   │   ├── hooks
│   │   │   └── useMobile.tsx
│   │   ├── layout.tsx
│   │   ├── lib
│   │   │   ├── config
│   │   │   ├── constants
│   │   │   └── utils
│   │   │       └── stMerge.ts
│   │   ├── page.tsx            # Main page (for testing endpoints)
│   │   ├── todo
│   │   │   └── page.tsx
│   │   ├── tracker
│   │   │   ├── page.tsx
│   │   │   └── users
│   │   │       └── page.tsx
│   │   └── transaction
│   │       └── page.tsx
│   ├── env.js
│   ├── features
│   │   └── tracker
│   │       └── UI
│   │           └── trackerList.tsx
│   ├── server
│   │   ├── api
│   │   │   ├── interfaces.ts
│   │   │   ├── root.ts         # Root tRPC router
│   │   │   ├── routers
│   │   │   │   ├── habit.ts    # Habit router
│   │   │   │   ├── post.ts
│   │   │   │   ├── todo.ts     # Todo router
│   │   │   │   ├── tracker.ts  # Activity tracker router
│   │   │   │   ├── transaction.ts # Financial transaction router
│   │   │   │   └── user.ts     # User router (roles, CRUD)
│   │   │   ├── trpc.ts
│   │   │   └── types
│   │   └── db
│   │       ├── index.ts        # Drizzle initialization and export
│   │       ├── schema.ts       # All data schemas (user, habit, todo, tracker, transaction)
│   │       ├── seeds.ts
│   │       └── types
│   │           └── schemas.ts
│   ├── styles
│   │   └── globals.css
│   └── trpc
│       ├── query-client.ts
│       ├── react.tsx
│       └── server.ts
├── start-database.sh          # Script to launch DB in Docker
├── tsconfig.json
└── yarn.lock
```

## LIST OF RELATIONS

```
                    List of relations
 Schema |            Name             | Type  |  Owner   
--------+-----------------------------+-------+----------
 public | t3-empty_habit              | table | postgres
 public | t3-empty_habit_check        | table | postgres
 public | t3-empty_todo               | table | postgres
 public | t3-empty_transaction        | table | postgres
 public | t3-empty_user               | table | postgres
 public | t3-empty_user_tracker       | table | postgres
 public | t3-empty_user_tracker_event | table | postgres
(7 rows)

```

## License

MIT License

---

*Feel free to use, extend, and contribute!*
