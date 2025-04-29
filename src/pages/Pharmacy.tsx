
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, AlertCircle, Calendar, FileText, Pill, Search } from "lucide-react";

const PharmacyPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy</h1>
        <p className="text-gray-600">Manage medication inventory and prescriptions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Total Medications</p>
            <h2 className="text-3xl font-bold">6</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Pill size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Low Stock</p>
            <h2 className="text-3xl font-bold">0</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <AlertCircle size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Expiring Soon</p>
            <h2 className="text-3xl font-bold">6</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Calendar size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Pending Prescriptions</p>
            <h2 className="text-3xl font-bold">1</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
            <FileText size={24} />
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="bg-white border border-gray-200 rounded-md">
          <TabsTrigger value="inventory" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Inventory
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="dispensing" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Dispensing
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-6">
          <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search inventory..." 
                className="pl-10 bg-white border border-gray-200"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-56">
                <select className="w-full p-2 border border-gray-200 rounded-md">
                  <option>All Categories</option>
                  <option>Analgesics</option>
                  <option>Antibiotics</option>
                  <option>Antihypertensives</option>
                  <option>Antidiabetics</option>
                </select>
              </div>
              <Button className="bg-black hover:bg-gray-800 gap-2">
                <Package size={16} />
                Add Medication
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  Analgesic
                </div>
                <img 
                  src="/lovable-uploads/ff9ef56a-904a-4387-bbd2-4bd8cceca136.png" 
                  alt="Paracetamol" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Paracetamol 500mg</h3>
                <p className="text-sm text-gray-500">MED001</p>
                <div className="mt-2 flex justify-between items-center">
                  <p><span className="text-gray-500">Stock:</span> <span className="font-medium text-green-600">250 units</span></p>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <p><span className="text-gray-500">Price:</span> <span className="font-medium">₹5.99</span></p>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  Antibiotic
                </div>
                <img 
                  src="/lovable-uploads/383be895-d7bd-417e-a8e1-c4f8bd2c1c83.png" 
                  alt="Azithromycin" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Azithromycin 250mg</h3>
                <p className="text-sm text-gray-500">MED002</p>
                <div className="mt-2 flex justify-between items-center">
                  <p><span className="text-gray-500">Stock:</span> <span className="font-medium text-green-600">120 units</span></p>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <p><span className="text-gray-500">Price:</span> <span className="font-medium">₹12.50</span></p>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  Antihypertensive
                </div>
                <img 
                  src="/lovable-uploads/af1b4d48-905c-409b-af69-0eb3bec618a5.png" 
                  alt="Lisinopril" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Lisinopril 10mg</h3>
                <p className="text-sm text-gray-500">MED003</p>
                <div className="mt-2 flex justify-between items-center">
                  <p><span className="text-gray-500">Stock:</span> <span className="font-medium text-green-600">180 units</span></p>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <p><span className="text-gray-500">Price:</span> <span className="font-medium">₹8.75</span></p>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  Antidiabetic
                </div>
                <img 
                  src="/lovable-uploads/179b9d9f-4460-4b8d-9130-43dce33875c2.png" 
                  alt="Metformin" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Metformin 500mg</h3>
                <p className="text-sm text-gray-500">MED004</p>
                <div className="mt-2 flex justify-between items-center">
                  <p><span className="text-gray-500">Stock:</span> <span className="font-medium text-green-600">200 units</span></p>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <p><span className="text-gray-500">Price:</span> <span className="font-medium">₹7.25</span></p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="prescriptions">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">Prescriptions view is under development</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              This feature will be coming soon. You'll be able to view, create and manage patient prescriptions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="dispensing">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
            <Pill className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">Dispensing module is under development</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              This feature will be coming soon. You'll be able to track and record medication dispensing to patients.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">Reports module is under development</h3>
            <p className="text-gray-500 mt-2 max-w-md">
              This feature will be coming soon. You'll be able to generate reports on medication usage, inventory changes, and more.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PharmacyPage;
