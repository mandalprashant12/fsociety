export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'meeting' | 'urgent';
export type CalendarView = 'day' | 'week' | 'month' | 'agenda';
export type MeetingType = 'video' | 'phone' | 'in-person' | 'hybrid';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type NotificationType = 'task_reminder' | 'meeting_reminder' | 'deadline_alert' | 'meeting_starting';
export type UserRole = 'admin' | 'user' | 'viewer';
export type AvailabilityStatus = 'available' | 'busy' | 'tentative' | 'out_of_office';

// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  timezone: string;
  workingHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
    days: number[]; // [1,2,3,4,5] for Mon-Fri
  };
  preferences: {
    theme: 'dark' | 'light' | 'auto';
    notifications: boolean;
    emailReminders: boolean;
    defaultMeetingDuration: number; // in minutes
    bufferTime: number; // in minutes
  };
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Task Management
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
  actualTime?: number; // in minutes
  tags?: string[];
  assigneeId?: string;
  projectId?: string;
  subtasks?: Task[];
  attachments?: Attachment[];
  comments?: Comment[];
  dependencies?: string[]; // task IDs this task depends on
}

// Calendar and Events
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category: TaskCategory;
  attendees?: Attendee[];
  location?: string;
  isAllDay?: boolean;
  reminders?: number[]; // minutes before event
  color?: string;
  recurring?: RecurrenceRule;
  status: AvailabilityStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendee {
  id: string;
  email: string;
  name: string;
  status: 'accepted' | 'declined' | 'tentative' | 'pending';
  responseTime?: Date;
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: Date;
  count?: number;
  daysOfWeek?: number[]; // [1,2,3,4,5] for Mon-Fri
  dayOfMonth?: number;
}

// Meeting Management
export interface Meeting extends CalendarEvent {
  meetingType: MeetingType;
  meetingLink?: string;
  meetingId?: string;
  notes?: string;
  agenda?: string;
  recordingUrl?: string;
  meetingRoom?: string;
  isRecurring: boolean;
  parentMeetingId?: string; // for recurring meetings
  meetingSettings: {
    autoMute: boolean;
    autoVideoOff: boolean;
    waitingRoom: boolean;
    allowScreenShare: boolean;
    allowChat: boolean;
  };
}

// Scheduling and Availability
export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  isAvailable: boolean;
  bufferTime: number; // in minutes
}

export interface BookingPage {
  id: string;
  userId: string;
  slug: string; // for URL like /username
  title: string;
  description?: string;
  meetingTypes: MeetingTypeConfig[];
  availability: Availability[];
  timezone: string;
  isActive: boolean;
  customFields?: CustomField[];
  settings: {
    requireApproval: boolean;
    allowRescheduling: boolean;
    allowCancellation: boolean;
    advanceBookingDays: number;
    minBookingNotice: number; // in hours
  };
}

export interface MeetingTypeConfig {
  id: string;
  name: string;
  duration: number; // in minutes
  description?: string;
  price?: number;
  isActive: boolean;
  bufferTime: number; // in minutes
  locations?: string[];
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  options?: string[]; // for select/checkbox
  placeholder?: string;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  scheduledFor?: Date; // for scheduled notifications
}

// Projects and Teams
export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  ownerId: string;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

// File Attachments
export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Comments and Collaboration
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  mentions?: string[]; // user IDs
}

// Calendar Integration
export interface CalendarIntegration {
  id: string;
  userId: string;
  provider: 'google' | 'outlook' | 'apple' | 'caldav';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  calendarId: string;
  isActive: boolean;
  lastSyncAt?: Date;
}

// Webhooks
export interface Webhook {
  id: string;
  userId: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
}

// Analytics and Reporting
export interface ProductivityMetrics {
  userId: string;
  date: Date;
  tasksCompleted: number;
  tasksCreated: number;
  timeSpent: number; // in minutes
  meetingsAttended: number;
  meetingTime: number; // in minutes
  focusTime: number; // in minutes
  productivityScore: number; // 0-100
}

// Time Tracking
export interface TimeEntry {
  id: string;
  userId: string;
  taskId?: string;
  projectId?: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  isActive: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}