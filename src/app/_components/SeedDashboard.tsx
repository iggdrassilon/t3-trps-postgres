/* eslint-disable max-len */
'use client'

import React from 'react'
import Link from 'next/link'

export function SeedDashboard() {
  const sections = [
    {
      title: 'Привычки',
      description: 'Ваши привычки и их статистика.',
      href: '/habit',
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Задачи',
      description: 'Список задач для продуктивности.',
      href: '/todo',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: 'Транзакции',
      description: 'Финансовый учёт и аналитика.',
      href: '/transaction',
      color: 'from-blue-400 to-blue-700',
    },
    {
      title: 'Трекер активности',
      description: 'Анализируйте свою активность.',
      href: '/tracker',
      color: 'from-purple-400 to-purple-700',
    },
    {
      title: 'Пользователи',
      description: 'Список и управление пользователями.',
      href: '/users',
      color: 'from-pink-400 to-pink-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {sections.map(section => (
        <Link
          key={section.href}
          href={section.href}
          className={`flex flex-col gap-2 p-4 rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg hover:scale-[1.03] transition-transform`}
        >
          <h2 className="text-xl font-bold">{section.title}</h2>
          <p className="text-base">{section.description}</p>
        </Link>
      ))}
    </div>
  )
}