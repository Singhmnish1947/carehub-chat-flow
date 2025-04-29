
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, Heart } from "lucide-react";

const GynoPage = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2 p-6 bg-white">
          <h2 className="text-xl font-bold mb-2">Maternal Care Tracker</h2>
          <p className="text-gray-500 mb-8">Monitor pregnancy progress and maternity care</p>
          
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gray-300">
                <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C72.1,90 90,72.1 90,50 C90,27.9 72.1,10 50,10 Z" fill="currentColor" />
                <path d="M50,20 L50,50 L70,70" stroke="currentColor" strokeWidth="10" fill="none" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-3">Maternal Care Tracker Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              The maternal care tracking module is under development. Soon you'll be able to monitor pregnancy progress, schedule check-ups, and track important health metrics.
            </p>
            <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
              Check Back Later
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
          <p className="text-gray-500 mb-4">Common gynecology department tasks</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Create Care Plan
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <Clock className="mr-2 h-4 w-4" />
              Register Pregnancy
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-left" size="lg">
              <Heart className="mr-2 h-4 w-4" />
              View Patient History
            </Button>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="bg-black rounded-md mb-6">
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
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Gynecology Patients</h2>
            <p className="text-gray-500 mb-6">Manage gynecology patients and records</p>
            
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500 mb-4">
                No patients have been added to the gynecology department yet.
              </p>
              <Button className="bg-black hover:bg-gray-800">
                Add Patient
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="antenatal">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Antenatal Care Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The antenatal care module is under development. You'll be able to manage pregnancy checkups and track fetal development.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="procedures">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Procedures Management Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The procedures management module is under development. You'll be able to schedule and track gynecological procedures.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="education">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Patient Education Resources Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              The patient education module is under development. You'll be able to share informational resources with patients.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default GynoPage;
