
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, Calendar, Clock, Users, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Procedure {
  id: string;
  patientName: string;
  procedureType: string;
  doctorName: string;
  date: string;
  time: string;
  duration: string;
  roomNumber: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

const initialProcedures: Procedure[] = [
  {
    id: "1",
    patientName: "Rakesh Sharma",
    procedureType: "Wound Cleaning",
    doctorName: "Dr. Verma",
    date: "2025-04-29",
    time: "10:00",
    duration: "30 minutes",
    roomNumber: "Room 1",
    status: "scheduled"
  },
  {
    id: "2",
    patientName: "Sunita Patel",
    procedureType: "Suture Removal",
    doctorName: "Dr. Khan",
    date: "2025-04-29",
    time: "11:00",
    duration: "15 minutes",
    roomNumber: "Room 2",
    status: "scheduled"
  },
  {
    id: "3",
    patientName: "Vishal Singh",
    procedureType: "Cyst Removal",
    doctorName: "Dr. Gupta",
    date: "2025-04-29",
    time: "14:30",
    duration: "45 minutes",
    roomNumber: "Room 1",
    status: "scheduled"
  }
];

const MinorOT = () => {
  const { toast } = useToast();
  const [procedures, setProcedures] = useState<Procedure[]>(initialProcedures);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProcedure, setCurrentProcedure] = useState<Procedure | null>(null);
  
  const [newProcedure, setNewProcedure] = useState<Omit<Procedure, 'id'>>({
    patientName: "",
    procedureType: "",
    doctorName: "",
    date: "",
    time: "",
    duration: "",
    roomNumber: "Room 1",
    status: "scheduled"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && currentProcedure) {
      setCurrentProcedure({
        ...currentProcedure,
        [name]: value,
      });
    } else {
      setNewProcedure({
        ...newProcedure,
        [name]: value,
      });
    }
  };

  const handleAddProcedure = () => {
    const newId = (procedures.length + 1).toString();
    const procedureToAdd = { id: newId, ...newProcedure };
    setProcedures([...procedures, procedureToAdd]);
    setNewProcedure({
      patientName: "",
      procedureType: "",
      doctorName: "",
      date: "",
      time: "",
      duration: "",
      roomNumber: "Room 1",
      status: "scheduled"
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Procedure Added",
      description: `${newProcedure.procedureType} for ${newProcedure.patientName} has been scheduled.`,
    });
  };

  const handleEditProcedure = () => {
    if (currentProcedure) {
      setProcedures(procedures.map(procedure => 
        procedure.id === currentProcedure.id ? currentProcedure : procedure
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Procedure Updated",
        description: `Procedure details have been updated successfully.`,
      });
    }
  };

  const handleDeleteProcedure = (id: string) => {
    setProcedures(procedures.filter(procedure => procedure.id !== id));
    toast({
      title: "Procedure Cancelled",
      description: "The procedure has been cancelled and removed from schedule.",
    });
  };

  const openEditDialog = (procedure: Procedure) => {
    setCurrentProcedure(procedure);
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Minor Operation Theatre</h1>
        <p className="text-gray-500">Manage minor surgical procedures and appointments</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Procedures</p>
              <h3 className="text-3xl font-bold mt-1">{procedures.length}</h3>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Scissors className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
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
        
        <Card>
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
        
        <Card>
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
        <TabsList className="border border-gray-200 p-1 bg-white">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Minor OT Schedule</CardTitle>
                <CardDescription>Schedule and manage minor procedures</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
                    <Plus size={16} />
                    Add Procedure
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule New Procedure</DialogTitle>
                    <DialogDescription>
                      Enter the details of the procedure to be scheduled.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Patient Name</label>
                      <Input
                        name="patientName"
                        className="col-span-3"
                        value={newProcedure.patientName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Procedure Type</label>
                      <Input
                        name="procedureType"
                        className="col-span-3"
                        value={newProcedure.procedureType}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Doctor</label>
                      <Input
                        name="doctorName"
                        className="col-span-3"
                        value={newProcedure.doctorName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Date</label>
                      <Input
                        name="date"
                        type="date"
                        className="col-span-3"
                        value={newProcedure.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Time</label>
                      <Input
                        name="time"
                        type="time"
                        className="col-span-3"
                        value={newProcedure.time}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Duration</label>
                      <Input
                        name="duration"
                        className="col-span-3"
                        placeholder="e.g. 30 minutes"
                        value={newProcedure.duration}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Room Number</label>
                      <select
                        name="roomNumber"
                        className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                        value={newProcedure.roomNumber}
                        onChange={handleInputChange}
                      >
                        <option value="Room 1">Room 1</option>
                        <option value="Room 2">Room 2</option>
                        <option value="Room 3">Room 3</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">Notes</label>
                      <Textarea
                        name="notes"
                        className="col-span-3"
                        placeholder="Additional notes about the procedure"
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
                      onClick={handleAddProcedure}
                    >
                      Schedule Procedure
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Edit Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Procedure Details</DialogTitle>
                    <DialogDescription>
                      Update the details of this scheduled procedure.
                    </DialogDescription>
                  </DialogHeader>
                  {currentProcedure && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Patient Name</label>
                        <Input
                          name="patientName"
                          className="col-span-3"
                          value={currentProcedure.patientName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Procedure Type</label>
                        <Input
                          name="procedureType"
                          className="col-span-3"
                          value={currentProcedure.procedureType}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Doctor</label>
                        <Input
                          name="doctorName"
                          className="col-span-3"
                          value={currentProcedure.doctorName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Date</label>
                        <Input
                          name="date"
                          type="date"
                          className="col-span-3"
                          value={currentProcedure.date}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Time</label>
                        <Input
                          name="time"
                          type="time"
                          className="col-span-3"
                          value={currentProcedure.time}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Duration</label>
                        <Input
                          name="duration"
                          className="col-span-3"
                          value={currentProcedure.duration}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Room Number</label>
                        <select
                          name="roomNumber"
                          className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                          value={currentProcedure.roomNumber}
                          onChange={handleInputChange}
                        >
                          <option value="Room 1">Room 1</option>
                          <option value="Room 2">Room 2</option>
                          <option value="Room 3">Room 3</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium">Status</label>
                        <select
                          name="status"
                          className="col-span-3 w-full p-2 border border-gray-200 rounded-md"
                          value={currentProcedure.status}
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
                          value={currentProcedure.notes || ""}
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
                      onClick={handleEditProcedure}
                    >
                      Update Procedure
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {procedures.map((procedure) => (
                      <tr key={procedure.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">{procedure.patientName}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{procedure.procedureType}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{procedure.doctorName}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {new Date(procedure.date).toLocaleDateString()} at {procedure.time}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{procedure.duration}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{procedure.roomNumber}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span 
                            className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                              procedure.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              procedure.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                              procedure.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {procedure.status.charAt(0).toUpperCase() + procedure.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1 border-gray-200 p-1 h-8"
                              onClick={() => openEditDialog(procedure)}
                            >
                              <Edit size={14} />
                              <span className="hidden md:inline">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1 border-gray-200 text-red-600 hover:bg-red-50 p-1 h-8"
                              onClick={() => handleDeleteProcedure(procedure.id)}
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
                
                {procedures.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-1">No procedures scheduled</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      There are currently no procedures scheduled. Click the button above to add a new procedure.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="procedures" className="mt-6">
          <Card>
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
                className="mt-6 bg-black text-white hover:bg-gray-800"
                onClick={() => toast({ title: "Coming Soon", description: "The procedure management module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-6">
          <Card>
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
                className="mt-6 bg-black text-white hover:bg-gray-800"
                onClick={() => toast({ title: "Coming Soon", description: "The equipment inventory module will be available soon." })}
              >
                Check Back Later
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-6">
          <Card>
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
                className="mt-6 bg-black text-white hover:bg-gray-800"
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
