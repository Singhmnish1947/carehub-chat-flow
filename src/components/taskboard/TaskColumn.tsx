
import React from "react";
import { Card } from "@/components/ui/card";
import TaskCard from "./TaskCard";
import { Task, TaskStatus } from "@/types/task";

interface TaskColumnProps {
  title: string;
  count: number;
  tasks: Task[];
  status: TaskStatus;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  count, 
  tasks, 
  status,
  onEditTask,
  onDeleteTask,
  onMoveTask
}) => {
  const getColumnStyles = () => {
    switch (status) {
      case "todo":
        return "bg-gray-50 border-t-4 border-gray-400";
      case "in-progress":
        return "bg-blue-50 border-t-4 border-blue-400";
      case "completed":
        return "bg-green-50 border-t-4 border-green-400";
      default:
        return "bg-gray-50 border-t-4 border-gray-400";
    }
  };

  return (
    <div className={`rounded-md shadow-sm ${getColumnStyles()}`}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <span className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
      </div>
      <div className="p-2 h-[65vh] overflow-y-auto">
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
                onMove={(newStatus) => onMoveTask(task.id, newStatus)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-24 text-gray-400 text-sm">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
