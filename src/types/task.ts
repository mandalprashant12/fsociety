export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'meeting' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedTime?: number; // in minutes
  tags?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category: TaskCategory;
  attendees?: string[];
  location?: string;
  isAllDay?: boolean;
  reminders?: number[]; // minutes before event
}

export interface Meeting extends CalendarEvent {
  meetingLink?: string;
  notes?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
}