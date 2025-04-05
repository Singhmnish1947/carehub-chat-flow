
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Plus, Trash, Edit, Check, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
}

const TaskCard: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'backlog' | 'in-progress' | 'completed') => void;
}> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const priorityColors = {
    'low': 'bg-blue-100 text-blue-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800'
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id.toString());
  };

  return (
    <Card 
      className="mb-3 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              {task.status !== 'backlog' && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'backlog')}>
                  Move to Backlog
                </DropdownMenuItem>
              )}
              {task.status !== 'in-progress' && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>
                  Move to In Progress
                </DropdownMenuItem>
              )}
              {task.status !== 'completed' && (
                <DropdownMenuItem onClick={() => onStatusChange(task.id, 'completed')}>
                  Mark as Completed
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{task.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback>{task.assignee.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{task.assignee.name}</span>
          </div>
          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
        </div>
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {task.dueDate}
        </div>
      </CardContent>
    </Card>
  );
};

const TaskColumn: React.FC<{
  title: string;
  tasks: Task[];
  status: 'backlog' | 'in-progress' | 'completed';
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'backlog' | 'in-progress' | 'completed') => void;
  onAddTask: (status: 'backlog' | 'in-progress' | 'completed') => void;
}> = ({ title, tasks, status, onEdit, onDelete, onStatusChange, onAddTask }) => {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, targetStatus: 'backlog' | 'in-progress' | 'completed') => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
    onStatusChange(taskId, targetStatus);
  };

  return (
    <div 
      className="bg-gray-50 p-4 rounded-lg"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">{title} ({tasks.length})</h3>
        <Button variant="ghost" size="sm" onClick={() => onAddTask(status)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onStatusChange={onStatusChange} 
        />
      ))}
    </div>
  );
};

const Taskboard = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Review Dr. Patel's patient notes",
      description: "Go through the latest patient notes and provide feedback on the treatment plan.",
      status: 'backlog',
      priority: 'high',
      dueDate: 'Today, 5:00 PM',
      assignee: {
        name: 'Dr. John Doe',
        avatar: '/placeholder.svg',
        initials: 'JD'
      }
    },
    {
      id: 2,
      title: "Update medication inventory system",
      description: "Add new medications and update quantities for existing stock in the inventory system.",
      status: 'backlog',
      priority: 'medium',
      dueDate: 'Tomorrow, 10:00 AM',
      assignee: {
        name: 'Priya Singh',
        avatar: '/placeholder.svg',
        initials: 'PS'
      }
    },
    {
      id: 3,
      title: "Schedule meeting with department heads",
      description: "Arrange a quarterly review meeting with all department heads to discuss performance and goals.",
      status: 'in-progress',
      priority: 'medium',
      dueDate: 'Sep 15, 2:30 PM',
      assignee: {
        name: 'Rahul Kumar',
        avatar: '/placeholder.svg',
        initials: 'RK'
      }
    },
    {
      id: 4,
      title: "Create presentation for board meeting",
      description: "Prepare slides for the upcoming board meeting on hospital performance and upcoming initiatives.",
      status: 'in-progress',
      priority: 'high',
      dueDate: 'Sep 14, 9:00 AM',
      assignee: {
        name: 'Dr. John Doe',
        avatar: '/placeholder.svg',
        initials: 'JD'
      }
    },
    {
      id: 5,
      title: "Review new patient admission process",
      description: "Analyze and improve the current patient admission workflow for better efficiency.",
      status: 'completed',
      priority: 'low',
      dueDate: 'Sep 10, 4:00 PM',
      assignee: {
        name: 'Sunita Sharma',
        avatar: '/placeholder.svg',
        initials: 'SS'
      }
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<'backlog' | 'in-progress' | 'completed'>('backlog');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    assignee: {
      name: 'Dr. John Doe',
      avatar: '/placeholder.svg',
      initials: 'JD'
    }
  });

  const handleAddTask = (status: 'backlog' | 'in-progress' | 'completed') => {
    setNewTaskStatus(status);
    setCurrentTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignee: {
        name: 'Dr. John Doe',
        avatar: '/placeholder.svg',
        initials: 'JD'
      }
    });
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted.",
    });
  };

  const handleStatusChange = (id: number, status: 'backlog' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
    toast({
      title: "Task updated",
      description: "The task status has been successfully updated.",
    });
  };

  const handleSaveTask = () => {
    if (formData.title.trim() === '') {
      toast({
        title: "Error",
        description: "Task title is required.",
        variant: "destructive"
      });
      return;
    }

    if (currentTask) {
      // Edit existing task
      setTasks(tasks.map(task => 
        task.id === currentTask.id ? { ...task, ...formData } : task
      ));
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      });
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now(),
        ...formData,
        status: newTaskStatus
      };
      setTasks([...tasks, newTask]);
      toast({
        title: "Task created",
        description: "A new task has been successfully created.",
      });
    }
    setIsDialogOpen(false);
  };

  const backlogTasks = tasks.filter(task => task.status === 'backlog');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Taskboard</h1>
          <p className="text-gray-500">Manage and track your tasks</p>
        </div>
        <Button onClick={() => handleAddTask('backlog')} className="bg-care-primary">
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn 
          title="Backlog" 
          tasks={backlogTasks} 
          status="backlog"
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn 
          title="In Progress" 
          tasks={inProgressTasks} 
          status="in-progress"
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
        <TaskColumn 
          title="Completed" 
          tasks={completedTasks} 
          status="completed"
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTask={handleAddTask}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium" htmlFor="title">Title</label>
              <Input 
                id="title"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="description">Description</label>
              <Textarea 
                id="description"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" htmlFor="priority">Priority</label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({...formData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="dueDate">Due Date</label>
                <Input 
                  id="dueDate"
                  value={formData.dueDate} 
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  placeholder="e.g., Sep 15, 2:30 PM"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveTask} className="bg-care-primary">
              <Check className="mr-2 h-4 w-4" />
              {currentTask ? 'Update Task' : 'Save Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Taskboard;
