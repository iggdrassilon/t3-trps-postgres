'use client'
import { trpc } from '~/trpc/react'
import { useState } from 'react'

export function TracksList() {
  const { data: habits } = trpc.habit.getAll.useQuery()
  const checkHabit = trpc.habit.checkHabit.useMutation()
  const today = new Date().toISOString().slice(0, 10)

  if (!habits) return <div>Загрузка...</div>

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <div key={habit.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
          <div>
            <div className="font-semibold">{habit.title}</div>
            <div className="text-sm text-gray-500">{habit.description}</div>
          </div>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => checkHabit.mutate({ habitId: habit.id, date: today })}
          >
            Отметить
          </button>
        </div>
      ))}
    </div>
  )
}
