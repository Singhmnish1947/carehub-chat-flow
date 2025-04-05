
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Edit, 
  Trash, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Tag 
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onMove }) => {
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default" className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>;
      default:
        return null;
    }
  };

  const canMoveLeft = task.status !== "todo";
  const canMoveRight = task.status !== "completed";

  const handleMoveLeft = () => {
    if (task.status === "in-progress") {
      onMove("todo");
    } else if (task.status === "completed") {
      onMove("in-progress");
    }
  };

  const handleMoveRight = () => {
    if (task.status === "todo") {
      onMove("in-progress");
    } else if (task.status === "in-progress") {
      onMove("completed");
    }
  };

  return (
    <Card className="p-4 bg-white shadow-sm hover:shadow transition-all">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-care-dark">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Task actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {canMoveLeft && (
              <DropdownMenuItem onClick={handleMoveLeft}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Move Left
              </DropdownMenuItem>
            )}
            {canMoveRight && (
              <DropdownMenuItem onClick={handleMoveRight}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Move Right
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center mt-3 text-xs text-gray-500">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
        <Tag className="h-3 w-3 ml-3 mr-1" />
        {task.tags?.map((tag, idx) => (
          <span key={idx} className="mr-1">#{tag}</span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback className="bg-care-primary text-xs text-white">
              {task.assignee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600 ml-2">{task.assignee.name}</span>
        </div>
        {getPriorityBadge(task.priority)}
      </div>
    </Card>
  );
};

export default TaskCard;
