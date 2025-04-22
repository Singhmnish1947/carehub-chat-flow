
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Uterus, Calendar, Users, Activity, FileText, Stethoscope, Baby } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Gyno = () => {
  const { toast } = useToast();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Gynecology Department</h1>
        <p className="text-gray-500">Manage gynecology patients and maternal care</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Patients</p>
              <h3 className="text-3xl font-bold mt-1">54</h3>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Antenatal Patients</p>
              <h3 className="text-3xl font-bold mt-1">21</h3>
            </div>
            <div className="p-4 bg-pink-100 rounded-full">
              <Baby className="h-6 w-6 text-pink-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Appointments</p>
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
              <p className="text-sm font-medium text-gray-500">Available Doctors</p>
              <h3 className="text-3xl font-bold mt-1">5</h3>
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
            <CardTitle>Maternal Care Tracker</CardTitle>
            <CardDescription>Monitor pregnancy progress and maternity care</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Maternal Care Tracker Coming Soon</h3>
            <p className="text-gray-500 mt-2 max-w-md text-center">
              The maternal care tracking module is under development. Soon you'll be able to monitor pregnancy progress, schedule check-ups, and track important health metrics.
            </p>
            <Button
              className="mt-6 bg-black text-white hover:bg-black/80"
              onClick={() => toast({ title: "Coming Soon", description: "The maternal care tracker will be available soon." })}
            >
              Check Back Later
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-glass-fade">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common gynecology department tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <Calendar className="h-4 w-4 mr-2" /> Schedule Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <FileText className="h-4 w-4 mr-2" /> Create Care Plan
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <Baby className="h-4 w-4 mr-2" /> Register Pregnancy
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Coming Soon" })}>
                <Uterus className="h-4 w-4 mr-2" /> View Patient History
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
          <TabsTrigger value="antenatal" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Antenatal Care
          </TabsTrigger>
          <TabsTrigger value="procedures" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Procedures
          </TabsTrigger>
          <TabsTrigger value="education" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Patient Education
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Gynecology Patients</CardTitle>
              <CardDescription>Manage gynecology patients and records</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Patient Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The gynecology patient management module is under development. Soon you'll be able to track patients, maintain medical histories, and manage treatments.
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
        
        <TabsContent value="antenatal" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Antenatal Care</CardTitle>
              <CardDescription>Manage pregnancy monitoring and care</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Baby className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Antenatal Care Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The antenatal care module is being developed. Soon you'll be able to track pregnancy progress, schedule regular check-ups, and monitor maternal health metrics.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The antenatal care module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="procedures" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Gynecological Procedures</CardTitle>
              <CardDescription>Manage gynecological procedures and surgeries</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Uterus className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Procedure Management Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The gynecological procedure management module is under development. Soon you'll be able to schedule procedures, manage pre and post-operative care, and track outcomes.
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
        
        <TabsContent value="education" className="mt-6">
          <Card className="glass-card animate-glass-fade">
            <CardHeader>
              <CardTitle>Patient Education</CardTitle>
              <CardDescription>Educational resources for gynecology patients</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Patient Education Resources Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center">
                The patient education module is being built. Soon you'll be able to provide educational materials, pregnancy guides, and health information to patients.
              </p>
              <Button
                className="mt-6 bg-black text-white hover:bg-black/80"
                onClick={() => toast({ title: "Coming Soon", description: "The patient education module will be available soon." })}
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

export default Gyno;
