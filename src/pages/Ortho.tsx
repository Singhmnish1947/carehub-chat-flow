
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, SquareX, Users } from "lucide-react";

const OrthoPage = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2 p-6 bg-white">
          <h2 className="text-xl font-bold mb-2">Orthopedic Treatment Tracker</h2>
          <p className="text-gray-500 mb-8">Monitor patient progress and treatment plans</p>
          
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gray-300">
                <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C72.1,90 90,72.1 90,50 C90,27.9 72.1,10 50,10 Z" fill="currentColor" />
                <path d="M50,20 L50,50 L70,70" stroke="currentColor" strokeWidth="10" fill="none" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-3">Treatment Tracker Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              The orthopedic treatment tracker is under development. Soon you'll be able to monitor patient progress, rehabilitation plans, and treatment outcomes.
            </p>
            <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
              Check Back Later
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
          <p className="text-gray-500 mb-4">Common orthopedic department tasks</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Create Treatment Plan
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <SquareX className="mr-2 h-4 w-4" />
              View X-rays
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <Users className="mr-2 h-4 w-4" />
              Assign Physiotherapist
            </Button>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="bg-black rounded-md mb-6">
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
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Orthopedic Patients</h2>
            <p className="text-gray-500 mb-6">Manage patients with orthopedic conditions</p>
            
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500 mb-4">
                No patients have been added to the orthopedics department yet.
              </p>
              <Button className="bg-black hover:bg-gray-800">
                Add Patient
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatments">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Treatments View Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The treatments management module is under development. You'll be able to create and track treatment plans.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="equipment">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Equipment Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The equipment management module is under development. You'll be able to track orthopedic equipment and supplies.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="procedures">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Procedures Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The procedures management module is under development. You'll be able to track orthopedic procedures and protocols.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default OrthoPage;
