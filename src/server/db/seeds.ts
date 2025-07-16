/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable drizzle/enforce-delete-with-where */
import { db } from './index'
import { users, habits, habitChecks, todos, transactions, userTrackers, userTrackerEvents } from './schema'

interface User {
  id?: number // Assuming there's an auto-generated id
  email: string
  name: string
  role: 'admin' | 'user'
}

async function main() {
  await db.delete(userTrackerEvents)
  await db.delete(userTrackers)
  await db.delete(transactions)
  await db.delete(habitChecks)
  await db.delete(habits)
  await db.delete(todos)
  await db.delete(users)

  const [alice] = (await db
    .insert(users)
    .values({
      email: 'alice@example.com',
      name: 'Alice',
      role: 'admin',
    })
    .returning()) as User[]

  const [bob] = (await db
    .insert(users)
    .values({
      email: 'bob@example.com',
      name: 'Bob',
      role: 'user',
    })
    .returning()) as User[]

  const [runHabit] = await db
    .insert(habits)
    .values({
      userId: alice?.id,
      title: 'Morning Run',
      description: 'Go for a run every morning.',
      isPublic: true,
    })
    .returning()
  const [readHabit] = await db
    .insert(habits)
    .values({
      userId: bob?.id,
      title: 'Read Book',
      description: 'Read 10 pages each night.',
      isPublic: false,
    })
    .returning()

  await db.insert(habitChecks).values([{ habitId: runHabit.id }, { habitId: runHabit.id }, { habitId: readHabit.id }])

  const [todo1] = await db
    .insert(todos)
    .values({
      userId: alice?.id,
      title: 'Buy groceries',
      completed: false,
      category: 'Personal',
    })
    .returning()
  const [todo2] = await db
    .insert(todos)
    .values({
      userId: bob?.id,
      title: 'Finish project',
      completed: true,
      category: 'Work',
      completedAt: new Date(),
    })
    .returning()

  await db.insert(transactions).values([
    {
      userId: alice?.id,
      type: 'income',
      amount: 1200.0,
      currency: 'USD',
      category: 'Salary',
      description: 'Monthly salary',
    },
    {
      userId: alice?.id,
      type: 'expense',
      amount: 50.0,
      currency: 'USD',
      category: 'Groceries',
      description: 'Supermarket shopping',
      relatedTo: todo1.id,
    },
    {
      userId: bob?.id,
      type: 'expense',
      amount: 20.0,
      currency: 'USD',
      category: 'Books',
      description: 'Bought a new book',
    },
  ])

  const [aliceSession] = await db
    .insert(userTrackers)
    .values({
      userId: alice?.id,
      sessionId: 'alice-session-1',
      startedAt: new Date(),
    })
    .returning()

  await db.insert(userTrackerEvents).values([
    {
      trackerId: aliceSession.id,
      eventType: 'page_view',
      module: 'dashboard',
      route: '/dashboard',
      usedAt: new Date(),
    },
    {
      trackerId: aliceSession.id,
      eventType: 'api_call',
      module: 'transaction',
      apiRoute: '/api/transactions',
      usedAt: new Date(),
      meta: { action: 'list' },
    },
  ])

  console.log('✅ Seeded database!')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
