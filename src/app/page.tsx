/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Link from 'next/link'
import { HydrateClient, api } from '~/trpc/server'
import { SeedDashboard } from './_components/SeedDashboard'

export default async function Home() {
  const hello = await api.user.list()
  void api.habit.list.prefetch()
  void api.todo.list.prefetch()
  void api.transaction.list.prefetch()
  void api.tracker.list.prefetch()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Productivity <span className="text-[hsl(280,100%,70%)]">App</span> Dashboard
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://github.com/iggdrassilon/t3-trps-postgres"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">GitHub →</h3>
              <div className="text-lg">
                Исходный код, архитектура и инструкции по запуску приложения.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/dashboard"
            >
              <h3 className="text-2xl font-bold">Dashboard →</h3>
              <div className="text-lg">
                Перейти к аналитике привычек, задач, финансов и активности.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              Пользователей в системе:{' '}
              {Array.isArray(hello) ? hello.length : 'Загрузка...'}
            </p>
          </div>

          {/* Витрина всех сущностей на главной */}
          <div className="w-full mt-8">
            <SeedDashboard />
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
