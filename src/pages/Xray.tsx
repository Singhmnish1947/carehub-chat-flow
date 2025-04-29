
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Upload, 
  Search, 
  SquareX, 
  Clock,
  CheckCircle,
  Bot
} from "lucide-react";

const XrayPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">X-Ray Department</h1>
        <p className="text-gray-600">Manage X-ray studies with AI-assisted analysis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Total X-rays</p>
            <h2 className="text-3xl font-bold">5</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <SquareX size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Pending</p>
            <h2 className="text-3xl font-bold">1</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Processing</p>
            <h2 className="text-3xl font-bold">1</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <Clock size={24} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Completed</p>
            <h2 className="text-3xl font-bold">3</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircle size={24} />
          </div>
        </Card>
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search x-rays..." 
            className="pl-10 bg-white border border-gray-200"
          />
        </div>
        <Button className="bg-black hover:bg-gray-800 gap-2">
          <Upload size={16} />
          Upload New X-ray
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-black rounded-md">
          <TabsTrigger value="all" className="data-[state=active]:bg-black data-[state=active]:text-white">
            All X-rays (5)
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Pending (1)
          </TabsTrigger>
          <TabsTrigger value="processing" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Processing (1)
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-black data-[state=active]:text-white">
            Completed (3)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                  Completed
                </div>
                <div className="absolute top-2 left-20 flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  <Bot size={12} className="mr-1" /> AI Analyzed
                </div>
                <img 
                  src="/lovable-uploads/40dac181-641b-409d-a776-3b4eeb43e298.png" 
                  alt="Heart X-ray" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Rajesh Sharma</h3>
                <p className="text-sm text-gray-500">XR001 | Chest</p>
                <p className="text-sm text-gray-500 mt-2">April 5th, 2023</p>
              </div>
            </Card>
            
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                  Completed
                </div>
                <div className="absolute top-2 left-20 flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  <Bot size={12} className="mr-1" /> AI Analyzed
                </div>
                <img 
                  src="/lovable-uploads/af1b4d48-905c-409b-af69-0eb3bec618a5.png" 
                  alt="Wrist X-ray" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Priya Patel</h3>
                <p className="text-sm text-gray-500">XR002 | Left Wrist</p>
                <p className="text-sm text-gray-500 mt-2">April 6th, 2023</p>
              </div>
            </Card>
            
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-medium">
                  Pending
                </div>
                <img 
                  src="/lovable-uploads/609c1ea7-12ec-44a2-bb9d-5f1ddbbbc93b.png" 
                  alt="Hospital Building" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Amit Kumar</h3>
                <p className="text-sm text-gray-500">XR003 | Lumbar Spine</p>
                <p className="text-sm text-gray-500 mt-2">April 7th, 2023</p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-medium">
                  Pending
                </div>
                <img 
                  src="/lovable-uploads/609c1ea7-12ec-44a2-bb9d-5f1ddbbbc93b.png" 
                  alt="Hospital Building" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Amit Kumar</h3>
                <p className="text-sm text-gray-500">XR003 | Lumbar Spine</p>
                <p className="text-sm text-gray-500 mt-2">April 7th, 2023</p>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="processing">
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
            <Clock className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">1 X-ray currently processing</h3>
            <p className="text-gray-500 mt-2">
              This X-ray is currently being processed and analyzed. This may take a few minutes to complete.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                  Completed
                </div>
                <div className="absolute top-2 left-20 flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  <Bot size={12} className="mr-1" /> AI Analyzed
                </div>
                <img 
                  src="/lovable-uploads/40dac181-641b-409d-a776-3b4eeb43e298.png" 
                  alt="Heart X-ray" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Rajesh Sharma</h3>
                <p className="text-sm text-gray-500">XR001 | Chest</p>
                <p className="text-sm text-gray-500 mt-2">April 5th, 2023</p>
              </div>
            </Card>
            
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                  Completed
                </div>
                <div className="absolute top-2 left-20 flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                  <Bot size={12} className="mr-1" /> AI Analyzed
                </div>
                <img 
                  src="/lovable-uploads/af1b4d48-905c-409b-af69-0eb3bec618a5.png" 
                  alt="Wrist X-ray" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">Priya Patel</h3>
                <p className="text-sm text-gray-500">XR002 | Left Wrist</p>
                <p className="text-sm text-gray-500 mt-2">April 6th, 2023</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default XrayPage;
