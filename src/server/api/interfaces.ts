
// User
export interface IUser {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
}

// Habit
export interface IHabit {
  id: number;
  userId: number;
  title: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
}

// HabitCheck
export interface IHabitCheck {
  id: number;
  habitId: number;
  checkedAt: Date;
}

// Todo
export interface ITodo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  category?: string;
}

// Transaction
export interface ITransaction {
  id: number;
  userId: number;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  currency: string;
  category?: string;
  description?: string;
  relatedTo?: number;
  createdAt: Date;
  meta?: Record<string, unknown>;
}

// UserTracker (Session)
export interface IUserTracker {
  id: number;
  userId: number;
  sessionId: string;
  startedAt: Date;
  endedAt?: Date;
}

// UserTrackerEvent
export interface IUserTrackerEvent {
  id: number;
  trackerId: number;
  eventType: string;
  module: string;
  route?: string;
  apiRoute?: string;
  usedAt: Date;
  meta?: Record<string, unknown>;
}