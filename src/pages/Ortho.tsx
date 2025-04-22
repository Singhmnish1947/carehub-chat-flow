
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bone, Calendar, Users, Activity, FileText, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Ortho = () => {
  const { toast } = useToast();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Orthopedics Department</h1>
        <p className="text-gray-500">Manage orthopedic patients and treatments</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Patients</p>
              <h3 className="text-3xl font-bold mt-1">42</h3>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
              <h3 className="text-3xl font-bold mt-1">8</h3>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Surgeries Scheduled</p>
              <h3 className="text-3xl font-bold mt-1">3</h3>
            </div>
            <div className="p-4 bg-red-100 rounded-full">
              <Bone className="h-6 w-6 text-red-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Doctors Available</p>
              <h3 className="text-3xl font-bold mt-1">4</h3>
            </div>
            <div className="p-4 bg-purple-100 rounded-full">
              <Stethoscope className="h-6 w-6 text-purple-700" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2 glass-card animate-glass-fade">
          <CardHeader>
            <CardTitle>Orthopedic Treatment Tracker</CardTitle>
            <CardDescription>Monitor patient progress and treatment plans</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Treatment Tracker Coming Soon</h3>
            <p className="text-gray-500 mt-2 max-w-md text-center">
              The orthopedic treatment tracker is under development. Soon you'll be able to monitor patient progress, rehabilitation plans, and treatment outcomes.
            </p>
            <Button
              className="mt-6 bg-black text-white hover:bg-black/80"
              onClick={() => toast({ title: "Coming Soon", description: "The treatment tracker will be available soon." })}
            >
              Check Back Later
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common orthopedic department tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <Calendar className="h-4 w-4 mr-2" /> Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <FileText className="h-4 w-4 mr-2" /> Create Treatment Plan
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <Bone className="h-4 w-4 mr-2" /> View X-rays
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <Users className="h-4 w-4 mr-2" /> Assign Physiotherapist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="patients">
        <TabsList className="glass-card border border-white/20 p-1">
          <TabsTrigger value="patients" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Patients
          </TabsTrigger>
          <TabsTrigger value="treatments" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Treatments
          </TabsTrigger>
          <TabsTrigger value="equipment" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Equipment
          </TabsTrigger>
          <TabsTrigger value="procedures" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Procedures
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Orthopedic Patients</CardTitle>
              <CardDescription>Manage patients with orthopedic conditions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Patient Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The orthopedic patient management module is under development. Soon you'll be able to track patients, their conditions, and their treatment journeys.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The patient management module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatments" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Orthopedic Treatments</CardTitle>
              <CardDescription>Manage treatment plans and protocols</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Treatment Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The orthopedic treatment management module is being developed. You'll soon be able to create standardized protocols, customize treatment plans, and track rehabilitation progress.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The treatment management module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Orthopedic Equipment</CardTitle>
              <CardDescription>Manage specialized orthopedic equipment</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <h3 className="text-lg font-medium">Equipment Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The orthopedic equipment management module is being built. You'll be able to inventory prosthetics, braces, casting materials, and other specialized equipment.
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
        
        <TabsContent value="procedures" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Orthopedic Procedures</CardTitle>
              <CardDescription>Manage orthopedic surgeries and procedures</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bone className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Procedure Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The orthopedic procedure management module is under development. Soon you'll be able to schedule surgeries, track implants, and manage post-operative care.
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
      </Tabs>
    </DashboardLayout>
  );
};

export default Ortho;
