import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Clock, Calendar, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const categoryColors = {
  work: 'bg-category-work/20 text-blue-400',
  personal: 'bg-category-personal/20 text-purple-400',
  meeting: 'bg-category-meeting/20 text-pink-400',
  urgent: 'bg-category-urgent/20 text-red-400'
};

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group bg-card border border-border rounded-lg p-4 hover:shadow-soft transition-smooth",
        isCompleted && "opacity-60",
        isOverdue && "border-red-500/40 shadow-red-500/10"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleComplete?.(task.id)}
            className={cn(
              "h-6 w-6 rounded-full border-2 transition-smooth",
              isCompleted
                ? "bg-green-500/20 border-green-500 text-green-400"
                : "border-muted-foreground/30 hover:border-primary"
            )}
          >
            {isCompleted && <CheckCircle2 className="h-4 w-4" />}
          </Button>
          <div>
            <h3 className={cn(
              "font-semibold text-foreground mb-1",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(task)}
            className="h-8 w-8"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(task.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={categoryColors[task.category]}>
          {task.category}
        </Badge>
        <Badge variant="outline" className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>
        {task.tags?.map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          {task.deadline && (
            <div className={cn(
              "flex items-center gap-1",
              isOverdue && "text-red-400"
            )}>
              <Calendar className="h-4 w-4" />
              {new Date(task.deadline).toLocaleDateString()}
            </div>
          )}
          {task.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {task.estimatedTime}m
            </div>
          )}
        </div>
        
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          task.status === 'todo' && "bg-gray-500/20 text-gray-400",
          task.status === 'in-progress' && "bg-blue-500/20 text-blue-400",
          task.status === 'completed' && "bg-green-500/20 text-green-400"
        )}>
          {task.status === 'in-progress' ? 'In Progress' : task.status}
        </div>
      </div>
    </motion.div>
  );
}