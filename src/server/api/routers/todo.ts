/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db, todos } from '@/server/db/schema'
import type { ITodo } from '../interfaces'

export const todoRouter = createTRPCRouter({
  // Получить список todo
  list: protectedProcedure
    .input(z.object({ userId: z.number().int().positive() }).optional())
    .query(async ({ ctx, input }): Promise<ITodo[]> => {
      const userId = input?.userId ?? ctx.session.user.id
      const result = await db.select().from(todos).where(eq(todos.userId, userId)) as ITodo[]
      return result
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }): Promise<ITodo | undefined> => {
      // Типизируем результат
      const result = await db.select().from(todos).where(eq(todos.id, input.id)) as ITodo[]
      return result[0] ?? undefined
    }),

  create: protectedProcedure
    .input(z.object({
      userId: z.number().int(),
      title: z.string().min(1).max(100),
      completed: z.boolean().optional(),
      category: z.string().max(100).optional(),
      completedAt: z.date().optional(),
    }))
    .mutation(async ({ input }): Promise<ITodo> => {
      const [created]: ITodo[] = await db.insert(todos).values(input).returning()
      return created
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      title: z.string().min(1).max(100).optional(),
      completed: z.boolean().optional(),
      category: z.string().max(100).optional(),
      completedAt: z.date().optional(),
    }))
    .mutation(async ({ input }): Promise<ITodo> => {
      const [updated]: ITodo[] = await db.update(todos).set(input).where(eq(todos.id, input.id)).returning()
      return updated
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }): Promise<{ success: boolean }> => {
      await db.delete(todos).where(eq(todos.id, input.id))
      return { success: true }
    }),

  analytics: protectedProcedure
    .input(z.object({ userId: z.number().int().positive() }).optional())
    .query(async ({ ctx, input }): Promise<{ totalTodos: number; completed: number; completionRate: number }> => {
      const userId = input?.userId ?? ctx.session.user.id
      const result = await db.select().from(todos).where(eq(todos.userId, userId)) as ITodo[]
      const completed = result.filter(t => t.completed)
      return {
        totalTodos: result.length,
        completed: completed.length,
        completionRate: result.length ? completed.length / result.length : 0,
      }
    }),
})