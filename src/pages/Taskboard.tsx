
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import TaskColumn from "@/components/taskboard/TaskColumn";
import TaskDialog from "@/components/taskboard/TaskDialog";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { taskboardData } from "@/data/taskboardData";

const Taskboard = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(taskboardData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    toast({
      title: "Task created",
      description: "Your task has been successfully created.",
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Your task has been successfully deleted.",
    });
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const openAddTaskDialog = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const openEditTaskDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "in-progress");
  const completedTasks = tasks.filter(task => task.status === "completed");

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-care-dark">Task Management</h1>
            <p className="text-gray-500">Manage tasks and track progress</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button onClick={openAddTaskDialog} className="bg-care-primary hover:bg-care-dark">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        <Tabs defaultValue="board" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="board">Board View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TaskColumn 
                title="To Do" 
                count={todoTasks.length} 
                tasks={todoTasks} 
                status="todo"
                onEditTask={openEditTaskDialog}
                onDeleteTask={handleDeleteTask}
                onMoveTask={moveTask}
              />
              
              <TaskColumn 
                title="In Progress" 
                count={inProgressTasks.length} 
                tasks={inProgressTasks} 
                status="in-progress"
                onEditTask={openEditTaskDialog}
                onDeleteTask={handleDeleteTask}
                onMoveTask={moveTask}
              />
              
              <TaskColumn 
                title="Completed" 
                count={completedTasks.length} 
                tasks={completedTasks} 
                status="completed"
                onEditTask={openEditTaskDialog}
                onDeleteTask={handleDeleteTask}
                onMoveTask={moveTask}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="bg-white rounded-md p-6 shadow-sm">
              <p className="text-gray-500">List view coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="bg-white rounded-md p-6 shadow-sm">
              <p className="text-gray-500">Calendar view coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TaskDialog
        open={isDialogOpen}
        task={selectedTask}
        onOpenChange={setIsDialogOpen}
        onSave={(task) => {
          if (selectedTask) {
            handleUpdateTask(task);
          } else {
            handleAddTask(task);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default Taskboard;
