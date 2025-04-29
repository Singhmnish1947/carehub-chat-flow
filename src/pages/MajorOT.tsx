
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Clock, Users, Scissors, AlertCircle, Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Surgery {
  id: string;
  patientName: string;
  surgeryType: string;
  surgeonName: string;
  date: string;
  time: string;
  duration: string;
  otNumber: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

const initialSurgeries: Surgery[] = [
  {
    id: "1",
    patientName: "Anil Kumar",
    surgeryType: "Appendectomy",
    surgeonName: "Dr. Sharma",
    date: "2025-04-30",
    time: "09:30",
    duration: "1.5 hours",
    otNumber: "OT #1",
    status: "scheduled"
  },
  {
    id: "2",
    patientName: "Priya Singh",
    surgeryType: "Cholecystectomy",
    surgeonName: "Dr. Patel",
    date: "2025-04-30",
    time: "11:30",
    duration: "2 hours",
    otNumber: "OT #1",
    status: "scheduled"
  },
  {
    id: "3",
    patientName: "Rahul Verma",
    surgeryType: "Hernia Repair",
    surgeonName: "Dr. Gupta",
    date: "2025-05-01",
    time: "10:00",
    duration: "1 hour",
    otNumber: "OT #3",
    status: "scheduled"
  }
];

const MajorOTPage = () => {
  const { toast } = useToast();
  const [surgeries, setSurgeries] = useState<Surgery[]>(initialSurgeries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSurgery, setCurrentSurgery] = useState<Surgery | null>(null);
  
  const [newSurgery, setNewSurgery] = useState<Omit<Surgery, 'id'>>({
    patientName: "",
    surgeryType: "",
    surgeonName: "",
    date: "",
    time: "",
    duration: "",
    otNumber: "OT #1",
    status: "scheduled"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && currentSurgery) {
      setCurrentSurgery({
        ...currentSurgery,
        [name]: value,
      });
    } else {
      setNewSurgery({
        ...newSurgery,
        [name]: value,
      });
    }
  };

  const handleAddSurgery = () => {
    const newId = (surgeries.length + 1).toString();
    const surgeryToAdd = { id: newId, ...newSurgery };
    setSurgeries([...surgeries, surgeryToAdd]);
    setNewSurgery({
      patientName: "",
      surgeryType: "",
      surgeonName: "",
      date: "",
      time: "",
      duration: "",
      otNumber: "OT #1",
      status: "scheduled"
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Surgery Added",
      description: `${newSurgery.surgeryType} for ${newSurgery.patientName} has been scheduled.`,
    });
  };

  const handleEditSurgery = () => {
    if (currentSurgery) {
      setSurgeries(surgeries.map(surgery => 
        surgery.id === currentSurgery.id ? currentSurgery : surgery
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Surgery Updated",
        description: `Surgery details have been updated successfully.`,
      });
    }
  };

  const handleDeleteSurgery = (id: string) => {
    setSurgeries(surgeries.filter(surgery => surgery.id !== id));
    toast({
      title: "Surgery Cancelled",
      description: "The surgery has been cancelled and removed from schedule.",
    });
  };

  const openEditDialog = (surgery: Surgery) => {
    setCurrentSurgery(surgery);
    setIsEditDialogOpen(true);
  };

  const getTotalSurgeriesCount = () => surgeries.length;
  const getTodaySurgeriesCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return surgeries.filter(surgery => surgery.date === today).length;
  };
  const getUpcomingSurgeriesCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return surgeries.filter(surgery => surgery.date > today).length;
  };

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Total Surgeries</p>
            <h2 className="text-3xl font-bold">{getTotalSurgeriesCount()}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Scissors size={20} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Today's Surgeries</p>
            <h2 className="text-3xl font-bold">{getTodaySurgeriesCount()}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <Calendar size={20} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Upcoming</p>
            <h2 className="text-3xl font-bold">{getUpcomingSurgeriesCount()}</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock size={20} />
          </div>
        </Card>
        
        <Card className="p-6 bg-white flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-gray-500 text-sm mb-1">Available OTs</p>
            <h2 className="text-3xl font-bold">3</h2>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <Users size={20} />
          </div>
        </Card>
      </div>
      
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
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Operation Theatre Schedule</h2>
                <p className="text-gray-500">Manage and monitor major surgical procedures</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
                    <Plus size={16} />
                    Schedule Surgery
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule New Surgery</DialogTitle>
                    <DialogDescription>
                      Enter the details of the surgery to be scheduled.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Patient Name</label>
                      <Input
                        name="patientName"
                        className="col-span-3"
                        value={newSurgery.patientName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Surgery Type</label>
                      <Input
                        name="surgeryType"
                        className="col-span-3"
                        value={newSurgery.surgeryType}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Surgeon</label>
                      <Input
                        name="surgeonName"
                        className="col-span-3"
                        value={newSurgery.surgeonName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Date</label>
                      <Input
                        name="date"
                        type="date"
                        className="col-span-3"
                        value={newSurgery.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Time</label>
                      <Input
                        name="time"
                        type="time"
                        className="col-span-3"
                        value={newSurgery.time}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Duration</label>
                      <Input
                        name="duration"
                        className="col-span-3"
                        placeholder="e.g. 1.5 hours"
                        value={newSurgery.duration}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">OT Number</label>
                      <select
                        name="otNumber"
                        className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                        value={newSurgery.otNumber}
                        onChange={handleInputChange}
                      >
                        <option value="OT #1">OT #1</option>
                        <option value="OT #3">OT #3</option>
                        <option value="OT #4">OT #4</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Notes</label>
                      <Textarea
                        name="notes"
                        className="col-span-3"
                        placeholder="Additional notes about the surgery"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={handleAddSurgery}
                    >
                      Schedule Surgery
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Edit Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Surgery Details</DialogTitle>
                    <DialogDescription>
                      Update the details of this scheduled surgery.
                    </DialogDescription>
                  </DialogHeader>
                  {currentSurgery && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Patient Name</label>
                        <Input
                          name="patientName"
                          className="col-span-3"
                          value={currentSurgery.patientName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Surgery Type</label>
                        <Input
                          name="surgeryType"
                          className="col-span-3"
                          value={currentSurgery.surgeryType}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Surgeon</label>
                        <Input
                          name="surgeonName"
                          className="col-span-3"
                          value={currentSurgery.surgeonName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Date</label>
                        <Input
                          name="date"
                          type="date"
                          className="col-span-3"
                          value={currentSurgery.date}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Time</label>
                        <Input
                          name="time"
                          type="time"
                          className="col-span-3"
                          value={currentSurgery.time}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Duration</label>
                        <Input
                          name="duration"
                          className="col-span-3"
                          value={currentSurgery.duration}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">OT Number</label>
                        <select
                          name="otNumber"
                          className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                          value={currentSurgery.otNumber}
                          onChange={handleInputChange}
                        >
                          <option value="OT #1">OT #1</option>
                          <option value="OT #3">OT #3</option>
                          <option value="OT #4">OT #4</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Status</label>
                        <select
                          name="status"
                          className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                          value={currentSurgery.status}
                          onChange={handleInputChange}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Notes</label>
                        <Textarea
                          name="notes"
                          className="col-span-3"
                          value={currentSurgery.notes || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={handleEditSurgery}
                    >
                      Update Surgery
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgery</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgeon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OT Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surgeries.map((surgery) => (
                    <tr key={surgery.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">{surgery.patientName}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{surgery.surgeryType}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{surgery.surgeonName}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date(surgery.date).toLocaleDateString()} at {surgery.time}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{surgery.duration}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{surgery.otNumber}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                            surgery.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            surgery.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            surgery.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {surgery.status.charAt(0).toUpperCase() + surgery.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 border-gray-200 p-1 h-8"
                            onClick={() => openEditDialog(surgery)}
                          >
                            <Edit size={14} />
                            <span className="hidden md:inline">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 border-gray-200 text-red-600 hover:bg-red-50 p-1 h-8"
                            onClick={() => handleDeleteSurgery(surgery.id)}
                          >
                            <Trash2 size={14} />
                            <span className="hidden md:inline">Cancel</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {surgeries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-1">No surgeries scheduled</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    There are currently no surgeries scheduled. Click the button above to schedule a new surgery.
                  </p>
                </div>
              )}
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
