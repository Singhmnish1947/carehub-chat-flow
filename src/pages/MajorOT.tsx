
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Calendar, Clock, Users, Activity, Heart, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MajorOT = () => {
  const { toast } = useToast();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Major Operation Theatre</h1>
        <p className="text-gray-500">Manage complex surgical procedures and operation schedules</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Scheduled Surgeries</p>
              <h3 className="text-3xl font-bold mt-1">6</h3>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Scissors className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Available OTs</p>
              <h3 className="text-3xl font-bold mt-1">3/5</h3>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Ongoing Surgeries</p>
              <h3 className="text-3xl font-bold mt-1">2</h3>
            </div>
            <div className="p-4 bg-red-100 rounded-full">
              <Heart className="h-6 w-6 text-red-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Surgical Teams</p>
              <h3 className="text-3xl font-bold mt-1">4</h3>
            </div>
            <div className="p-4 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alert Card */}
      <Card className="glass-card animate-glass-fade mb-6 border-yellow-300">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="rounded-full bg-yellow-100 p-3">
            <AlertTriangle className="h-6 w-6 text-yellow-700" />
          </div>
          <div>
            <h3 className="font-medium">OT #2 Requires Maintenance</h3>
            <p className="text-sm text-gray-500">Scheduled maintenance for ventilation system - Available from 25 Apr</p>
          </div>
          <Button className="ml-auto" variant="outline" size="sm">View Details</Button>
        </CardContent>
      </Card>
      
      {/* Tabs */}
      <Tabs defaultValue="schedule">
        <TabsList className="glass-card border border-white/20 p-1">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-black data-[state=active]:text-white">
            OT Schedule
          </TabsTrigger>
          <TabsTrigger value="surgeries" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Surgeries
          </TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Surgical Teams
          </TabsTrigger>
          <TabsTrigger value="equipment" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Equipment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Operation Theatre Schedule</CardTitle>
              <CardDescription>Schedule and manage major surgical procedures</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">OT Scheduling Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The Major OT scheduling module is under development. You'll soon be able to schedule surgeries, assign operation theatres, and coordinate surgical teams.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The OT scheduling module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="surgeries" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Surgery Management</CardTitle>
              <CardDescription>Manage complex surgical procedures</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Scissors className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Surgery Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The surgery management module is being developed. Soon you'll be able to create surgery templates, estimate durations, track supplies needed, and manage post-operative care plans.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The surgery management module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teams" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Surgical Teams</CardTitle>
              <CardDescription>Manage surgical teams and staff assignments</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Surgical Team Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The surgical team management module is under development. You'll be able to create teams, assign staff members, manage their specialties, and track their availability.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The surgical team management module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Surgical Equipment</CardTitle>
              <CardDescription>Manage specialized surgical equipment and supplies</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <h3 className="text-lg font-medium">Equipment Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The surgical equipment management module is being built. You'll be able to inventory specialized equipment, track sterilization status, and manage maintenance schedules.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The equipment management module will be available soon." })}
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

export default MajorOT;
