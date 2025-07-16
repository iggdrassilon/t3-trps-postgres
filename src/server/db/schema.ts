 
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { sql } from 'drizzle-orm'
import { index, pgTableCreator } from 'drizzle-orm/pg-core'

import {
  type UserD,
  type UserT,
  type HabitD,
  type HabitCheckD,
  type TodoD,
  type TransactionD,
  type UserTrackerD,
  type UserTrackerEventD,
} from './types/schemas'

export const createTable = pgTableCreator((name) => `t3-empty_${name}`)

export const users = createTable(
  'user',
  (d: UserD) => ({
    id: d.serial().primaryKey(),
    email: d.varchar({ length: 255 }).notNull().unique(),
    name: d.varchar({ length: 100 }),
    role: d.varchar({ length: 20 }).default('user').notNull(),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }),
  (t: UserT) => [index('user_email_idx').on(t.email)],
)

export const habits = createTable('habit', (d: HabitD) => ({
  id: d.serial().primaryKey(),
  userId: d.integer().references(() => users.id),
  title: d.varchar({ length: 100 }),
  description: d.varchar({ length: 500 }),
  isPublic: d.boolean().default(false),
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
}))

export const habitChecks = createTable('habit_check', (d: HabitCheckD) => ({
  id: d.serial().primaryKey(),
  habitId: d.integer().references(() => habits.id),
  checkedAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
}))

export const todos = createTable('todo', (d: TodoD) => ({
  id: d.serial().primaryKey(),
  userId: d.integer().references(() => users.id),
  title: d.varchar({ length: 100 }),
  completed: d.boolean().default(false),
  completedAt: d.timestamp({ withTimezone: true }),
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  category: d.varchar({ length: 100 }),
}))

export const transactions = createTable('transaction', (d: TransactionD) => ({
  id: d.serial().primaryKey(),
  userId: d.integer().references(() => users.id),
  type: d.varchar({ length: 32 }), // "income" | "expense" | "transfer"
  amount: d.numeric({ precision: 12, scale: 2 }).notNull(),
  currency: d.varchar({ length: 10 }).default('RUB'),
  category: d.varchar({ length: 64 }),
  description: d.varchar({ length: 255 }),
  relatedTo: d.integer(), // habitId, todoId, или null
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  meta: d.jsonb(),
}))

export const userTrackers = createTable('user_tracker', (d: UserTrackerD) => ({
  id: d.serial().primaryKey(),
  userId: d.integer().references(() => users.id),
  sessionId: d.varchar({ length: 64 }),
  startedAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  endedAt: d.timestamp({ withTimezone: true }),
}))

export const userTrackerEvents = createTable('user_tracker_event', (d: UserTrackerEventD) => ({
  id: d.serial().primaryKey(),
  trackerId: d.integer().references(() => userTrackers.id),
  eventType: d.varchar({ length: 128 }),
  module: d.varchar({ length: 128 }),
  route: d.varchar({ length: 255 }),
  apiRoute: d.varchar({ length: 255 }),
  usedAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  meta: d.jsonb(),
}))
