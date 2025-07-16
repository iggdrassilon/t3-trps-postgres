/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc'

import { userRouter } from '~/server/api/routers/user'
import { habitRouter } from './routers/habit'
import { todoRouter } from './routers/todo'
import { trackerRouter } from './routers/tracker'
import { transactionRouter } from './routers/transaction'

export const appRouter = createTRPCRouter({
  user: userRouter,
  habit: habitRouter,
  todo: todoRouter,
  tracker: trackerRouter,
  transaction: transactionRouter,
})

export type AppRouter = typeof appRouter;
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
