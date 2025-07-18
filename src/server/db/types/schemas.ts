/* eslint-disable @typescript-eslint/prefer-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// User Interface
export interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
}

// Habit Interface
export interface Habit {
  id: number;
  userId: number | null;
  title: string | null;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
}

// HabitCheck Interface
export interface HabitCheck {
  id: number;
  habitId: number | null;
  checkedAt: Date;
}

// Todo Interface
export interface Todo {
  id: number;
  userId: number | null;
  title: string | null;
  completed: boolean;
  completedAt: Date | null;
  createdAt: Date;
  category: string | null;
}

// Transaction Interface
export interface Transaction {
  id: number;
  userId: number | null;
  type: string | null;
  amount: string; // Using string to represent numeric with precision and scale
  currency: string;
  category: string | null;
  description: string | null;
  relatedTo: number | null;
  createdAt: Date;
  meta: any; // Use a more specific type if the structure of meta is known
}

// UserTracker Interface
export interface UserTracker {
  id: number;
  userId: number | null;
  sessionId: string | null;
  startedAt: Date;
  endedAt: Date | null;
}

// UserTrackerEvent Interface
export interface UserTrackerEvent {
  id: number;
  trackerId: number | null;
  eventType: string | null;
  module: string | null;
  route: string | null;
  apiRoute: string | null;
  usedAt: Date;
  meta: any; // Use a more specific type if the structure of meta is known
}

export interface UserD {
  serial: () => { primaryKey: () => any };
  varchar: (options: { length: number }) => { notNull: () => any, unique: () => any, default: (value: string) => any };
  timestamp: (options: { withTimezone: boolean }) => { default: (value: any) => any };
}

export interface HabitD {
  serial: () => { primaryKey: () => any };
  integer: () => { references: () => any };
  varchar: (options: { length: number }) => { default: (value: boolean | string) => any };
  boolean: () => { default: (value: boolean) => any };
  timestamp: (options: { withTimezone: boolean }) => { default: (value: any) => any };
}

export interface HabitCheckD {
  serial: () => { primaryKey: () => any };
  integer: () => { references: () => any };
  timestamp: (options: { withTimezone: boolean }) => { default: (value: any) => any };
}

export interface TodoD {
  serial: () => { primaryKey: () => any };
  integer: () => { references: () => any };
  varchar: (options: { length: number }) => any;
  boolean: () => { default: (value: boolean) => any };
  timestamp: (options: { withTimezone: boolean }) => any;
}

export interface TransactionD {
  timestamp(arg0: { withTimezone: boolean; }): unknown;
  serial: () => { primaryKey: () => any };
  integer: () => { references: () => any };
  varchar: (options: { length: number }) => { default: (value: string) => any };
  numeric: (options: { precision: number, scale: number }) => { notNull: () => any };
  jsonb: () => any;
}

export interface UserTrackerD {
  serial: () => { primaryKey: () => any };
  integer: () => { references: () => any };
  varchar: (options: { length: number }) => any;
  timestamp: (options: { withTimezone: boolean }) => { default: (value: any) => any };
}

export interface UserTrackerEventD {
  serial: () => { primaryKey: () => any };
  integer: () => { references: () => any };
  varchar: (options: { length: number }) => any;
  timestamp: (options: { withTimezone: boolean }) => { default: (value: any) => any };
  jsonb: () => any;
}

export interface UserT {
  (name: string): {
    on: (column: any) => any;
  };
}

export interface HabitT {
  (name: string): {
    on: (column: any) => any;
  };
}

export interface HabitCheckT {
  (name: string): {
    on: (column: any) => any;
  };
}

export interface TodoT {
  (name: string): {
    on: (column: any) => any;
  };
}

export interface TransactionT {
  (name: string): {
    on: (column: any) => any;
  };
}

export interface UserTrackerT {
  (name: string): {
    on: (column: any) => any;
  };
}

export interface UserTrackerEventT {
  (name: string): {
    on: (column: any) => any;
  };
}
