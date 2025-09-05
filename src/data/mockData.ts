import { Task, CalendarEvent, Meeting } from '@/types/task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the updated dashboard',
    status: 'in-progress',
    priority: 'high',
    category: 'work',
    deadline: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    estimatedTime: 240,
    tags: ['design', 'ui/ux']
  },
  {
    id: '2',
    title: 'Team standup meeting',
    description: 'Daily standup with development team',
    status: 'todo',
    priority: 'medium',
    category: 'meeting',
    deadline: new Date('2024-01-13T09:00:00'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    estimatedTime: 30
  },
  {
    id: '3',
    title: 'Buy groceries',
    description: 'Weekly grocery shopping',
    status: 'todo',
    priority: 'low',
    category: 'personal',
    deadline: new Date('2024-01-14'),
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    estimatedTime: 60
  },
  {
    id: '4',
    title: 'Code review - Authentication module',
    description: 'Review pull request for new authentication system',
    status: 'completed',
    priority: 'high',
    category: 'work',
    deadline: new Date('2024-01-12'),
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
    estimatedTime: 90,
    tags: ['code-review', 'security']
  },
  {
    id: '5',
    title: 'Fix critical bug in payment system',
    description: 'Users unable to process payments - urgent fix needed',
    status: 'in-progress',
    priority: 'urgent',
    category: 'urgent',
    deadline: new Date('2024-01-13T18:00:00'),
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    estimatedTime: 120,
    tags: ['bug', 'payments', 'critical']
  }
];

export const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Product Strategy Meeting',
    description: 'Quarterly planning and roadmap discussion',
    startTime: new Date('2024-01-15T14:00:00'),
    endTime: new Date('2024-01-15T16:00:00'),
    category: 'meeting',
    attendees: ['john@company.com', 'sarah@company.com'],
    location: 'Conference Room A',
    reminders: [15, 5]
  },
  {
    id: 'e2',
    title: 'Client Demo',
    description: 'Present new features to key client',
    startTime: new Date('2024-01-16T11:00:00'),
    endTime: new Date('2024-01-16T12:00:00'),
    category: 'work',
    attendees: ['client@company.com'],
    location: 'Virtual',
    reminders: [30, 10]
  },
  {
    id: 'e3',
    title: 'Gym Session',
    description: 'Weekly workout routine',
    startTime: new Date('2024-01-14T18:00:00'),
    endTime: new Date('2024-01-14T19:30:00'),
    category: 'personal',
    location: 'Local Gym'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Weekly Team Sync',
    description: 'Weekly team synchronization meeting',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T10:00:00'),
    category: 'meeting',
    attendees: ['team@company.com'],
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Previous notes: Discussed sprint progress and upcoming milestones',
    recurring: {
      frequency: 'weekly',
      interval: 1
    },
    reminders: [15, 5]
  },
  {
    id: 'm2',
    title: 'Client Onboarding Call',
    description: 'Onboard new enterprise client',
    startTime: new Date('2024-01-16T15:00:00'),
    endTime: new Date('2024-01-16T16:30:00'),
    category: 'work',
    attendees: ['newclient@enterprise.com', 'sales@company.com'],
    meetingLink: 'https://zoom.us/j/123456789',
    notes: 'First onboarding session - cover platform overview',
    reminders: [30, 15, 5]
  }
];