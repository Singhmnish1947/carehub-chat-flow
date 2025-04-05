
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TaskColumn from "@/components/taskboard/TaskColumn";
import TaskDialog from "@/components/taskboard/TaskDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskPriority, TaskStatus, Staff } from "@/types/task";
import { taskboardData } from "@/data/taskboardData";
import { staffData } from "@/data/staffData";

const Taskboard = () => {
  const [tasks, setTasks] = useState<Task[]>(taskboardData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  
  const { toast } = useToast();

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group tasks by status
  const groupedTasks = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed')
  };

  const handleCreateTask = () => {
    setDialogMode('create');
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setDialogMode('edit');
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (dialogMode === 'create') {
      // Add new task
      const newTask = {
        ...task,
        id: `task-${Date.now()}`
      };
      
      setTasks([...tasks, newTask]);
      
      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
    } else {
      // Update existing task
      const updatedTasks = tasks.map(t => {
        if (t.id === task.id) {
          return task;
        }
        return t;
      });
      
      setTasks(updatedTasks);
      
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setIsDialogOpen(false);
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully."
    });
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    toast({
      title: "Task updated",
      description: "Task status has been updated."
    });
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4">
          <div>
            <h1 className="text-2xl font-bold text-care-dark">Taskboard</h1>
            <p className="text-gray-500">Manage your tasks and track progress</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleCreateTask}
              className="bg-care-primary hover:bg-care-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 p-4 border-b bg-white">
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as TaskStatus | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filterPriority}
              onValueChange={(value) => setFilterPriority(value as TaskPriority | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <TaskColumn 
              title="To Do" 
              tasks={groupedTasks.todo}
              status="todo"
              onTaskClick={handleEditTask}
              onStatusChange={handleStatusChange}
            />
            
            <TaskColumn 
              title="In Progress" 
              tasks={groupedTasks["in-progress"]}
              status="in-progress"
              onTaskClick={handleEditTask}
              onStatusChange={handleStatusChange}
            />
            
            <TaskColumn 
              title="Completed" 
              tasks={groupedTasks.completed}
              status="completed"
              onTaskClick={handleEditTask}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
      
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        mode={dialogMode}
        staff={staffData}
      />
    </DashboardLayout>
  );
};

export default Taskboard;
