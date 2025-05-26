export interface EventItem {
  id: string;
  title: string;
  date: string; // ISO string
  endDate?: string; // ISO string, for events with duration
  description: string;
  color: string;
  recurrence: RecurrencePattern | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom' | 'none';

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number; // every X days/weeks/months
  daysOfWeek?: number[]; // 0-6, Sunday to Saturday
  endDate?: string; // ISO string
  count?: number; // number of occurrences
}

export type EventFormData = Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface DayWithEvents {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventItem[];
}