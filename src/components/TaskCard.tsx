import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, AlertCircle, MoreVertical, Calendar, Tag } from 'lucide-react';
import { Task } from '@/types/task';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const isOverdue = task.deadline && isBefore(task.deadline, new Date()) && task.status !== 'completed';
  const isDueSoon = task.deadline && isAfter(task.deadline, new Date()) && isBefore(task.deadline, addDays(new Date(), 1));

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;
    return `In ${diffInDays} days`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200 ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <button
                onClick={() => onToggle?.(task.id)}
                className="mt-1 hover:scale-110 transition-transform duration-200"
              >
                {getStatusIcon(task.status)}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className={`font-semibold text-lg ${
                    task.status === 'completed' ? 'line-through text-slate-400' : 'text-white'
                  }`}>
                    {task.title}
                  </h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                
                {task.description && (
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {task.deadline && (
                    <div className={`flex items-center space-x-1 ${
                      isOverdue ? 'text-red-400' : isDueSoon ? 'text-yellow-400' : 'text-slate-400'
                    }`}>
                      <Clock className="h-4 w-4" />
                      <span>{formatDeadline(task.deadline)}</span>
                      {isOverdue && <AlertCircle className="h-4 w-4 text-red-400" />}
                    </div>
                  )}
                  
                  {task.estimatedTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.estimatedTime}m</span>
                    </div>
                  )}
                </div>
                
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Tag className="h-4 w-4 text-slate-400" />
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-slate-700/50 border-slate-600 text-slate-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={() => onEdit?.(task)}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {task.status === 'completed' && task.completedAt && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-400">
                Completed on {format(task.completedAt, 'MMM dd, yyyy')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;