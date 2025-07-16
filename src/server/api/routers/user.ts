/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
 
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { db, users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import type { IUser } from '../interfaces'

const userIdSchema = z.object({ id: z.number().int().positive() })
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
})
const updateUserSchema = z.object({
  id: z.number().int(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
})

export const userRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async (): Promise<IUser[]> => {
      const result = await db.select().from(users)
      return result as IUser[]
    }),

  get: protectedProcedure
    .input(userIdSchema)
    .query(async ({ input }): Promise<IUser | undefined> => {
      const result = await db.select().from(users).where(eq(users.id, input.id))
      return result[0] as IUser | undefined
    }),

  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input }): Promise<IUser> => {
      const [created] = await db.insert(users).values(input).returning()
      return created as IUser
    }),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }): Promise<IUser> => {
      const [updated] = await db.update(users).set(input).where(eq(users.id, input.id)).returning()
      return updated as IUser
    }),

  delete: protectedProcedure
    .input(userIdSchema)
    .mutation(async ({ input }): Promise<{ success: boolean }> => {
      await db.delete(users).where(eq(users.id, input.id))
      return { success: true }
    }),
})