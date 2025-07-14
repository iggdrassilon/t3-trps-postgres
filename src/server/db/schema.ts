import { sql } from 'drizzle-orm'
import { index, pgTableCreator } from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `habits_tracker_${name}`)

export const users = createTable(
  'user',
  (d) => ({
    id: d.serial().primaryKey(),
    email: d.varchar({ length: 255 }).notNull().unique(),
    name: d.varchar({ length: 100 }),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }),
  (t) => [index('user_email_idx').on(t.email)],
)

export const tracks = createTable(
  'habit',
  (d) => ({
    id: d.serial().primaryKey(),
    userId: d.integer().references(() => users.id),
    title: d.varchar({ length: 128 }).notNull(),
    description: d.varchar({ length: 512 }),
    target: d.integer().notNull().default(1),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }),
  (t) => [index('habit_user_idx').on(t.userId)],
)

export const tracksChecks = createTable(
  'tracks_check',
  (d) => ({
    id: d.serial().primaryKey(),
    habitId: d.integer().references(() => tracks.id),
    date: d.date().notNull(),
    completed: d.boolean().notNull().default(true),
    value: d.integer().default(1),
  }),
  (t) => [index('tracks_check_tracks_date_idx').on(t.habitId, t.date)],
)

export const tracksGoals = createTable(
  'tracks_goal',
  (d) => ({
    id: d.serial().primaryKey(),
    habitId: d.integer().references(() => tracks.id),
    period: d.varchar({ length: 16 }).notNull(),
    value: d.integer().notNull(),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  }),
  (t) => [index('tracks_goal_tracks_idx').on(t.habitId)],
)
