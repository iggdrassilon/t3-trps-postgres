/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
 
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { db, transactions } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import type { ITransaction } from '../interfaces'

// Schemas
const transactionIdSchema = z.object({ id: z.number().int().positive() })
const userIdSchema = z.object({ userId: z.number().int().positive() })
const createTransactionSchema = z.object({
  userId: z.number().int(),
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number(),
  currency: z.string().max(10).default('RUB'),
  category: z.string().max(64).optional(),
  description: z.string().max(255).optional(),
  relatedTo: z.number().optional(),
  meta: z.record(z.unknown()).optional(),
})
const updateTransactionSchema = z.object({
  id: z.number().int(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  amount: z.number().optional(),
  currency: z.string().max(10).optional(),
  category: z.string().max(64).optional(),
  description: z.string().max(255).optional(),
  relatedTo: z.number().optional(),
  meta: z.record(z.unknown()).optional(),
})

// Router
export const transactionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(userIdSchema.optional())
    .query(async ({ ctx, input }): Promise<ITransaction[]> => {
      const userId = input?.userId ?? ctx.session.user.id
      const result = await db.select().from(transactions).where(eq(transactions.userId, userId))
      return result as ITransaction[]
    }),

  get: protectedProcedure
    .input(transactionIdSchema)
    .query(async ({ input }): Promise<ITransaction | undefined> => {
      const result = await db.select().from(transactions).where(eq(transactions.id, input.id))
      return result[0] as ITransaction | undefined
    }),

  create: protectedProcedure
    .input(createTransactionSchema)
    .mutation(async ({ input }): Promise<ITransaction> => {
      const [created] = await db.insert(transactions).values(input).returning()
      return created as ITransaction
    }),

  update: protectedProcedure
    .input(updateTransactionSchema)
    .mutation(async ({ input }): Promise<ITransaction> => {
      const [updated] = await db.update(transactions).set(input).where(eq(transactions.id, input.id)).returning()
      return updated as ITransaction
    }),

  delete: protectedProcedure
    .input(transactionIdSchema)
    .mutation(async ({ input }): Promise<{ success: boolean }> => {
      await db.delete(transactions).where(eq(transactions.id, input.id))
      return { success: true }
    }),

  // Analytics for transactions (total, by category, etc.)
  analytics: protectedProcedure
    .input(userIdSchema.optional())
    .query(async ({ ctx, input }): Promise<{ total: number; byCategory: Record<string, number> }> => {
      const userId = input?.userId ?? ctx.session.user.id
      const result = await db.select().from(transactions).where(eq(transactions.userId, userId))
      const typed: ITransaction[] = result as ITransaction[]
      const total = typed.reduce((acc, t) => acc + t.amount, 0)
      const byCategory: Record<string, number> = {}
      for (const t of typed) {
        if (!t.category) continue
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
      }
      return { total, byCategory }
    }),
})