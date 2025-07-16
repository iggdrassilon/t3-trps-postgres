import { type IHabit } from '@/server/api/interfaces'
import { api } from '@/trpc/react'
import { Card, CardHeader, CardContent, CardTitle } from 'shadcn/ui/card'

interface HabitListProps {
  habits: IHabit[];
}
export function HabitList({ habits }: HabitListProps) {
  return (
    <div className="grid gap-4">
      {habits.map((habit) => (
        <Card key={habit.id}>
          <CardHeader>
            <CardTitle>{habit.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Public: {habit.isPublic ? 'Yes' : 'No'}
            </div>
            <div className="text-xs">
              Created: {habit.createdAt.toLocaleDateString()}
            </div>
            {habit.description && (
              <div className="text-xs mt-2">{habit.description}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function HabitListContainer() {
  const { data: habits = [], isLoading } = api.habit.list.useQuery()

  if (isLoading) return <div>Loading...</div>

  return <HabitList habits={habits} />
}