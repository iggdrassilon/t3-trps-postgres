/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { db, habits, habitChecks } from '@/server/db/schema'
import { eq, inArray } from 'drizzle-orm'
import type { IHabit, IHabitCheck } from '../interfaces'

const habitIdSchema = z.object({ id: z.number().int().positive() })
const userIdSchema = z.object({ userId: z.number().int().positive() })
const createHabitSchema = z.object({
  userId: z.number().int(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
})
const updateHabitSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
})

export const habitRouter = createTRPCRouter({
  list: protectedProcedure
    .input(userIdSchema.optional())
    .query(async ({ ctx, input }): Promise<IHabit[]> => {
      const userId = input?.userId ?? ctx.session.user.id
      return db.select().from(habits).where(eq(habits.userId, userId)) as Promise<IHabit[]>
    }),

  get: protectedProcedure
    .input(habitIdSchema)
    .query(async ({ input }): Promise<IHabit | undefined> => {
      const res = await db.select().from(habits).where(eq(habits.id, input.id))
      return res[0] as IHabit | undefined
    }),

  create: protectedProcedure
    .input(createHabitSchema)
    .mutation(async ({ input }): Promise<IHabit> => {
      const [created] = await db.insert(habits).values(input).returning()
      return created as IHabit
    }),

  update: protectedProcedure
    .input(updateHabitSchema)
    .mutation(async ({ input }): Promise<IHabit> => {
      const [updated] = await db.update(habits).set(input).where(eq(habits.id, input.id)).returning()
      return updated as IHabit
    }),

  delete: protectedProcedure
    .input(habitIdSchema)
    .mutation(async ({ input }): Promise<{ success: boolean }> => {
      await db.delete(habits).where(eq(habits.id, input.id))
      return { success: true }
    }),

  check: protectedProcedure
    .input(habitIdSchema)
    .mutation(async ({ input }): Promise<IHabitCheck> => {
      const [checked] = await db.insert(habitChecks).values({ habitId: input.id }).returning()
      return checked as IHabitCheck
    }),

  history: protectedProcedure
    .input(habitIdSchema)
    .query(async ({ input }): Promise<IHabitCheck[]> => {
      return db.select().from(habitChecks).where(eq(habitChecks.habitId, input.id)) as Promise<IHabitCheck[]>
    }),

  analytics: protectedProcedure
    .input(userIdSchema.optional())
    .query(async ({ ctx, input }): Promise<{ totalHabits: number; totalChecks: number }> => {
      const userId = input?.userId ?? ctx.session.user.id
      const totalHabits = await db.select().from(habits).where(eq(habits.userId, userId)) as IHabit[]
      const habitIds = totalHabits.map(h => h.id)
      const totalChecks = habitIds.length
        ? await db.select().from(habitChecks).where(inArray(habitChecks.habitId, habitIds)) as IHabitCheck[]
        : []
      return {
        totalHabits: totalHabits.length,
        totalChecks: totalChecks.length,
      }
    }),
})