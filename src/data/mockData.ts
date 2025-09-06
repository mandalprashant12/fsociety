import { 
  Task, 
  CalendarEvent, 
  Meeting, 
  User, 
  Project, 
  Availability, 
  BookingPage, 
  Notification,
  ProductivityMetrics,
  TimeEntry
} from '@/types/task';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'john@company.com',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'admin',
    timezone: 'America/New_York',
    workingHours: {
      start: '09:00',
      end: '17:00',
      days: [1, 2, 3, 4, 5] // Mon-Fri
    },
    preferences: {
      theme: 'dark',
      notifications: true,
      emailReminders: true,
      defaultMeetingDuration: 60,
      bufferTime: 15
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'user2',
    email: 'sarah@company.com',
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    role: 'user',
    timezone: 'America/Los_Angeles',
    workingHours: {
      start: '08:00',
      end: '16:00',
      days: [1, 2, 3, 4, 5]
    },
    preferences: {
      theme: 'dark',
      notifications: true,
      emailReminders: false,
      defaultMeetingDuration: 30,
      bufferTime: 10
    },
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-15')
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj1',
    name: 'TaskFlow Dashboard',
    description: 'Modern task management and calendar application',
    color: '#8B5CF6',
    ownerId: 'user1',
    members: [
      { userId: 'user1', role: 'owner', joinedAt: new Date('2024-01-01') },
      { userId: 'user2', role: 'admin', joinedAt: new Date('2024-01-02') }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'proj2',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of mobile application',
    color: '#06B6D4',
    ownerId: 'user2',
    members: [
      { userId: 'user2', role: 'owner', joinedAt: new Date('2024-01-05') },
      { userId: 'user1', role: 'member', joinedAt: new Date('2024-01-06') }
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15')
  }
];

// Enhanced Mock Tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the updated dashboard with modern UI components',
    status: 'in-progress',
    priority: 'high',
    category: 'work',
    deadline: new Date('2024-01-20'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    estimatedTime: 240,
    actualTime: 180,
    tags: ['design', 'ui/ux', 'dashboard'],
    assigneeId: 'user1',
    projectId: 'proj1',
    subtasks: [
      {
        id: '1-1',
        title: 'Create wireframes',
        description: 'Low-fidelity wireframes for main dashboard',
        status: 'completed',
        priority: 'medium',
        category: 'work',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        completedAt: new Date('2024-01-12'),
        estimatedTime: 60,
        actualTime: 45,
        assigneeId: 'user1',
        projectId: 'proj1'
      },
      {
        id: '1-2',
        title: 'Design high-fidelity mockups',
        description: 'Detailed mockups with colors and typography',
        status: 'in-progress',
        priority: 'high',
        category: 'work',
        deadline: new Date('2024-01-18'),
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-15'),
        estimatedTime: 120,
        actualTime: 60,
        assigneeId: 'user1',
        projectId: 'proj1'
      }
    ],
    dependencies: ['4']
  },
  {
    id: '2',
    title: 'Team standup meeting',
    description: 'Daily standup with development team to discuss progress and blockers',
    status: 'todo',
    priority: 'medium',
    category: 'meeting',
    deadline: new Date('2024-01-16T09:00:00'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    estimatedTime: 30,
    assigneeId: 'user1',
    projectId: 'proj1'
  },
  {
    id: '3',
    title: 'Buy groceries',
    description: 'Weekly grocery shopping for the household',
    status: 'todo',
    priority: 'low',
    category: 'personal',
    deadline: new Date('2024-01-17'),
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-15'),
    estimatedTime: 60,
    assigneeId: 'user1'
  },
  {
    id: '4',
    title: 'Code review - Authentication module',
    description: 'Review pull request for new authentication system with enhanced security',
    status: 'completed',
    priority: 'high',
    category: 'work',
    deadline: new Date('2024-01-12'),
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
    estimatedTime: 90,
    actualTime: 75,
    tags: ['code-review', 'security', 'authentication'],
    assigneeId: 'user2',
    projectId: 'proj1'
  },
  {
    id: '5',
    title: 'Fix critical bug in payment system',
    description: 'Users unable to process payments - urgent fix needed for production',
    status: 'in-progress',
    priority: 'urgent',
    category: 'urgent',
    deadline: new Date('2024-01-16T18:00:00'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    estimatedTime: 120,
    actualTime: 45,
    tags: ['bug', 'payments', 'critical', 'production'],
    assigneeId: 'user2',
    projectId: 'proj1'
  },
  {
    id: '6',
    title: 'Mobile app user testing',
    description: 'Conduct user testing sessions for mobile app redesign',
    status: 'todo',
    priority: 'medium',
    category: 'work',
    deadline: new Date('2024-01-25'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-15'),
    estimatedTime: 180,
    assigneeId: 'user2',
    projectId: 'proj2'
  }
];

// Enhanced Mock Events
export const mockEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Product Strategy Meeting',
    description: 'Quarterly planning and roadmap discussion with stakeholders',
    startTime: new Date('2024-01-20T14:00:00'),
    endTime: new Date('2024-01-20T16:00:00'),
    category: 'meeting',
    attendees: [
      { id: 'att1', email: 'john@company.com', name: 'John Doe', status: 'accepted', responseTime: new Date('2024-01-15T10:00:00') },
      { id: 'att2', email: 'sarah@company.com', name: 'Sarah Wilson', status: 'accepted', responseTime: new Date('2024-01-15T10:30:00') }
    ],
    location: 'Conference Room A',
    isAllDay: false,
    reminders: [15, 5],
    color: '#8B5CF6',
    status: 'available',
    createdBy: 'user1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'e2',
    title: 'Client Demo',
    description: 'Present new features to key client and gather feedback',
    startTime: new Date('2024-01-22T11:00:00'),
    endTime: new Date('2024-01-22T12:00:00'),
    category: 'work',
    attendees: [
      { id: 'att3', email: 'client@company.com', name: 'Client Representative', status: 'accepted', responseTime: new Date('2024-01-14T15:00:00') }
    ],
    location: 'Virtual - Google Meet',
    isAllDay: false,
    reminders: [30, 10],
    color: '#06B6D4',
    status: 'available',
    createdBy: 'user1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'e3',
    title: 'Gym Session',
    description: 'Weekly workout routine - strength training',
    startTime: new Date('2024-01-18T18:00:00'),
    endTime: new Date('2024-01-18T19:30:00'),
    category: 'personal',
    location: 'Local Gym',
    isAllDay: false,
    color: '#10B981',
    status: 'available',
    createdBy: 'user1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// Enhanced Mock Meetings
export const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Weekly Team Sync',
    description: 'Weekly team synchronization meeting to discuss progress and blockers',
    startTime: new Date('2024-01-16T09:00:00'),
    endTime: new Date('2024-01-16T10:00:00'),
    category: 'meeting',
    attendees: [
      { id: 'att4', email: 'team@company.com', name: 'Development Team', status: 'accepted', responseTime: new Date('2024-01-15T09:00:00') }
    ],
    location: 'Virtual - Google Meet',
    isAllDay: false,
    reminders: [15, 5],
    color: '#8B5CF6',
    status: 'available',
    createdBy: 'user1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    meetingType: 'video',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    meetingId: 'meet-abc-defg-hij',
    notes: 'Previous notes: Discussed sprint progress and upcoming milestones. Need to focus on authentication module completion.',
    agenda: '1. Sprint progress review\n2. Blockers discussion\n3. Next week planning\n4. Q&A',
    isRecurring: true,
    parentMeetingId: 'm1',
    meetingSettings: {
      autoMute: true,
      autoVideoOff: false,
      waitingRoom: false,
      allowScreenShare: true,
      allowChat: true
    },
    recurring: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: [2] // Tuesday
    }
  },
  {
    id: 'm2',
    title: 'Client Onboarding Call',
    description: 'Onboard new enterprise client and provide platform overview',
    startTime: new Date('2024-01-19T15:00:00'),
    endTime: new Date('2024-01-19T16:30:00'),
    category: 'work',
    attendees: [
      { id: 'att5', email: 'newclient@enterprise.com', name: 'Enterprise Client', status: 'accepted', responseTime: new Date('2024-01-14T11:00:00') },
      { id: 'att6', email: 'sales@company.com', name: 'Sales Team', status: 'accepted', responseTime: new Date('2024-01-14T11:15:00') }
    ],
    location: 'Virtual - Zoom',
    isAllDay: false,
    reminders: [30, 15, 5],
    color: '#F59E0B',
    status: 'available',
    createdBy: 'user1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15'),
    meetingType: 'video',
    meetingLink: 'https://zoom.us/j/123456789',
    meetingId: 'zoom-123456789',
    notes: 'First onboarding session - cover platform overview, key features, and next steps for implementation.',
    agenda: '1. Platform overview\n2. Key features demo\n3. Implementation timeline\n4. Q&A session',
    isRecurring: false,
    meetingSettings: {
      autoMute: true,
      autoVideoOff: true,
      waitingRoom: true,
      allowScreenShare: true,
      allowChat: true
    }
  }
];

// Mock Availability
export const mockAvailability: Availability[] = [
  {
    id: 'avail1',
    userId: 'user1',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    bufferTime: 15
  },
  {
    id: 'avail2',
    userId: 'user1',
    dayOfWeek: 2, // Tuesday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    bufferTime: 15
  },
  {
    id: 'avail3',
    userId: 'user1',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    bufferTime: 15
  },
  {
    id: 'avail4',
    userId: 'user1',
    dayOfWeek: 4, // Thursday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    bufferTime: 15
  },
  {
    id: 'avail5',
    userId: 'user1',
    dayOfWeek: 5, // Friday
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    bufferTime: 15
  }
];

// Mock Booking Pages
export const mockBookingPages: BookingPage[] = [
  {
    id: 'book1',
    userId: 'user1',
    slug: 'john-doe',
    title: 'Book a meeting with John Doe',
    description: 'Schedule a meeting with John for project discussions, consultations, or general inquiries.',
    meetingTypes: [
      {
        id: 'mt1',
        name: 'Quick Chat',
        duration: 15,
        description: 'Brief discussion or question',
        isActive: true,
        bufferTime: 5
      },
      {
        id: 'mt2',
        name: 'Project Discussion',
        duration: 60,
        description: 'Detailed project planning and review',
        isActive: true,
        bufferTime: 15
      },
      {
        id: 'mt3',
        name: 'Consultation',
        duration: 30,
        description: 'Technical consultation and advice',
        isActive: true,
        bufferTime: 10
      }
    ],
    availability: mockAvailability,
    timezone: 'America/New_York',
    isActive: true,
    customFields: [
      {
        id: 'cf1',
        name: 'Company',
        type: 'text',
        required: true,
        placeholder: 'Enter your company name'
      },
      {
        id: 'cf2',
        name: 'Meeting Purpose',
        type: 'select',
        required: true,
        options: ['Project Discussion', 'Technical Support', 'General Inquiry', 'Other']
      }
    ],
    settings: {
      requireApproval: false,
      allowRescheduling: true,
      allowCancellation: true,
      advanceBookingDays: 30,
      minBookingNotice: 2
    }
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    type: 'meeting_reminder',
    title: 'Meeting Starting Soon',
    message: 'Weekly Team Sync starts in 15 minutes',
    data: { meetingId: 'm1', startTime: '2024-01-16T09:00:00' },
    isRead: false,
    createdAt: new Date('2024-01-16T08:45:00'),
    scheduledFor: new Date('2024-01-16T08:45:00')
  },
  {
    id: 'notif2',
    userId: 'user1',
    type: 'task_reminder',
    title: 'Task Deadline Approaching',
    message: 'Design new dashboard layout is due tomorrow',
    data: { taskId: '1', deadline: '2024-01-20' },
    isRead: false,
    createdAt: new Date('2024-01-19T09:00:00'),
    scheduledFor: new Date('2024-01-19T09:00:00')
  },
  {
    id: 'notif3',
    userId: 'user1',
    type: 'deadline_alert',
    title: 'Urgent Task Overdue',
    message: 'Fix critical bug in payment system was due 2 hours ago',
    data: { taskId: '5', deadline: '2024-01-16T18:00:00' },
    isRead: true,
    createdAt: new Date('2024-01-16T20:00:00')
  }
];

// Mock Productivity Metrics
export const mockProductivityMetrics: ProductivityMetrics[] = [
  {
    userId: 'user1',
    date: new Date('2024-01-15'),
    tasksCompleted: 3,
    tasksCreated: 2,
    timeSpent: 420, // 7 hours
    meetingsAttended: 2,
    meetingTime: 120, // 2 hours
    focusTime: 300, // 5 hours
    productivityScore: 85
  },
  {
    userId: 'user1',
    date: new Date('2024-01-14'),
    tasksCompleted: 2,
    tasksCreated: 1,
    timeSpent: 360, // 6 hours
    meetingsAttended: 1,
    meetingTime: 60, // 1 hour
    focusTime: 300, // 5 hours
    productivityScore: 78
  }
];

// Mock Time Entries
export const mockTimeEntries: TimeEntry[] = [
  {
    id: 'te1',
    userId: 'user1',
    taskId: '1',
    projectId: 'proj1',
    description: 'Working on dashboard wireframes',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T11:00:00'),
    duration: 120,
    isActive: false,
    tags: ['design', 'wireframes'],
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T11:00:00')
  },
  {
    id: 'te2',
    userId: 'user1',
    taskId: '5',
    projectId: 'proj1',
    description: 'Debugging payment system issues',
    startTime: new Date('2024-01-15T14:00:00'),
    endTime: new Date('2024-01-15T16:00:00'),
    duration: 120,
    isActive: false,
    tags: ['bug-fix', 'payments'],
    createdAt: new Date('2024-01-15T14:00:00'),
    updatedAt: new Date('2024-01-15T16:00:00')
  },
  {
    id: 'te3',
    userId: 'user1',
    taskId: '1',
    projectId: 'proj1',
    description: 'Creating high-fidelity mockups',
    startTime: new Date('2024-01-15T16:30:00'),
    endTime: new Date(),
    duration: 0,
    isActive: true,
    tags: ['design', 'mockups'],
    createdAt: new Date('2024-01-15T16:30:00'),
    updatedAt: new Date()
  }
];