/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createTRPCRouter, publicProcedure } from '../trpc'
import { z } from 'zod'
import { db } from '~/server/db/index'
import { userTrackers, userTrackerEvents } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import type { IUserTracker, IUserTrackerEvent } from '../interfaces'

// Schemas
const trackerIdSchema = z.object({ id: z.number().int().positive() })

const userIdSchema = z.object({ userId: z.number().int().positive() })

const createTrackerSchema = z.object({
  userId: z.number().int(),
  sessionId: z.string().min(1),
  startedAt: z.date().optional(),
  endedAt: z.date().optional(),
})

const createTrackerEventSchema = z.object({
  trackerId: z.number().int(),
  eventType: z.string().min(1),
  module: z.string().min(1),
  route: z.string().optional(),
  apiRoute: z.string().optional(),
  usedAt: z.date().optional(),
  meta: z.record(z.unknown()).optional(),
})

export const trackerRouter = createTRPCRouter({
  // Get all tracker sessions for user
  list: publicProcedure
    .input(userIdSchema.optional())
    .query(async ({ ctx, input }): Promise<IUserTracker[]> => {
      const userId = input?.userId ?? ctx.session.user.id
      const result = await db.select().from(userTrackers).where(eq(userTrackers.userId, userId))
      return result as IUserTracker[]
    }),

  // Get tracker session by id
  get: publicProcedure
    .input(trackerIdSchema)
    .query(async ({ input }): Promise<IUserTracker | undefined> => {
      const result = await db.select().from(userTrackers).where(eq(userTrackers.id, input.id))
      return result[0] as IUserTracker | undefined
    }),

  // Create tracker session
  create: publicProcedure
    .input(createTrackerSchema)
    .mutation(async ({ input }): Promise<IUserTracker> => {
      const [created] = await db.insert(userTrackers).values(input).returning()
      return created as IUserTracker
    }),

  createEvent: publicProcedure
    .input(createTrackerEventSchema)
    .mutation(async ({ input }): Promise<IUserTrackerEvent> => {
      const [created] = await db.insert(userTrackerEvents).values(input).returning()
      return created as IUserTrackerEvent
    }),

  events: publicProcedure
    .input(trackerIdSchema)
    .query(async ({ input }): Promise<IUserTrackerEvent[]> => {
      const result = await db.select().from(userTrackerEvents).where(eq(userTrackerEvents.trackerId, input.id))
      return result as IUserTrackerEvent[]
    }),

  getUserActivity: publicProcedure
    .input(userIdSchema)
    .query(async ({ input }): Promise<{ sessions: IUserTracker[]; events: IUserTrackerEvent[] }> => {
      const sessions = await db.select().from(userTrackers).where(eq(userTrackers.userId, input.userId))
      const sessionIds = sessions.map(s => s.id)
      const events = sessionIds.length
        ? await db.select().from(userTrackerEvents).where(userTrackerEvents.trackerId.in(sessionIds))
        : []
      return {
        sessions: sessions as IUserTracker[],
        events: events as IUserTrackerEvent[],
      }
    }),
})