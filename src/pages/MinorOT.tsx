
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Calendar, Clock, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MinorOT = () => {
  const { toast } = useToast();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Minor Operation Theatre</h1>
        <p className="text-gray-500">Manage minor surgical procedures and appointments</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Procedures</p>
              <h3 className="text-3xl font-bold mt-1">8</h3>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Scissors className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <h3 className="text-3xl font-bold mt-1">12</h3>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Time</p>
              <h3 className="text-3xl font-bold mt-1">32m</h3>
            </div>
            <div className="p-4 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Available Staff</p>
              <h3 className="text-3xl font-bold mt-1">6</h3>
            </div>
            <div className="p-4 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="schedule">
        <TabsList className="glass-card border border-white/20 p-1">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="procedures" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Procedures
          </TabsTrigger>
          <TabsTrigger value="equipment" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Equipment
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Staff
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Operation Schedule</CardTitle>
              <CardDescription>Minor OT schedule for today and upcoming procedures</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Operation Schedule Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The scheduling module for the Minor Operation Theatre is under development. You'll be able to manage procedure schedules, patient assignments, and staff allocation here.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The scheduling module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="procedures" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Procedure Management</CardTitle>
              <CardDescription>Manage minor surgical procedures</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Scissors className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Procedure Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The procedure management module is being developed. Soon you'll be able to set up procedure templates, manage required equipment, and track outcomes.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The procedure management module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Equipment Inventory</CardTitle>
              <CardDescription>Manage Minor OT equipment and supplies</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <h3 className="text-lg font-medium">Equipment Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The equipment inventory module is under development. You'll be able to track surgical equipment, manage sterilization, and monitor supply levels.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The equipment inventory module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Staff Schedule</CardTitle>
              <CardDescription>Manage staff assignments and shifts for the Minor OT</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Staff Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The staff management module for the Minor OT is being built. Soon you'll be able to schedule staff, manage shifts, and track surgical teams.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The staff management module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MinorOT;
