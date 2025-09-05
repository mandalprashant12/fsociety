import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Button } from './ui/enhanced-button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { Input } from './ui/input';
import { mockTasks, mockEvents, mockMeetings } from '@/data/mockData';
import { Task } from '@/types/task';

export function Dashboard() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
  const todayMeetings = mockMeetings.length;

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingTasks = filteredTasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="elegant">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 bg-gradient-subtle border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-subtle border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-400">{completedTasks}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-subtle border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Urgent</p>
                <p className="text-2xl font-bold text-red-400">{urgentTasks}</p>
              </div>
              <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-subtle border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Meetings Today</p>
                <p className="text-2xl font-bold text-blue-400">{todayMeetings}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Tasks</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No tasks found</p>
                </Card>
              ) : (
                upcomingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Upcoming Meetings */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Upcoming Meetings
              </h3>
              <div className="space-y-3">
                {mockMeetings.slice(0, 3).map(meeting => (
                  <div key={meeting.id} className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm text-foreground">{meeting.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(meeting.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team Calendar
                </Button>
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-category-work/20 text-blue-400">Work</Badge>
                  <span className="text-sm text-muted-foreground">
                    {tasks.filter(t => t.category === 'work').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-category-personal/20 text-purple-400">Personal</Badge>
                  <span className="text-sm text-muted-foreground">
                    {tasks.filter(t => t.category === 'personal').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-category-meeting/20 text-pink-400">Meetings</Badge>
                  <span className="text-sm text-muted-foreground">
                    {tasks.filter(t => t.category === 'meeting').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-category-urgent/20 text-red-400">Urgent</Badge>
                  <span className="text-sm text-muted-foreground">
                    {tasks.filter(t => t.category === 'urgent').length}
                  </span>
                </div>
              </div>
            </Card>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}