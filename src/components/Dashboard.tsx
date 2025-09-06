import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskCard from './TaskCard';
// import CalendarView from './CalendarView';
import MeetingCard from './MeetingCard';
import TaskModal from './TaskModal';
import { Task, Meeting, CalendarView as ViewType } from '@/types/task';

interface DashboardProps {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onJoinMeeting?: (meeting: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onJoinMeeting }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'meetings'>('tasks');
  const [calendarView, setCalendarView] = useState<ViewType>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    upcomingMeetings: 0
  });

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate loading data
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Draft and finalize the Q4 project proposal',
        status: 'in-progress',
        priority: 'high',
        category: 'work',
        deadline: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['project', 'proposal'],
        estimatedTime: 120
      },
      {
        id: '2',
        title: 'Team standup meeting',
        description: 'Daily standup with the development team',
        status: 'todo',
        priority: 'medium',
        category: 'meeting',
        deadline: new Date('2024-01-10'),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['meeting', 'team']
      },
      {
        id: '3',
        title: 'Review code changes',
        description: 'Review and approve pending pull requests',
        status: 'completed',
        priority: 'high',
        category: 'work',
        deadline: new Date('2024-01-08'),
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date('2024-01-08'),
        tags: ['code-review']
      }
    ];

    const mockMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Weekly Team Sync',
        description: 'Weekly team synchronization meeting',
        startTime: new Date('2024-01-10T10:00:00'),
        endTime: new Date('2024-01-10T11:00:00'),
        category: 'meeting',
        attendees: [
          { id: '1', email: 'john@example.com', name: 'John Doe', status: 'accepted' },
          { id: '2', email: 'jane@example.com', name: 'Jane Smith', status: 'pending' }
        ],
        meetingType: 'video',
        meetingLink: 'https://meet.jit.si/team-sync-123',
        isRecurring: true,
        status: 'busy',
        meetingSettings: {
          autoMute: true,
          autoVideoOff: true,
          waitingRoom: false,
          allowScreenShare: true,
          allowChat: true
        },
        createdBy: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setTasks(mockTasks);
    setMeetings(mockMeetings);
    
    // Calculate stats
    setStats({
      totalTasks: mockTasks.length,
      completedTasks: mockTasks.filter(t => t.status === 'completed').length,
      pendingTasks: mockTasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length,
      overdueTasks: mockTasks.filter(t => t.deadline && t.deadline < new Date() && t.status !== 'completed').length,
      upcomingMeetings: mockMeetings.length
    });
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const upcomingMeetings = meetings.filter(meeting => 
    meeting.startTime > new Date()
  );

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData, updatedAt: new Date() }
          : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title!,
        description: taskData.description,
        status: taskData.status!,
        priority: taskData.priority!,
        category: taskData.category!,
        deadline: taskData.deadline,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: taskData.tags,
        estimatedTime: taskData.estimatedTime
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        let newStatus: 'todo' | 'in-progress' | 'completed';
        if (task.status === 'completed') {
          newStatus = 'todo';
        } else if (task.status === 'todo') {
          newStatus = 'in-progress';
        } else {
          newStatus = 'completed';
        }
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined,
          updatedAt: new Date()
        };
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Task Manager</h1>
                <p className="text-slate-400">Welcome back, {user?.name || 'User'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleCreateTask}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Calendar className="h-4 w-4 mr-2" />
                New Meeting
              </Button>
              {onLogout && (
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="border-red-600 text-red-300 hover:bg-red-800"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-white">{stats.totalTasks}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-green-500">{stats.completedTasks}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">{stats.pendingTasks}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Overdue</p>
                    <p className="text-2xl font-bold text-red-500">{stats.overdueTasks}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="meetings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Meetings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Task Filters */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-full sm:w-40 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Task List */}
            <div className="grid gap-4">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard 
                    task={task} 
                    onToggle={handleToggleTask}
                    onEdit={handleEditTask}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="text-center text-slate-400 py-8">
              Calendar view coming soon...
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <div className="grid gap-4">
              {upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MeetingCard meeting={meeting} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        mode={editingTask ? 'edit' : 'create'}
      />
    </div>
  );
};

export default Dashboard;