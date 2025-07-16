import { type IUser } from '@/server/api/interfaces'

export function UserCard({ user }: { user: IUser }) {
  return (
    <div className="border rounded p-4 flex flex-col gap-2">
      <div>
        <span className="font-semibold">{user.name}</span>{' '}
        <span className="text-xs text-muted-foreground">({user.role})</span>
      </div>
      <div className="text-xs">{user.email}</div>
      <div className="text-xs text-muted-foreground">
        Joined: {user.createdAt.toLocaleDateString()}
      </div>
    </div>
  )
}