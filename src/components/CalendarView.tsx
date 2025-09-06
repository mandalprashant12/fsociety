import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { CalendarView as ViewType, Task, Meeting } from '@/types/task';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, subDays, startOfDay, endOfDay } from 'date-fns';

interface CalendarViewProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  tasks?: Task[];
  meetings?: Meeting[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ view, onViewChange, tasks = [], meetings = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'day') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
    } else if (view === 'month') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 30 : -30));
    }
  };

  const getDaysInView = () => {
    if (view === 'day') {
      return [currentDate];
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else if (view === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
    return [];
  };

  const getEventsForDate = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    const dayTasks = tasks.filter(task => 
      task.deadline && isSameDay(task.deadline, date)
    );
    
    const dayMeetings = meetings.filter(meeting => 
      isSameDay(meeting.startTime, date)
    );
    
    return { tasks: dayTasks, meetings: dayMeetings };
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        time: format(new Date().setHours(hour, 0, 0, 0), 'HH:mm'),
        label: format(new Date().setHours(hour, 0, 0, 0), 'h a')
      });
    }
    return slots;
  };

  const renderDayView = () => {
    const events = getEventsForDate(currentDate);
    const timeSlots = getTimeSlots();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {format(currentDate, 'EEEE, MMMM dd, yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <div key={slot.hour} className="flex border-b border-slate-700">
                      <div className="w-20 p-3 text-sm text-slate-400 border-r border-slate-700">
                        {slot.label}
                      </div>
                      <div className="flex-1 p-3 min-h-[60px]">
                        {/* Events for this time slot would go here */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.tasks.length > 0 ? (
                  <div className="space-y-2">
                    {events.tasks.map((task) => (
                      <div key={task.id} className="p-2 bg-slate-700/50 rounded text-sm">
                        <p className="text-white font-medium">{task.title}</p>
                        <p className="text-slate-400 text-xs">{task.priority}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No tasks for this day</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events.meetings.length > 0 ? (
                  <div className="space-y-2">
                    {events.meetings.map((meeting) => (
                      <div key={meeting.id} className="p-2 bg-slate-700/50 rounded text-sm">
                        <p className="text-white font-medium">{meeting.title}</p>
                        <p className="text-slate-400 text-xs">
                          {format(meeting.startTime, 'h:mm a')} - {format(meeting.endTime, 'h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No meetings for this day</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysInView();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Week of {format(days[0], 'MMM dd')} - {format(days[days.length - 1], 'MMM dd, yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const events = getEventsForDate(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <div key={index} className="border-r border-slate-700 last:border-r-0">
                    <div className={`p-3 border-b border-slate-700 ${
                      isCurrentDay ? 'bg-purple-600/20' : ''
                    }`}>
                      <div className="text-center">
                        <p className="text-sm text-slate-400">
                          {format(day, 'EEE')}
                        </p>
                        <p className={`text-lg font-semibold ${
                          isCurrentDay ? 'text-purple-400' : 'text-white'
                        }`}>
                          {format(day, 'd')}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 min-h-[200px]">
                      <div className="space-y-1">
                        {events.tasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className="p-1 bg-blue-500/20 rounded text-xs text-blue-300 truncate"
                            onClick={() => setSelectedDate(day)}
                          >
                            {task.title}
                          </div>
                        ))}
                        {events.meetings.slice(0, 2).map((meeting) => (
                          <div
                            key={meeting.id}
                            className="p-1 bg-green-500/20 rounded text-xs text-green-300 truncate"
                            onClick={() => setSelectedDate(day)}
                          >
                            {meeting.title}
                          </div>
                        ))}
                        {(events.tasks.length + events.meetings.length) > 5 && (
                          <div className="text-xs text-slate-400 text-center">
                            +{(events.tasks.length + events.meetings.length) - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInView();
    const firstDay = days[0];
    const lastDay = days[days.length - 1];
    
    // Add empty cells for days before the first day of the month
    const startOfFirstWeek = startOfWeek(firstDay, { weekStartsOn: 1 });
    const emptyDays = eachDayOfInterval({
      start: startOfFirstWeek,
      end: subDays(firstDay, 1)
    });

    const allDays = [...emptyDays, ...days];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="grid grid-cols-7">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="p-3 border-b border-slate-700 text-center">
                  <p className="text-sm font-medium text-slate-400">{day}</p>
                </div>
              ))}
              {allDays.map((day, index) => {
                const events = getEventsForDate(day);
                const isCurrentDay = isToday(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                
                return (
                  <div
                    key={index}
                    className={`p-2 min-h-[120px] border-r border-b border-slate-700 last:border-r-0 ${
                      isCurrentDay ? 'bg-purple-600/20' : ''
                    } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-medium ${
                        isCurrentDay ? 'text-purple-400' : isCurrentMonth ? 'text-white' : 'text-slate-500'
                      }`}>
                        {format(day, 'd')}
                      </p>
                      {events.tasks.length + events.meetings.length > 0 && (
                        <Badge className="bg-purple-600 text-white text-xs">
                          {events.tasks.length + events.meetings.length}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {events.tasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="p-1 bg-blue-500/20 rounded text-xs text-blue-300 truncate"
                        >
                          {task.title}
                        </div>
                      ))}
                      {events.meetings.slice(0, 1).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="p-1 bg-green-500/20 rounded text-xs text-green-300 truncate"
                        >
                          {meeting.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('day')}
            className={view === 'day' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
          >
            Day
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('week')}
            className={view === 'week' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('month')}
            className={view === 'month' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </motion.div>
    </div>
  );
};

export default CalendarView;
