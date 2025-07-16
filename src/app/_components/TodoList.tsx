import { type ITodo } from '@/server/api/interfaces'
import { api } from '@/trpc/react'
import { Card, CardHeader, CardContent, CardTitle } from 'shadcn/ui/card'

interface TodoListProps {
  todos: ITodo[];
}

export function TodoList({ todos }: TodoListProps) {
  return (
    <div className="grid gap-4">
      {todos.map((todo) => (
        <Card key={todo.id}>
          <CardHeader>
            <CardTitle>
              {todo.title}
              <span className="ml-2 text-xs">
                {todo.completed ? '✅' : '⏳'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs">
              Category: {todo.category || '—'}
            </div>
            <div className="text-xs text-muted-foreground">
              Created: {todo.createdAt.toLocaleDateString()}
            </div>
            {todo.completedAt && (
              <div className="text-xs">
                Completed: {todo.completedAt.toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TodoListContainer() {
  const { data: todos = [], isLoading } = api.todo.list.useQuery()

  if (isLoading) return <div>Loading...</div>
  return <TodoList todos={todos} />
}