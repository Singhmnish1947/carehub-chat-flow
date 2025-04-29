
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const MajorOTPage = () => {
  return (
    <DashboardLayout>
      <Card className="bg-amber-50 border border-amber-200 flex items-center p-4 mb-6">
        <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h2 className="font-medium text-amber-800">OT #2 Requires Maintenance</h2>
          <p className="text-sm text-amber-700">Scheduled maintenance for ventilation system - Available from 25 Apr</p>
        </div>
        <Button variant="outline" className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
          View Details
        </Button>
      </Card>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="bg-black rounded-md mb-6">
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
          <Card className="p-8 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Operation Theatre Schedule</h2>
            <p className="text-gray-500 mb-12">Schedule and manage major surgical procedures</p>
            
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full text-gray-300">
                  <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C72.1,90 90,72.1 90,50 C90,27.9 72.1,10 50,10 Z" fill="currentColor" />
                  <path d="M50,20 L50,50 L70,70" stroke="currentColor" strokeWidth="10" fill="none" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">OT Scheduling Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                The Major OT scheduling module is under development. You'll soon be able to schedule surgeries, assign operation theatres, and coordinate surgical teams.
              </p>
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
                Check Back Later
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="surgeries">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Surgeries View Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The surgeries management module is under development. You'll be able to schedule and track surgical procedures.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="teams">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Surgical Teams Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The surgical teams management module is under development. You'll be able to create and manage surgical teams.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="equipment">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Equipment Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The equipment management module is under development. You'll be able to track and maintain surgical equipment.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default MajorOTPage;
